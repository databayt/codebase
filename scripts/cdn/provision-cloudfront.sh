#!/usr/bin/env bash
#
# provision-cloudfront.sh — create the net-new CloudFront distribution, Origin
# Access Control (OAC), and ACM certificate that front the databayt-cdn S3
# origin at cdn.databayt.org.
#
# This is the THIRD pillar of the CDN bring-up and pairs with provision-s3.sh:
#   provision-s3.sh        creates the PRIVATE bucket (no policy yet)
#   provision-cloudfront.sh (this)   creates OAC + ACM cert + distribution
#   provision-s3.sh (re-run)         applies the OAC bucket policy locked to the
#                                    distribution ARN this script prints
#
# This REPLACES the dead infra:
#   - old distribution: d1dlwtcfl0db67.cloudfront.net   (gone, DNS dead)
#   - old bucket:       hogwarts-databayt               (AllAccessDisabled)
#   - old IAM key:      AKIA...HY4S                      (InvalidAccessKeyId)
#
# THE CHICKEN-AND-EGG (and how we resolve it):
#   - The S3 bucket policy must name the distribution ARN (aws:SourceArn) to let
#     CloudFront read objects.
#   - But the distribution can't be created until the bucket/origin exists.
#   Resolution / ordering:
#     1. Run provision-s3.sh WITHOUT DISTRIBUTION_ARN -> bucket exists, PRIVATE,
#        no policy. Nothing is exposed.
#     2. Run THIS script -> creates OAC, ACM cert, and the distribution. Prints
#        the distribution ARN/ID/domain.
#     3. RE-RUN provision-s3.sh WITH DISTRIBUTION_ARN=<arn from step 2> -> the
#        OAC bucket policy is applied and locked to this exact distribution.
#   The script reminds you of step 3 at the end.
#
# ACM REGION RULE (do not skip):
#   CloudFront can ONLY use ACM certificates issued in us-east-1, regardless of
#   where your other infra lives. This script HARD-PINS the ACM calls to
#   us-east-1 (ACM_REGION). The S3 bucket also happens to be us-east-1 here, but
#   even if it weren't, the cert would still have to be us-east-1.
#
# Idempotent: safe to re-run. OAC is looked up by name before create; ACM cert
# is looked up by domain before request; the distribution create uses a STABLE
# CallerReference so AWS rejects an accidental duplicate rather than spawning a
# second distribution.
#
# Prereqs:
#   - AWS CLI v2:  brew install awscli   (no reliable npx shim for the v2 CLI)
#   - jq:          brew install jq        (used to strip JSON comments + parse)
#   - Credentials: the admin/bootstrap profile (NOT the CI deploy key). Needs
#                  cloudfront:*, acm:RequestCertificate/Describe*, and sts.
#
# Usage:
#   BUCKET=databayt-cdn \
#   REGION=us-east-1 \
#   DOMAIN=cdn.databayt.org \
#     bash scripts/cdn/provision-cloudfront.sh
#
#   ACM cert validation is DNS-based and asynchronous. On the first run this
#   script will request the cert, PRINT the validation CNAME, and then either
#   wait (WAIT_FOR_ACM=1, default) or exit with instructions (WAIT_FOR_ACM=0).
#   You must add the printed CNAME to DNS for cdn.databayt.org's zone before the
#   cert can reach ISSUED.

set -euo pipefail

# ---- Parameters (env-driven; no secrets baked in) --------------------------
BUCKET="${BUCKET:-databayt-cdn}"
REGION="${REGION:-us-east-1}"
DOMAIN="${DOMAIN:-cdn.databayt.org}"
ACCOUNT_ID="${ACCOUNT_ID:-}"

# ACM for CloudFront is ALWAYS us-east-1. Pinned, not derived from REGION.
ACM_REGION="us-east-1"

# OAC name (stable, used for idempotent lookup-before-create).
OAC_NAME="${OAC_NAME:-databayt-cdn-oac}"

# Wait for the ACM cert to reach ISSUED before creating the distribution.
WAIT_FOR_ACM="${WAIT_FOR_ACM:-1}"

# Resolve the directory this script lives in so the config template is found
# regardless of the caller's CWD (matches provision-s3.sh).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_TEMPLATE="${SCRIPT_DIR}/cloudfront-distribution.json"

# ---- Preflight -------------------------------------------------------------
command -v aws >/dev/null 2>&1 || {
  echo "ERROR: aws CLI not found. Install it:  brew install awscli" >&2
  exit 1
}
command -v jq >/dev/null 2>&1 || {
  echo "ERROR: jq not found. Install it:  brew install jq" >&2
  exit 1
}
[ -f "${DIST_TEMPLATE}" ] || { echo "ERROR: missing ${DIST_TEMPLATE}" >&2; exit 1; }

# Discover ACCOUNT_ID from the caller's credentials if not provided.
if [ -z "${ACCOUNT_ID}" ]; then
  ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
fi

echo "==> Provisioning CloudFront + OAC + ACM for the asset CDN"
echo "    BUCKET      = ${BUCKET}"
echo "    REGION      = ${REGION}   (S3 origin region)"
echo "    ACM_REGION  = ${ACM_REGION}   (CloudFront REQUIRES us-east-1 ACM)"
echo "    DOMAIN      = ${DOMAIN}"
echo "    ACCOUNT_ID  = ${ACCOUNT_ID}"
echo

# ===========================================================================
# (a) Origin Access Control (OAC): create-or-find
# ===========================================================================
# OAC is the modern replacement for OAI. SigV4 signing, always sign, S3 origin.
# Look up by name first so re-runs reuse the same OAC instead of duplicating.
echo "==> [1/4] Ensuring Origin Access Control '${OAC_NAME}' (SigV4 / always / s3)..."

OAC_ID="$(
  aws cloudfront list-origin-access-controls \
    --query "OriginAccessControlList.Items[?Name=='${OAC_NAME}'].Id | [0]" \
    --output text 2>/dev/null || true
)"

if [ -n "${OAC_ID}" ] && [ "${OAC_ID}" != "None" ]; then
  echo "    Found existing OAC: ${OAC_ID}"
else
  echo "    Creating OAC '${OAC_NAME}'..."
  OAC_ID="$(
    aws cloudfront create-origin-access-control \
      --origin-access-control-config "{
        \"Name\": \"${OAC_NAME}\",
        \"Description\": \"OAC for ${BUCKET} (cdn.databayt.org)\",
        \"SigningProtocol\": \"sigv4\",
        \"SigningBehavior\": \"always\",
        \"OriginAccessControlOriginType\": \"s3\"
      }" \
      --query 'OriginAccessControl.Id' \
      --output text
  )"
  echo "    Created OAC: ${OAC_ID}"
fi

# ===========================================================================
# (b) ACM certificate: request-or-find, DNS-validated, MUST be us-east-1
# ===========================================================================
echo "==> [2/4] Ensuring ACM certificate for ${DOMAIN} in ${ACM_REGION}..."

# Find an existing cert for this exact domain (ISSUED or PENDING_VALIDATION).
ACM_CERT_ARN="$(
  aws acm list-certificates \
    --region "${ACM_REGION}" \
    --query "CertificateSummaryList[?DomainName=='${DOMAIN}'].CertificateArn | [0]" \
    --output text 2>/dev/null || true
)"

if [ -n "${ACM_CERT_ARN}" ] && [ "${ACM_CERT_ARN}" != "None" ]; then
  echo "    Found existing cert: ${ACM_CERT_ARN}"
else
  echo "    Requesting new DNS-validated cert for ${DOMAIN}..."
  ACM_CERT_ARN="$(
    aws acm request-certificate \
      --region "${ACM_REGION}" \
      --domain-name "${DOMAIN}" \
      --validation-method DNS \
      --query 'CertificateArn' \
      --output text
  )"
  echo "    Requested cert: ${ACM_CERT_ARN}"
  # ACM populates the validation record asynchronously; give it a moment.
  sleep 5
fi

# Print the DNS validation CNAME so the operator can add it to the zone.
echo
echo "    DNS validation record (add this CNAME to the ${DOMAIN} zone):"
aws acm describe-certificate \
  --region "${ACM_REGION}" \
  --certificate-arn "${ACM_CERT_ARN}" \
  --query 'Certificate.DomainValidationOptions[0].ResourceRecord.{Name:Name,Type:Type,Value:Value}' \
  --output table || true
echo
echo "    (If 'Status' is already ISSUED below, validation is done.)"

# Wait for ISSUED (or instruct and exit). The cert CANNOT be attached to the
# distribution until it is ISSUED.
CERT_STATUS="$(
  aws acm describe-certificate \
    --region "${ACM_REGION}" \
    --certificate-arn "${ACM_CERT_ARN}" \
    --query 'Certificate.Status' --output text
)"
echo "    Current cert status: ${CERT_STATUS}"

if [ "${CERT_STATUS}" != "ISSUED" ]; then
  if [ "${WAIT_FOR_ACM}" = "1" ]; then
    echo "    Waiting for cert to become ISSUED (add the CNAME above now if you"
    echo "    haven't). This blocks until validation completes or times out..."
    # `acm wait certificate-validated` polls until ISSUED (up to ~40 min).
    aws acm wait certificate-validated \
      --region "${ACM_REGION}" \
      --certificate-arn "${ACM_CERT_ARN}"
    echo "    Cert is now ISSUED."
  else
    echo
    echo "ERROR: cert is not ISSUED yet (WAIT_FOR_ACM=0)."
    echo "       1) Add the validation CNAME above to the ${DOMAIN} DNS zone."
    echo "       2) Wait for ACM to validate (minutes, sometimes longer)."
    echo "       3) Re-run this script. It will find the cert and continue."
    exit 1
  fi
fi

# ===========================================================================
# (c) Create the distribution from the rendered template
# ===========================================================================
echo "==> [3/4] Creating CloudFront distribution from ${DIST_TEMPLATE}..."

# Stable CallerReference so an accidental double-run is rejected by AWS instead
# of creating a duplicate distribution. (Change DOMAIN -> new ref -> new distro.)
CALLER_REF="databayt-cdn-${DOMAIN}"

# Render the template: substitute placeholders (sed, same pattern as
# provision-s3.sh), then STRIP the `//`-prefixed documentation keys so the API
# receives clean JSON.
RENDERED_DIST="$(mktemp -t cloudfront-distribution.XXXXXX.json)"
trap 'rm -f "${RENDERED_DIST}"' EXIT

sed \
  -e "s|__OAC_ID__|${OAC_ID}|g" \
  -e "s|__ACM_CERT_ARN__|${ACM_CERT_ARN}|g" \
  -e "s|__CALLER_REF__|${CALLER_REF}|g" \
  "${DIST_TEMPLATE}" \
| jq 'walk(if type == "object" then with_entries(select(.key | startswith("//") | not)) else . end)' \
  > "${RENDERED_DIST}"

echo "    Rendered config -> ${RENDERED_DIST}"
echo "    OAC_ID       = ${OAC_ID}"
echo "    ACM_CERT_ARN = ${ACM_CERT_ARN}"
echo "    CALLER_REF   = ${CALLER_REF}"

# Idempotency: if a distribution with this CallerReference already exists, find
# and reuse it instead of erroring out on a re-run.
EXISTING_DIST_ID="$(
  aws cloudfront list-distributions \
    --query "DistributionList.Items[?Aliases.Items && contains(Aliases.Items, '${DOMAIN}')].Id | [0]" \
    --output text 2>/dev/null || true
)"

if [ -n "${EXISTING_DIST_ID}" ] && [ "${EXISTING_DIST_ID}" != "None" ]; then
  echo "    Distribution for ${DOMAIN} already exists: ${EXISTING_DIST_ID} — reusing."
  DIST_ID="${EXISTING_DIST_ID}"
  DIST_DOMAIN="$(
    aws cloudfront get-distribution \
      --id "${DIST_ID}" \
      --query 'Distribution.DomainName' --output text
  )"
  DIST_ARN="$(
    aws cloudfront get-distribution \
      --id "${DIST_ID}" \
      --query 'Distribution.ARN' --output text
  )"
else
  CREATE_OUT="$(
    aws cloudfront create-distribution \
      --distribution-config "file://${RENDERED_DIST}"
  )"
  DIST_ID="$(echo "${CREATE_OUT}" | jq -r '.Distribution.Id')"
  DIST_DOMAIN="$(echo "${CREATE_OUT}" | jq -r '.Distribution.DomainName')"
  DIST_ARN="$(echo "${CREATE_OUT}" | jq -r '.Distribution.ARN')"
  echo "    Distribution created."
fi

# ===========================================================================
# (d) Report results + the feedback loop into provision-s3.sh
# ===========================================================================
echo
echo "==> [4/4] Distribution ready."
echo "    Distribution ID     = ${DIST_ID}"
echo "    Distribution DOMAIN = ${DIST_DOMAIN}"
echo "    Distribution ARN    = ${DIST_ARN}"
echo
echo "============================================================================"
echo "NEXT — close the loop (the bucket is still private with NO OAC policy):"
echo
echo "  1) Lock the S3 bucket policy to THIS distribution by re-running the S3"
echo "     provisioner with the ARN printed above:"
echo
echo "       ACCOUNT_ID=${ACCOUNT_ID} \\"
echo "       DISTRIBUTION_ARN=${DIST_ARN} \\"
echo "         bash scripts/cdn/provision-s3.sh"
echo
echo "     (This renders bucket-policy.json with __DISTRIBUTION_ARN__ and applies"
echo "     it so CloudFront — and ONLY this distribution — can read objects.)"
echo
echo "  2) Re-point DNS for ${DOMAIN} at the new distribution domain"
echo "     (${DIST_DOMAIN}). See scripts/cdn/dns-repoint.md. The OLD dangling"
echo "     CNAME to d1dlwtcfl0db67.cloudfront.net must be REPLACED, not added."
echo
echo "  3) Seed + invalidate assets using the distribution ID:"
echo "       BUCKET=${BUCKET} DISTRIBUTION_ID=${DIST_ID} \\"
echo "         bash scripts/cdn/sync.sh"
echo
echo "  4) Verify once DNS + cert + deploy have propagated:"
echo "       dig +short ${DOMAIN}"
echo "       curl -I https://${DOMAIN}/anthropic/wordmark.svg   # expect HTTP/2 200"
echo "============================================================================"
