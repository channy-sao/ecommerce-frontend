import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    position: "bottom-right"
  },
  experimental: {
    optimizeCss: true
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
    images: {
        domains: ['localhost'], // Add localhost
        // Or use remotePatterns for more control:
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/storage/upload/products/**',
            },
            {
                protocol: 'https',
                hostname: 'your-production-domain.com',
                pathname: '/storage/upload/products/**',
            },
        ],
        // Disable image optimization in development
        unoptimized: process.env.NODE_ENV === 'development',
    },
};

export default nextConfig;

