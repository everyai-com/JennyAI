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
        net: false,
        tls: false,
        fs: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        querystring: false,
        zlib: false,
        path: false,
        url: false,
        util: false,
        os: false,
        assert: false,
        constants: false,
        timers: false,
        "process/browser": false,
      };
    }

    // Fix for the "Can't resolve 'net'" error
    if (!isServer) {
      config.module = {
        ...config.module,
        exprContextCritical: false,
      };
    }

    return config;
  },
  // Add this to handle API routes properly
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
