import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // https://github.com/vercel/next.js/discussions/12373
  rewrites: async () => {
    return [
      {
        source: "/reader",
        destination: "/reader/index.html",
      },
    ];
  },
};

export default nextConfig;
