export const replaceS3WithCDN = (url: string): string => {
  if (!url) return url;
  return url.replace(
    "https://strapi-hookah-images.s3.us-east-1.amazonaws.com",
    "https://d2l5za98n7intq.cloudfront.net"
  );
};
