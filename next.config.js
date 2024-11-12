/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable detailed error messages
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig 