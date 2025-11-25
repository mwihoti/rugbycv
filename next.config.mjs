/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      // Ignore missing optional peer dependencies
      {
        module: /node_modules\/@metamask\/sdk/,
      },
    ];
    return config;
  },
};

export default nextConfig;
