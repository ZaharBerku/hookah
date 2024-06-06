/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  env: {
    API_TOKEN: process.env.API_TOKEN
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: "./public/icons" // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        use: ["@svgr/webpack"]
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  images: {
    domains: ["strapi-hookah-images.s3.us-east-1.amazonaws.com"]
  }
};

export default withNextIntl(nextConfig);
