// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Вимкнути ESLint-перевірку під час білду (щоб деплой не падав на лінті)
    ignoreDuringBuilds: true,
  },
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
