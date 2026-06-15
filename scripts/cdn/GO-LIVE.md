# CDN go-live runbook — databayt-cdn → CloudFront → cdn.databayt.org

Everything below is ready; the ONLY missing input is **admin AWS credentials** (the active
`hogwarts-s3-uploader` key is a scoped uploader — it can `PutObject` but cannot create a
bucket / distribution / cert). Prereqs already done: AWS CLI v2 installed, provisioning
scripts executable, `pnpm cdn:sync` dry-run = 1747 objects, manifest builder ready, 1080
clickview assets staged in `public/cdn/clickview/`.

## TL;DR — one command (after admin auth)
```bash
aws configure                 # paste an AdministratorAccess key
bash scripts/cdn/go-live.sh   # creates bucket+CF+cert, syncs, manifest, verifies 200
```
`go-live.sh` chains every step below and pauses twice for the two DNS records only you can
add (ACM validation CNAME, then the `cdn.databayt.org` repoint). It fails the preflight
immediately with a clear message if the active key isn't admin. The manual steps below are
the same sequence, broken out for when you want to run/debug a single stage.

## 0. Authenticate (the gate)
```bash
aws configure                 # paste a fresh IAM access key + secret (active account)
aws sts get-caller-identity   # must succeed before continuing
```

## 1. Create the S3 origin
```bash
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text) \
  bash scripts/cdn/provision-s3.sh
# bucket databayt-cdn, Block Public Access, versioning, SSE, CORS. (OAC policy deferred to step 3.)
```

## 2. Create CloudFront + ACM cert
```bash
bash scripts/cdn/provision-cloudfront.sh
# creates OAC, requests ACM cert for cdn.databayt.org (us-east-1) — ADD the printed DNS
# validation CNAME, wait for ISSUED — then creates the distribution.
# Prints DISTRIBUTION_ARN, DISTRIBUTION_ID, DISTRIBUTION_DOMAIN.
```

## 3. Lock the bucket to the distribution (OAC)
```bash
DISTRIBUTION_ARN=<arn-from-step-2> \
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text) \
  bash scripts/cdn/provision-s3.sh
```

## 4. Re-point DNS
Follow `scripts/cdn/dns-repoint.md`: replace the dangling `cdn.databayt.org` record
(it points at the dead `d1dlwtcfl0db67…`) with the new distribution domain.
Verify: `dig +short cdn.databayt.org` and `curl -I https://cdn.databayt.org/...` → 200.

## 5. Upload all assets + invalidate
```bash
CDN_BUCKET=databayt-cdn AWS_REGION=us-east-1 \
DISTRIBUTION_ID=<id-from-step-2> \
  pnpm cdn:sync
# uploads ~1747 objects (anthropic + clickview + hogwarts) with correct content-types +
# immutable cache, then a CloudFront /* invalidation. Harvest rules skip 120 junk.
```

## 6. Regenerate the live manifest (urlBase → CloudFront)
```bash
CDN_BUCKET=databayt-cdn AWS_REGION=us-east-1 \
NEXT_PUBLIC_CDN_DOMAIN=cdn.databayt.org \
  pnpm cdn:manifest
git add src/registry/cdn-manifest.json && git commit -m "chore(cdn): live manifest from databayt-cdn"
```

## 7. Wire consumers
- Set `NEXT_PUBLIC_CDN_DOMAIN=cdn.databayt.org` in codebase + each product env.
- Store the new deploy IAM key (the `iam-deploy-policy.json` user) in Vercel envs, replacing the dead `…HY4S`.
- hogwarts: set `CLICKVIEW_KEYS=1`, reseed; verify a lesson page renders its cover from `cdn.databayt.org/clickview/...`.

Done → `https://cdn.databayt.org/clickview/elementary-math-thumbnail.jpg` serves 200.
