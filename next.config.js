/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["kids-bags.s3.eu-north-1.amazonaws.com",
     "d229x2i5qj11ya.cloudfront.net",
      'scontent.cdninstagram.com', 'instagram.com'
   
  ],
    
  },
};

module.exports = nextConfig;
