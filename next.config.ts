import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // Prevent native SQLite addon from being bundled in the production serverless output
    config.externals = [
      ...(config.externals ?? []),
      'better-sqlite3',
      '@prisma/adapter-better-sqlite3',
    ]
    return config
  },
};

export default nextConfig;
