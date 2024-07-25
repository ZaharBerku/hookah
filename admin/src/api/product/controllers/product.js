// @ts-nocheck
'use strict';

/**
 * product controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  async updateProductByOdId(ctx) {
    const { odId } = ctx.request.params;
    const data = ctx.request.body;
    await strapi.query("api::product.product").updateMany({
      where: { odId: odId },
      data: data.data,
    });
  },
}));
