/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add raw-loader for HTML files
    config.module.rules.push({
      test: /\.html$/i,
      loader: "raw-loader",
    });

    return config;
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://pr-ai-99.uc.r.appspot.com/:path*',
      },
    ];
  },
  publicRuntimeConfig: {

    // Your allowed origins

    CORS_ORIGIN: ['https://pr-99-87008435117.us-central1.run.app/', 'http://localhost:3000' , '*'],

  },

};

export default nextConfig;
