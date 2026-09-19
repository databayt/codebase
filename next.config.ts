import type { NextConfig } from "next";
import { createMDX } from 'fumadocs-mdx/next'

const nextConfig: NextConfig = {
  // Cloudflare Containers run the standalone server (scripts/deploy-cloudflare.sh sets
  // CF_CONTAINER=1). Vercel builds must NOT be standalone.
  ...(process.env.CF_CONTAINER
    ? {
        output: "standalone" as const,
        // The app reads these off disk at request time — fumadocs sources (docs, docs-ar,
        // atoms, templates) and the atom MDX loader — so tracing must carry them into
        // .next/standalone or every docs route 404s in the container.
        outputFileTracingIncludes: {
          "/**": ["./content/**/*"],
        },
      }
    : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,

  experimental: {
    optimizePackageImports: ["@assistant-ui/react", "@radix-ui/react-icons"],
  },

  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

const withMDX = createMDX()

export default withMDX(nextConfig);
