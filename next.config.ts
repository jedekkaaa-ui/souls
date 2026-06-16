import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude native SQLite addon from serverless bundle (dev-only packages)
  serverExternalPackages: ['better-sqlite3', '@prisma/adapter-better-sqlite3'],
};

export default nextConfig;
