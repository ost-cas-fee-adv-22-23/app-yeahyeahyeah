/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/qwacker-api-prod-data/**',
      },
    ],
    minimumCacheTTL: 1500000,
  },
};

module.exports = nextConfig;

// Twin config: must included AFTER nextConfig
const withTwin = require('./withTwin.js');
module.exports = withTwin({
  reactStrictMode: true,
});
