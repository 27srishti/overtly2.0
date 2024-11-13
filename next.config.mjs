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
        destination: 'https://overtly-backend-87008435117.us-central1.run.app/:path*',
      },
    ];
  },
};

export default nextConfig;
