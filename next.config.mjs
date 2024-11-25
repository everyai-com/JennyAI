/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, nextRuntime }) => {
    if (!isServer || (isServer && nextRuntime === "edge")) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        net: false,
        tls: false,
        fs: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        url: false,
      };
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
