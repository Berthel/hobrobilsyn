/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { dev, isServer }) => {
    // Deaktiver caching i development mode
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
