import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      new URL('https://api.baiwumm.com/**'),
      new URL('https://cdn.baiwumm.com/**'),
      new URL('https://athbiwlqrieaoetfapxd.supabase.co/**')
    ]
  },
};

export default nextConfig;
