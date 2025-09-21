// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ac.goit.global",
        pathname: "/fullstack/react/**",
      },
      {
        protocol: "https",
        hostname: "notehub-api.goit.study",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
