/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@opendevelopment/shared-types'],
  webpack: (config) => {
    // Resolve .js imports to .ts source files in workspace packages
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
    };
    return config;
  },
};

export default nextConfig;
