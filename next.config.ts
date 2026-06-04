import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow unoptimized images from public folder (svgs etc.)
    dangerouslyAllowSVG: true,
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
