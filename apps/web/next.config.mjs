/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'github.com' },
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'randomuser.me' },
      {
        protocol: 'https',
        hostname: '25728500aa2bde6316cb0af0dc4f224f.r2.cloudflarestorage.com',
        port: '',
        pathname: '/wr-market/**',
      },
      { hostname: '25728500aa2bde6316cb0af0dc4f224f.r2.cloudflarestorage.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3334/api/:path*', // URL da sua API
      },
    ]
  },
}

export default nextConfig
