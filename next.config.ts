import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import path from 'path'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false, // Disable strict mode to prevent double rendering

  // Windows-specific optimizations to prevent file lock issues
  experimental: {
    // Disable instrumentation that can cause file locks
    instrumentationHook: false,
    // Use in-memory caching instead of file system
    optimizePackageImports: ["@assistant-ui/react", "@radix-ui/react-icons"],
  },

  // Disable telemetry which can cause trace file issues
  telemetry: false,

  // Use custom build ID to avoid conflicts
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },

  // Webpack configuration for .source path
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/.source': path.resolve(__dirname, '.source'),
    }
    return config
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

export default withMDX(nextConfig);
