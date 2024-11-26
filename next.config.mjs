/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      enabled: true,
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side polyfills
      config.resolve.fallback = {
        ...config.resolve.fallback,
        querystring: false, // Let webpack handle the polyfill
      };
    }
    return config;
  },
};

export default nextConfig;
