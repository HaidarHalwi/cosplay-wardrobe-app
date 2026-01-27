import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'down-id.img.susercontent.com',
      },
    ],
  },
  // Hapus bagian eslint yang lama karena sudah tidak didukung di v16
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;