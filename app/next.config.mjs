/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: false,
  env: {
    API_TOKEN: process.env.API_TOKEN,
    STRAPI_URL: process.env.STRAPI_URL
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
  },
  async redirects() {
    return [
      // Handle duplicate pages with 301 redirects

      // {
      //   source: '/:path*',
      //   has: [{ type: 'host', value: 'www.hookahstore.com.ua' }],
      //   destination: 'https://hookahstore.com.ua/:path*',
      //   permanent: true,
      // },
      // {
      //   source: '/:path*',
      //   has: [{ type: 'host', value: 'hookahstore.com.ua' }],
      //   destination: 'https://hookahstore.com.ua/:path*',
      //   permanent: true,
      // },
      {
        source:
          "/:path((?!_next|uk|ru|favicon\\.ico|.*\\.(?:jpg|jpeg|png|svg|css|js|webp|gif)).*)",
        destination: "/uk",
        permanent: true
      }
    ];
  }
};

export default withNextIntl(nextConfig);
