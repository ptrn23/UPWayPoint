/** @type {import('next').NextConfig} */

const hostnames = ["pub-6c943fcf0c9447139d523a8511236ae8.r2.dev"];

const nextConfig = {
  images: {
    remotePatterns: hostnames.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
