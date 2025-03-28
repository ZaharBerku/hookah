module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'strapi-provider-upload-aws-s3-resizing-and-optimisation',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        optimizeOptions: {
          jpeg: {
            quality: 70,
            progressive: true,
          },
          png: {
            compressionLevel: 9,
            quality: 70,
            palette: true
          },
          webp: {
            quality: 70,
            smartSubsample: true
          },
          avif: {
            quality: 70,
            effort: 4
          },
        },
        imageSizes: [
          {
            name: 'medium',
            resizeOptions: {
              width: 400
            },
            isGenerateWebp: true,
            isGenerateAvif: true
          },
          {
            name: 'small',
            resizeOptions: {
              width: 250
            },
            isGenerateWebp: true,
            isGenerateAvif: true
          },
          {
            name: 'thumbnail',
            resizeOptions: {
              width: 180
            },
            isGenerateWebp: true,
            isGenerateAvif: true
          },
        ],
        params: {
          ACL: env("AWS_ACL", "public-read"),
          signedUrlExpires: env("AWS_SIGNED_URL_EXPIRES", 15 * 60),
          Bucket: env('AWS_BUCKET'),
        },
      },
    },
  },
  graphql: {
    config: {
      endpoint: "/graphql",
      shadowCRUD: true,
      playgroundAlways: true,
      depthLimit: 15,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET", "your-generated-jwt-secret"),
    },
  },
  "strapi-plugin-populate-deep": {
    config: {
      defaultDepth: 5,
    },
  },
});
