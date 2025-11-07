/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "kids-bags.s3.eu-north-1.amazonaws.com",
      "d229x2i5qj11ya.cloudfront.net",
      "scontent.cdninstagram.com",
      "instagram.com",
      "ik.imagekit.io",
    ],
  },
  async redirects() {
    if (process.env.MAINTENANCE_MODE === "true") {
      return [
        {
          source: "/((?!maintenance|_next|_vercel|.*\\..*).*)",
          destination: "/maintenance",
          permanent: false, // 302 redirect
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
