# Re-point `cdn.databayt.org` to the new CloudFront distribution

This is the final wiring step for the net-new asset CDN. It moves the public
hostname `cdn.databayt.org` off the **dead** distribution and onto the new one
created by `scripts/cdn/provision-cloudfront.sh`.

## Background — what is being replaced

| Thing | Old (DEAD) | New |
| --- | --- | --- |
| Distribution domain | `d1dlwtcfl0db67.cloudfront.net` (DNS gone) | the new `dXXXXXXXXXXXXX.cloudfront.net` printed by `provision-cloudfront.sh` |
| S3 origin bucket | `hogwarts-databayt` (AllAccessDisabled) | `databayt-cdn` (private, OAC-only) |
| IAM deploy key | `AKIA…HY4S` (InvalidAccessKeyId) | new key from `iam-deploy-policy.json` |

`cdn.databayt.org` currently **CNAMEs to the dead distro**. That record is a
**dangling pointer** — it resolves to nothing useful. You must **replace** it
with a record pointing at the new distribution. Do **not** add a second record
alongside the old one: two records for the same name will conflict (or, for
ALIAS/CNAME, the registrar will reject it). **Remove the old → add the new.**

> Prereqs: AWS CLI v2 if you use the Route 53 CLI path — `brew install awscli`.
> You also need the **new distribution domain** from the provisioner output
> (referred to below as `NEW_DIST_DOMAIN`, e.g. `d111abcdef8.cloudfront.net`).

---

## Order of operations (important)

1. **ACM cert is ISSUED** and attached to the distribution
   (`provision-cloudfront.sh` enforces this). The cert's own DNS *validation*
   CNAME is a **separate** record from the one below — leave it in place; ACM
   re-checks it on renewal.
2. **Bucket policy is applied** — you have already re-run `provision-s3.sh` with
   `DISTRIBUTION_ARN=…` so CloudFront can read the bucket. (If not, do that
   first, or every object returns `AccessDenied`.)
3. **Then** re-point the hostname as below.

---

## Option A — Route 53 (recommended): ALIAS A + AAAA

When the `databayt.org` zone is hosted in Route 53, use an **ALIAS** record, not
a CNAME. ALIAS is free, resolves at the apex of the subdomain without an extra
lookup, and supports both IPv4 (A) and IPv6 (AAAA). The distribution has
`IsIPV6Enabled: true`, so create **both**.

The CloudFront hosted-zone ID is the **fixed global constant** `Z2FDTNDATAQYW2`
(same for every CloudFront distribution — do not look it up per-distribution).

### A.1 — Console

1. Route 53 → Hosted zones → `databayt.org`.
2. Find the **existing** `cdn` record pointing at `d1dlwtcfl0db67.cloudfront.net`
   and **delete** it (or edit it in place).
3. Create record:
   - **Record name:** `cdn`
   - **Record type:** `A`
   - **Alias:** ON → *Alias to CloudFront distribution* → select the new
     distribution (`NEW_DIST_DOMAIN`).
4. Repeat for a second record, identical but **Record type `AAAA`**.

### A.2 — CLI (UPSERT replaces any existing record of that name+type)

```bash
# Look up the hosted zone id for databayt.org
HOSTED_ZONE_ID="$(aws route53 list-hosted-zones-by-name \
  --dns-name databayt.org \
  --query 'HostedZones[0].Id' --output text | sed 's#/hostedzone/##')"

NEW_DIST_DOMAIN="d111abcdef8.cloudfront.net"   # <-- from provision-cloudfront.sh

aws route53 change-resource-record-sets \
  --hosted-zone-id "${HOSTED_ZONE_ID}" \
  --change-batch "{
    \"Comment\": \"Re-point cdn.databayt.org to new CloudFront distribution\",
    \"Changes\": [
      {
        \"Action\": \"UPSERT\",
        \"ResourceRecordSet\": {
          \"Name\": \"cdn.databayt.org\",
          \"Type\": \"A\",
          \"AliasTarget\": {
            \"HostedZoneId\": \"Z2FDTNDATAQYW2\",
            \"DNSName\": \"${NEW_DIST_DOMAIN}\",
            \"EvaluateTargetHealth\": false
          }
        }
      },
      {
        \"Action\": \"UPSERT\",
        \"ResourceRecordSet\": {
          \"Name\": \"cdn.databayt.org\",
          \"Type\": \"AAAA\",
          \"AliasTarget\": {
            \"HostedZoneId\": \"Z2FDTNDATAQYW2\",
            \"DNSName\": \"${NEW_DIST_DOMAIN}\",
            \"EvaluateTargetHealth\": false
          }
        }
      }
    ]
  }"
```

`UPSERT` **overwrites** the old `cdn` A/AAAA record — exactly the "replace, not
add" behavior we want. If the dead record was a `CNAME` (not A/AAAA), delete it
first (DNS does not allow a CNAME and an A record to coexist on the same name).

---

## Option B — Generic registrar / non-Route 53 DNS: CNAME

When DNS lives at a registrar (Cloudflare, Namecheap, GoDaddy, etc.) that has no
CloudFront ALIAS, use a plain **CNAME**:

1. Open the DNS panel for `databayt.org`.
2. **Find and delete** (or edit) the existing record:
   `cdn  CNAME  d1dlwtcfl0db67.cloudfront.net`
3. Set it to the new distribution:

   | Type | Name | Value | TTL |
   | --- | --- | --- | --- |
   | `CNAME` | `cdn` | `d111abcdef8.cloudfront.net` (your `NEW_DIST_DOMAIN`) | 300 (low while cutting over) |

   - Do **not** include a trailing scheme or path — just the hostname.
   - If on Cloudflare, set the record to **DNS only (grey cloud)** so CloudFront
     terminates TLS with the ACM cert. An orange-cloud proxy in front of
     CloudFront double-proxies and breaks the OAC/host expectations.
4. Leave the separate **ACM validation CNAME** untouched.

---

## Verification

DNS and ACM both take time. ACM validation can take minutes; CloudFront config
propagation and DNS TTL expiry can each take several minutes to ~an hour. Be
patient and re-check.

```bash
# 1) Does the name now resolve to the NEW distribution (or its edge IPs)?
dig +short cdn.databayt.org
#   Route 53 ALIAS -> a set of CloudFront edge IP addresses
#   CNAME path     -> shows d111abcdef8.cloudfront.net then edge IPs
#   It must NOT still say d1dlwtcfl0db67.cloudfront.net.

# 2) End-to-end HTTPS fetch of a known asset — expect HTTP/2 200.
curl -I https://cdn.databayt.org/anthropic/wordmark.svg
#   Expect:
#     HTTP/2 200
#     content-type: image/svg+xml
#     cache-control: public, max-age=31536000, immutable
#     x-cache: Hit from cloudfront   (or "Miss from cloudfront" on first hit)
#     via: ... cloudfront ...
```

### If it doesn't work yet

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `dig` still shows `d1dlwtcfl0db67…` | DNS cache / TTL not expired, or old record not actually removed | Wait for TTL; confirm the old record is deleted, not duplicated |
| `curl` → SSL/cert error | ACM cert not ISSUED, or not yet attached/propagated | Confirm cert `ISSUED` in us-east-1; wait for CloudFront to deploy |
| `curl` → 403 `AccessDenied` (XML) | Bucket policy not locked to the distro | Re-run `provision-s3.sh` with `DISTRIBUTION_ARN=…` |
| `curl` → 404 `NoSuchKey` | Asset not uploaded | Run `scripts/cdn/sync.sh` with `DISTRIBUTION_ID=…` |
| Connection works but content is stale | Edge cache holds old bytes | `sync.sh` issues a `/*` invalidation; or invalidate manually |

Once `curl -I https://cdn.databayt.org/anthropic/wordmark.svg` returns
`HTTP/2 200` with `image/svg+xml`, the cut-over is complete.
