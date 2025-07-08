/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com", // YouTube's image CDN
      },

      {
        protocol: "https",
        hostname: "utfs.io", // YouTube's image CDN
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // YouTube's image CDN
      },
      {
        protocol: "https",
        hostname: "pub-b44118fa674945bca0bd327b3205ebe6.r2.dev", // YouTube's image CDN
      },
      {
        protocol: "https",
        hostname: "pub-fe7dbda3861b4cc5ae60de9299335651.r2.dev", // YouTube's image CDN
      },
    ],
    unoptimized: false,
    formats: ["image/webp"],
  },
};

export default nextConfig;
