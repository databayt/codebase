#!/usr/bin/env bash
#
# provision-s3.sh — create + configure the net-new "databayt-cdn" S3 origin
# for cdn.databayt.org (CloudFront + Origin Access Control).
#
# This REPLACES the dead infra:
#   - old bucket:       hogwarts-databayt        (AllAccessDisabled)
#   - old distribution: d1dlwtcfl0db67...        (gone, DNS dead)
#   - old IAM key:      AKIA...HY4S              (InvalidAccessKeyId)
#
# Design:
#   - Block Public Access fully ON; no public ACLs ever.
#   - Access is granted ONLY to CloudFront via a bucket policy that uses the
#     modern Origin Access Control (OAC) model, scoped by aws:SourceArn to the
#     specific distribution ARN. (We do NOT use the legacy OAI.)
#   - Default SSE-S3 (AES256) encryption + versioning for rollback/audit.
#
# Idempotent: safe to re-run. Each step either creates-if-missing or re-applies
# the desired configuration (which AWS treats as a no-op when unchanged).
#
# Prereqs:
#   - AWS CLI v2:  brew install awscli   (or:  pipx install awscli / the official
#                  installer. There is no reliable `npx` shim for the v2 CLI.)
#   - Credentials: an admin/bootstrap profile (NOT the CI deploy key) able to run
#                  s3api + put-bucket-policy. Configure via `aws configure` or
#                  AWS_PROFILE / AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY.
#
# Usage:
#   ACCOUNT_ID=123456789012 \
#   DISTRIBUTION_ARN=arn:aws:cloudfront::123456789012:distribution/E1ABCDEF2GHIJK \
#     bash scripts/cdn/provision-s3.sh
#
# If the distribution does not exist yet, you can run WITHOUT DISTRIBUTION_ARN to
# create the bucket first, then RE-RUN once the real ARN is known to lock down
# the policy. (The bucket is private the whole time — nothing is exposed.)

set -euo pipefail

# ---- Parameters (env-driven; no secrets baked in) --------------------------
BUCKET="${BUCKET:-databayt-cdn}"
REGION="${REGION:-us-east-1}"
ACCOUNT_ID="${ACCOUNT_ID:-}"
DISTRIBUTION_ARN="${DISTRIBUTION_ARN:-}"

# Resolve the directory this script lives in, so policy/CORS json files are found
# regardless of the caller's CWD.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
POLICY_TEMPLATE="${SCRIPT_DIR}/bucket-policy.json"
CORS_FILE="${SCRIPT_DIR}/cors.json"

# ---- Preflight -------------------------------------------------------------
command -v aws >/dev/null 2>&1 || {
  echo "ERROR: aws CLI not found. Install it:  brew install awscli" >&2
  exit 1
}
[ -f "${POLICY_TEMPLATE}" ] || { echo "ERROR: missing ${POLICY_TEMPLATE}" >&2; exit 1; }
[ -f "${CORS_FILE}" ]       || { echo "ERROR: missing ${CORS_FILE}" >&2; exit 1; }

# Discover ACCOUNT_ID from the caller's credentials if not provided.
if [ -z "${ACCOUNT_ID}" ]; then
  ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
fi

if [ -z "${DISTRIBUTION_ARN}" ]; then
  echo "WARNING: DISTRIBUTION_ARN is empty."
  echo "         The bucket will be created PRIVATE, but the OAC bucket policy"
  echo "         will NOT be applied (CloudFront would get AccessDenied)."
  echo "         Re-run this script with DISTRIBUTION_ARN set once the"
  echo "         distribution exists to finish the wiring."
fi

echo "==> Provisioning S3 origin"
echo "    BUCKET           = ${BUCKET}"
echo "    REGION           = ${REGION}"
echo "    ACCOUNT_ID       = ${ACCOUNT_ID}"
echo "    DISTRIBUTION_ARN = ${DISTRIBUTION_ARN:-<unset>}"
echo

# ---- 1) Create the bucket --------------------------------------------------
# us-east-1 quirk: the API REJECTS a LocationConstraint of us-east-1. Every
# OTHER region REQUIRES it. Branch accordingly. Treat "already owned by you" as
# success so re-runs are clean.
if aws s3api head-bucket --bucket "${BUCKET}" 2>/dev/null; then
  echo "==> [1/6] Bucket ${BUCKET} already exists — skipping create."
else
  echo "==> [1/6] Creating bucket ${BUCKET} in ${REGION}..."
  if [ "${REGION}" = "us-east-1" ]; then
    aws s3api create-bucket \
      --bucket "${BUCKET}" \
      --region us-east-1
  else
    aws s3api create-bucket \
      --bucket "${BUCKET}" \
      --region "${REGION}" \
      --create-bucket-configuration LocationConstraint="${REGION}"
  fi
fi

# Enforce bucket-owner ownership (disables ACLs entirely — the modern default).
# This guarantees no object can ever be made public via an ACL.
echo "==> Enforcing BucketOwnerEnforced object ownership (ACLs disabled)..."
aws s3api put-bucket-ownership-controls \
  --bucket "${BUCKET}" \
  --ownership-controls 'Rules=[{ObjectOwnership=BucketOwnerEnforced}]'

# ---- 2) Versioning ---------------------------------------------------------
echo "==> [2/6] Enabling versioning..."
aws s3api put-bucket-versioning \
  --bucket "${BUCKET}" \
  --versioning-configuration Status=Enabled

# ---- 3) Default encryption (SSE-S3 / AES256) -------------------------------
# SSE-S3 is the zero-cost, zero-key-management default. (Switch to aws:kms here
# if a CMK + key policy is ever required for compliance.)
echo "==> [3/6] Enabling default SSE-S3 (AES256) encryption..."
aws s3api put-bucket-encryption \
  --bucket "${BUCKET}" \
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": { "SSEAlgorithm": "AES256" },
        "BucketKeyEnabled": true
      }
    ]
  }'

# ---- 4) Block Public Access (FULL) -----------------------------------------
# All four flags ON. Public access is impossible; CloudFront reaches objects
# only through the OAC bucket policy below.
echo "==> [4/6] Applying FULL Block Public Access..."
aws s3api put-public-access-block \
  --bucket "${BUCKET}" \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# ---- 5) CORS ---------------------------------------------------------------
# Allows the showroom + product origins to fetch assets (GET/HEAD) from the
# browser. CORS lives on S3 but CloudFront forwards it; safe to set here.
echo "==> [5/6] Applying CORS configuration from ${CORS_FILE}..."
aws s3api put-bucket-cors \
  --bucket "${BUCKET}" \
  --cors-configuration "file://${CORS_FILE}"

# ---- 6) Bucket policy (CloudFront OAC) -------------------------------------
# Render the policy template, substituting the real bucket / account / arn.
# Only applied when DISTRIBUTION_ARN is known (otherwise CloudFront has nothing
# to authorize against and we'd just write a broken/empty condition).
if [ -n "${DISTRIBUTION_ARN}" ]; then
  echo "==> [6/6] Applying OAC bucket policy (scoped to ${DISTRIBUTION_ARN})..."
  RENDERED_POLICY="$(
    sed \
      -e "s|__BUCKET__|${BUCKET}|g" \
      -e "s|__ACCOUNT_ID__|${ACCOUNT_ID}|g" \
      -e "s|__DISTRIBUTION_ARN__|${DISTRIBUTION_ARN}|g" \
      "${POLICY_TEMPLATE}"
  )"
  aws s3api put-bucket-policy \
    --bucket "${BUCKET}" \
    --policy "${RENDERED_POLICY}"
else
  echo "==> [6/6] SKIPPED bucket policy (DISTRIBUTION_ARN unset). Re-run later."
fi

echo
echo "==> Done. Bucket ${BUCKET} is private and CloudFront-ready."
echo
echo "Next steps:"
echo "  1. If you skipped the policy, create the CloudFront distribution with an"
echo "     Origin Access Control (OAC, signing=sigv4, behavior=always), origin ="
echo "     ${BUCKET}.s3.${REGION}.amazonaws.com, then RE-RUN this script with"
echo "     DISTRIBUTION_ARN set."
echo "  2. Request an ACM cert for cdn.databayt.org in us-east-1 (DNS-validated)"
echo "     and attach it as the distribution's alternate domain name."
echo "  3. Re-point cdn.databayt.org DNS (CNAME / Route53 alias) at the NEW"
echo "     distribution domain (dXXXX.cloudfront.net). The old dangling record"
echo "     must be replaced."
echo "  4. Create the CI deploy IAM user + access key with"
echo "     scripts/cdn/iam-deploy-policy.json (substitute __BUCKET__ /"
echo "     __ACCOUNT_ID__ / __DISTRIBUTION_ID__) and put the new key in Vercel"
echo "     envs + the org .env files (replacing the dead AKIA...HY4S key)."
echo "  5. Seed objects with the dedicated helper (sets correct Content-Type per"
echo "     extension AND invalidates CloudFront — do NOT use a bare 'aws s3 sync',"
echo "     which mis-types SVG and never busts the immutable edge cache):"
echo "       BUCKET=${BUCKET} DISTRIBUTION_ID=E1ABCDEF2GHIJK \\"
echo "         bash scripts/cdn/sync.sh"
echo "  6. Build the manifest from the live bucket:"
echo "       CDN_BUCKET=${BUCKET} AWS_REGION=${REGION} \\"
echo "         NEXT_PUBLIC_CDN_DOMAIN=cdn.databayt.org pnpm tsx scripts/build-cdn-manifest.ts"
