import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverActions: { bodySizeLimit: '4mb' },
    proxyClientMaxBodySize: '4mb',
  },
};

export default nextConfig;
