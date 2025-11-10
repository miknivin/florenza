/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kids-bags.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d229x2i5qj11ya.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**",
      },
    ],
  },

  async redirects() {
    if (process.env.MAINTENANCE_MODE === "true") {
      return [
        {
          source: "/((?!maintenance|_next|_vercel|.*\\..*).*)",
          destination: "/maintenance",
          permanent: false,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
