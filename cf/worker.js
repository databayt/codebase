// codebase (cb.databayt.org) on Cloudflare Containers — the same lane as hogwarts,
// mkan, kun and marketing. A thin Worker forwards every request to one container
// running the Next standalone server, so the app sees the real Host header.
import { Container, getContainer } from "@cloudflare/containers"

export class CodebaseContainer extends Container {
  defaultPort = 3000
  sleepAfter = "24h"

  constructor(ctx, env) {
    super(ctx, env)
    // Every string binding (Worker secrets + vars) becomes container env.
    // Applied at container start only — rotating a secret needs a restart.
    this.envVars = Object.fromEntries(
      Object.entries(env).filter(([, v]) => typeof v === "string")
    )
  }
}

export default {
  async fetch(request, env) {
    return getContainer(env.CODEBASE, "main").fetch(request)
  },
}
