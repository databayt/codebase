#!/usr/bin/env bash
# codebase (cb.databayt.org) → Cloudflare Containers. Builds the Next standalone server on
# the Mac, wraps it in a COPY-only linux/amd64 image, smokes it locally, deploys it behind
# the Worker in cf/worker.js. Same lane as hogwarts, mkan, kun and marketing.
#
#   scripts/deploy-cloudflare.sh <env-file> build|smoke|deploy|all
#
# <env-file>  a dotenv with the PRODUCTION values (vercel env pull). Non-secret vars are
#             baked into the image as env.json; secrets go to the Worker as secrets.
# build       export the source, install, next build (standalone) with CF_CONTAINER=1
# smoke       docker build (linux/amd64) + run on :3500, print the curl table and peak memory
# deploy      push secrets, then wrangler deploy (builds + pushes the image; Workers Paid)
#
# CF_SOURCE=<ref>|head|worktree  what to build (default head). Use worktree only deliberately:
#             this repo's working tree carries ~1 GB of untracked `public/cdn` sync output (the
#             local seed preview of what cdn.databayt.org already serves), plus scratch PNGs and
#             build logs. rsync copies all of it into the image; git archive of HEAD is 58 MB.
# CF_BUILD_DIR, CF_HEAP_MB (4096), NEXT_BUILD_CPUS (2): this 16 GB machine OOM-kills bigger
#             builds when other sessions are resident.
set -euo pipefail
cd "$(dirname "$0")/.."
ENV_FILE=${1:?dotenv with production values}; MODE=${2:-all}
ENV_FILE=$(cd "$(dirname "$ENV_FILE")" && pwd)/$(basename "$ENV_FILE")
BUILD_DIR=${CF_BUILD_DIR:-${TMPDIR:-/tmp}/codebase-cf-build}
IMAGE=codebase-cf:local

build() {
  local SOURCE=${CF_SOURCE:-head}
  rm -rf "$BUILD_DIR"; mkdir -p "$BUILD_DIR"
  if [[ "$SOURCE" == "worktree" ]]; then
    echo "==> copying the WORKING TREE ($(git rev-parse --short HEAD) + uncommitted changes) to $BUILD_DIR"
    rsync -a --exclude node_modules --exclude .next --exclude .vercel --exclude .wrangler \
      --exclude .git --exclude coverage --exclude .source ./ "$BUILD_DIR/" \
      || { rc=$?; [[ $rc == 23 || $rc == 24 ]] && echo "    (rsync $rc: files changed under us; continuing)" || exit $rc; }
  else
    local REF=$SOURCE; [[ "$REF" == "head" ]] && REF=HEAD
    echo "==> exporting $REF ($(git rev-parse --short "$REF")) to $BUILD_DIR"
    git archive "$REF" | tar -x -C "$BUILD_DIR"
  fi
  cd "$BUILD_DIR"

  echo "==> installing (postinstall: prisma generate + fumadocs-mdx)"
  pnpm install --frozen-lockfile --prefer-offline --silent

  echo "==> next build (standalone) with $ENV_FILE"
  export CF_CONTAINER=1 NODE_OPTIONS="--max-old-space-size=${CF_HEAP_MB:-4096}" NEXT_TELEMETRY_DISABLED=1 NEXT_BUILD_CPUS=${NEXT_BUILD_CPUS:-2}
  node cf/env-split.mjs "$ENV_FILE" run -- pnpm exec next build
  [[ -f .next/standalone/server.js ]] || { echo "ABORT: .next/standalone/server.js missing"; exit 1; }

  # These are read off disk at request time; a missing one is a 404 at runtime, not a build error.
  for p in content/docs content/docs-ar content/atoms content/templates; do
    [[ -e ".next/standalone/$p" ]] && echo "    traced: $p" || echo "    WARNING: $p not traced into standalone"
  done
  # The container is Debian; a darwin-only Prisma engine passes every page render and then
  # fails on the first query. Check the Linux engine actually rode along.
  if find .next/standalone -name 'libquery_engine-debian*' -o -name 'libquery_engine-linux*' | grep -q .; then
    echo "    traced: prisma linux query engine"
  else
    echo "    WARNING: no linux prisma query engine in standalone — DB queries will fail in the container"
  fi

  echo "==> assembling: baked non-secret config"
  node cf/env-split.mjs "$ENV_FILE" config > .next/standalone/env.json
  echo "    env.json: $(node -e 'console.log(Object.keys(require("./.next/standalone/env.json")).length)') config vars"
  du -sh .next/standalone .next/static public | sed 's/^/    /'
}

smoke() {
  cd "$BUILD_DIR"
  # Dockerfile.cf COPYs .cf-deploy-stamp as its last layer, so it must exist before the build.
  date -u +%FT%TZ > .cf-deploy-stamp
  echo "==> docker build (linux/amd64, COPY-only)"
  docker build --platform linux/amd64 -f Dockerfile.cf -t "$IMAGE" . 2>&1 | tail -3
  # A pipeline exits with tail's status, so check docker's real result.
  [[ ${PIPESTATUS[0]} -eq 0 ]] || { echo "ABORT: docker build failed"; exit 1; }
  local DENV; DENV=$(mktemp -t codebase-smoke.XXXXXX); trap 'rm -f "$DENV"' RETURN
  node cf/env-split.mjs "$ENV_FILE" docker > "$DENV"
  docker rm -f codebase-cf-smoke >/dev/null 2>&1 || true
  echo "==> docker run :3500"
  docker run -d --rm --name codebase-cf-smoke --platform linux/amd64 -p 3500:3000 --memory 4g --env-file "$DENV" "$IMAGE" >/dev/null
  local i
  for i in $(seq 1 90); do curl -sf -o /dev/null "http://localhost:3500/" && break; sleep 2; done
  echo "    boot: ${i}x2s"
  for p in / /en /ar /en/docs /en/atoms /en/templates /en/login; do
    printf "    %-22s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code} %{redirect_url} %{time_total}s' "http://localhost:3500$p")"
  done
  printf "    %-22s %s\n" "Host cb.databayt.org /" "$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' -H 'Host: cb.databayt.org' http://localhost:3500/)"
  echo "==> memory after the probes: $(docker stats --no-stream --format '{{.MemUsage}} ({{.MemPerc}})' codebase-cf-smoke)"
  echo "==> container log tail"; docker logs --tail 15 codebase-cf-smoke 2>&1 | sed 's/^/    /'
  docker stop codebase-cf-smoke >/dev/null
}

deploy() {
  cd "$BUILD_DIR"
  # A byte-identical image does not restart the running container, so Worker vars and secrets
  # pushed since the last deploy would never reach it. The stamp is the image's last (tiny)
  # layer: every deploy is a new image, and the instance restarts with the current env.
  date -u +%FT%TZ > .cf-deploy-stamp
  echo "==> pushing secrets to the Worker"
  node cf/env-split.mjs "$ENV_FILE" secrets | pnpm exec wrangler secret bulk
  echo "==> wrangler deploy (builds + pushes the image; needs Workers Paid; stamp $(cat .cf-deploy-stamp))"
  pnpm exec wrangler deploy
}

case "$MODE" in
  build) build ;;
  smoke) smoke ;;
  deploy) deploy ;;
  all) build; smoke; deploy ;;
  *) echo "mode must be build|smoke|deploy|all"; exit 2 ;;
esac
echo "==> done ($MODE)"
