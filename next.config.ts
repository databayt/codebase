import type { NextConfig } from "next";
import { createMDX } from 'fumadocs-mdx/next'

const nextConfig: NextConfig = {
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
