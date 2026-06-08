import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/hn56l1ht/production/**",
      },
    ],
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
