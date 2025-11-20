import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "http", // localhost usually runs on http
        hostname: "localhost", // allow images from localhost
        port: "3000", // optional: specify port if needed
        pathname: "/products/**", // match all images under /products
      },
      {
        protocol: "https", // localhost usually runs on http
        hostname: "res.cloudinary.com", // allow images from localhost
      },
    ],
  },
};

export default nextConfig;
