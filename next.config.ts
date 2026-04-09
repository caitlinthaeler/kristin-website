import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'r2-worker.caitlin-thaeler.workers.dev',
      },
    ],
  },
}

export default nextConfig
