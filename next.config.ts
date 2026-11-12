import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.251.124.149', '10.95.170.149', 'localhost:3000'],
  images: {
    // Allow unoptimized images from public folder (svgs etc.)
    dangerouslyAllowSVG: true,
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
