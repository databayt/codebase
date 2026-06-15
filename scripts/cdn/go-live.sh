#!/usr/bin/env bash
#
# go-live.sh — one command that brings up the entire databayt-cdn → CloudFront →
# cdn.databayt.org stack, end to end. It chains the two provisioners (and the
# re-run that closes the OAC loop), then syncs assets, rebuilds the live
# manifest, and verifies a 200 — so the operator never has to hand-copy the
# distribution ARN from one script into the next (the usual fumble point).
#
# THIS SCRIPT NEEDS ADMIN AWS CREDENTIALS. A scoped uploader key (e.g.
# hogwarts-s3-uploader, which can only PutObject) WILL fail the preflight below
# with a clear message — it physically cannot create a bucket / distribution /
# cert. Authenticate an admin profile first:
#
#     aws configure        # paste an AdministratorAccess key
#     bash scripts/cdn/go-live.sh
#
# TWO HUMAN PAUSES are unavoidable (they involve your DNS provider, which no AWS
# key can touch). The script tells you exactly what to paste and waits:
#   (A) ACM validation CNAME — add it so the TLS cert can reach ISSUED.
#   (B) Final repoint — point cdn.databayt.org at the new distribution domain.
# Set SKIP_DNS_WAIT=1 to skip pause (B)'s polling if you'll repoint later.
#
# Idempotent: every underlying step is create-or-find, so a re-run after a
# transient failure resumes cleanly.

set -euo pipefail

BUCKET="${BUCKET:-databayt-cdn}"
REGION="${REGION:-us-east-1}"
DOMAIN="${DOMAIN:-cdn.databayt.org}"
VERIFY_KEY="${VERIFY_KEY:-clickview/elementary-math-thumbnail.jpg}"
SKIP_DNS_WAIT="${SKIP_DNS_WAIT:-0}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

say()  { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
die()  { printf '\n\033[1;31mERROR: %s\033[0m\n' "$*" >&2; exit 1; }

# ---------------------------------------------------------------------------
# Preflight — fail fast with an actionable message if the key isn't admin.
# ---------------------------------------------------------------------------
say "Preflight: tooling + admin authority"
command -v aws >/dev/null 2>&1 || die "aws CLI not found. brew install awscli"
command -v jq  >/dev/null 2>&1 || die "jq not found. brew install jq"

CALLER_ARN="$(aws sts get-caller-identity --query Arn --output text 2>/dev/null)" \
  || die "no valid AWS credentials. Run: aws configure"
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
echo "    identity = ${CALLER_ARN}"
echo "    account  = ${ACCOUNT_ID}"

# Probe the three authorities the bring-up actually needs. We use harmless
# list/describe calls; AccessDenied on ANY of them means this is not an admin
# key and provisioning would explode halfway through.
probe_fail=0
aws s3api list-buckets                         >/dev/null 2>&1 || probe_fail=1
aws cloudfront list-distributions              >/dev/null 2>&1 || probe_fail=1
aws acm list-certificates --region us-east-1   >/dev/null 2>&1 || probe_fail=1
if [ "${probe_fail}" = "1" ]; then
  cat >&2 <<EOF

ERROR: the active key lacks provisioning authority (s3 / cloudfront / acm).
       It looks like a scoped uploader, not an admin.

       Grant admin (one of):
         • IAM → Users → <this user> → Attach policies → AdministratorAccess
         • or create a fresh AdministratorAccess key and: aws configure

       Then re-run: bash scripts/cdn/go-live.sh
       (After go-live you can detach admin again — ongoing 'pnpm cdn:sync'
        only needs s3:PutObject + cloudfront:CreateInvalidation.)
EOF
  exit 1
fi
echo "    authority = OK (s3 + cloudfront + acm reachable)"

# ---------------------------------------------------------------------------
# Step 1 — create the private S3 origin (no OAC policy yet).
# ---------------------------------------------------------------------------
say "[1/6] Create private S3 origin: ${BUCKET}"
ACCOUNT_ID="${ACCOUNT_ID}" BUCKET="${BUCKET}" REGION="${REGION}" \
  bash "${SCRIPT_DIR}/provision-s3.sh"

# ---------------------------------------------------------------------------
# Step 2 — OAC + ACM cert + distribution. Blocks on ACM ISSUED; you must add
# the printed validation CNAME (human pause A) for it to complete.
# ---------------------------------------------------------------------------
say "[2/6] Create OAC + ACM cert + CloudFront distribution"
echo "    NOTE: when the ACM validation CNAME prints below, add it to the"
echo "          ${DOMAIN} DNS zone — this step blocks until the cert is ISSUED."
BUCKET="${BUCKET}" REGION="${REGION}" DOMAIN="${DOMAIN}" WAIT_FOR_ACM=1 \
  bash "${SCRIPT_DIR}/provision-cloudfront.sh"

# Discover the distribution we just created (by alias) — robust vs parsing stdout.
say "Resolving distribution for ${DOMAIN}"
DIST_ID="$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Aliases.Items && contains(Aliases.Items, '${DOMAIN}')].Id | [0]" \
  --output text)"
[ -n "${DIST_ID}" ] && [ "${DIST_ID}" != "None" ] \
  || die "could not find a distribution aliased to ${DOMAIN} after provisioning."
DIST_DOMAIN="$(aws cloudfront get-distribution --id "${DIST_ID}" \
  --query 'Distribution.DomainName' --output text)"
DIST_ARN="$(aws cloudfront get-distribution --id "${DIST_ID}" \
  --query 'Distribution.ARN' --output text)"
echo "    DIST_ID     = ${DIST_ID}"
echo "    DIST_DOMAIN = ${DIST_DOMAIN}"
echo "    DIST_ARN    = ${DIST_ARN}"

# ---------------------------------------------------------------------------
# Step 3 — re-run the S3 provisioner WITH the ARN to apply the OAC bucket
# policy (this is the hand-off that's easy to forget when done manually).
# ---------------------------------------------------------------------------
say "[3/6] Lock bucket policy to distribution (OAC)"
ACCOUNT_ID="${ACCOUNT_ID}" BUCKET="${BUCKET}" REGION="${REGION}" \
DISTRIBUTION_ARN="${DIST_ARN}" \
  bash "${SCRIPT_DIR}/provision-s3.sh"

# ---------------------------------------------------------------------------
# Step 4 — human pause B: repoint cdn.databayt.org at the new distribution.
# ---------------------------------------------------------------------------
say "[4/6] Re-point DNS: ${DOMAIN}  ->  ${DIST_DOMAIN}"
cat <<EOF
    Replace (do NOT add) the dangling ${DOMAIN} record with:

        ${DOMAIN}.   CNAME   ${DIST_DOMAIN}.

    (Route53: an A/AAAA ALIAS to the distribution is preferred at the apex —
     but ${DOMAIN} is a subdomain, so a CNAME is correct here.)
    Details: scripts/cdn/dns-repoint.md
EOF
if [ "${SKIP_DNS_WAIT}" = "1" ]; then
  echo "    SKIP_DNS_WAIT=1 — not polling. Repoint later, then run steps 5-6 manually."
else
  echo "    Polling 'dig +short ${DOMAIN}' every 30s for the new target (Ctrl-C to skip)…"
  for _ in $(seq 1 60); do
    resolved="$(dig +short "${DOMAIN}" 2>/dev/null | tr -d '\n' || true)"
    case "${resolved}" in
      *"${DIST_DOMAIN}"*|*cloudfront.net*) echo "    resolved -> ${resolved}"; break ;;
      *) printf '.' ;;
    esac
    sleep 30
  done
  echo
fi

# ---------------------------------------------------------------------------
# Step 5 — upload all assets + CloudFront invalidation.
# ---------------------------------------------------------------------------
say "[5/6] Sync assets to ${BUCKET} + invalidate"
( cd "${REPO_ROOT}" && \
  CDN_BUCKET="${BUCKET}" AWS_REGION="${REGION}" DISTRIBUTION_ID="${DIST_ID}" \
    pnpm cdn:sync )

# ---------------------------------------------------------------------------
# Step 6 — rebuild the live manifest (urlBase -> CloudFront) + verify 200.
# ---------------------------------------------------------------------------
say "[6/6] Rebuild live manifest + verify"
( cd "${REPO_ROOT}" && \
  CDN_BUCKET="${BUCKET}" AWS_REGION="${REGION}" NEXT_PUBLIC_CDN_DOMAIN="${DOMAIN}" \
    pnpm cdn:manifest )

echo
say "Verifying https://${DOMAIN}/${VERIFY_KEY}"
code="$(curl -s -o /dev/null -w '%{http_code}' "https://${DOMAIN}/${VERIFY_KEY}" || echo 000)"
if [ "${code}" = "200" ]; then
  printf '\n\033[1;32m✓ LIVE — https://%s/%s -> %s\033[0m\n' "${DOMAIN}" "${VERIFY_KEY}" "${code}"
  echo "  Commit the regenerated src/registry/cdn-manifest.json."
else
  printf '\n\033[1;33m! https://%s/%s -> %s (DNS/cert/cache may still be propagating)\033[0m\n' \
    "${DOMAIN}" "${VERIFY_KEY}" "${code}"
  echo "  Re-check in a few minutes:  curl -I https://${DOMAIN}/${VERIFY_KEY}"
fi
