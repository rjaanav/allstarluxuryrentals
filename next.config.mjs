/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'plus.unsplash.com',
      'lh3.googleusercontent.com',
      'avfpbbtfsvobgjguihmx.supabase.co'
    ],
    unoptimized: true,
  },
  experimental: {
    serverActions: {},
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://allstarluxuryrentals-jaanavs-projects.vercel.app'
  }
}

export default nextConfig
