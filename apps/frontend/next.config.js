/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest.json$/],
})

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // App Router is stable in Next.js 14
  },
  images: {
    remotePatterns: [],
  },
}

module.exports = withPWA(nextConfig)
