/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ["desisports.milanchheda.com", "localhost"],
    unoptimized: true,
  },
};

export default nextConfig;
