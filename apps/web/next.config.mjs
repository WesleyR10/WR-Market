/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'github.com' },
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'randomuser.me' },
    ],
  },
}

export default nextConfig
