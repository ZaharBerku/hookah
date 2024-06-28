"use strict";
const { intArg, nonNull } = require("nexus");

module.exports = {
  register({ strapi }) {
    const extensionService = strapi.plugin("graphql").service("extension");

    extensionService.use(({ nexus }) => ({
      types: [
        nexus.objectType({
          name: "updateProductByOdIdPayload",
          definition(t) {
            t.field("data", { type: "ProductEntity" });
          },
        }),
        nexus.extendType({
          type: "Mutation",
          definition(t) {
            t.field("updateProductByOdId", {
              type: "updateProductByOdIdPayload",
              args: {
                odId: nonNull(intArg()),
                data: nonNull("ProductInput"),
                locale: "I18NLocaleCode",
              },
              resolve: async (_, { odId, data, locale }, ctx) => {
                const updatedProduct = await strapi
                  .query("api::product.product")
                  .updateMany({
                    where: { odId },
                    data,
                  });
                const { toEntityResponse } = strapi
                  .plugin("graphql")
                  .service("format").returnTypes;
                return toEntityResponse(updatedProduct, {
                  args: { odId, data, locale },
                  resourceUID: "api::product.product",
                });
              },
            });
          },
        }),
      ],
      resolversConfig: {
        "Mutation.updateProductByOdId": {
          auth: {
            scope: ["api::product.product.update"],
          },
        },
      },
    }));
  },
  bootstrap(/*{ strapi }*/) {},
};
