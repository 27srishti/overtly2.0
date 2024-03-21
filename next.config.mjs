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
};

export default nextConfig;
