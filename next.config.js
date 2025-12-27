/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'paevnqrsogtdedqxjzlu.supabase.co',
        pathname: '/storage/v1/object/public/profile-pics/**',
      },
    ],
  },
};

module.exports = nextConfig;