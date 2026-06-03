import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow unoptimized images from public folder (svgs etc.)
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
