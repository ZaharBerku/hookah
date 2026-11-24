'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { markOrderNotified } = require('../utils/order-notification');

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async markNotified(ctx) {
    const orderId = Number(ctx.params.id);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return ctx.badRequest('Order id is invalid');
    }
    const { found, marked } = await markOrderNotified(strapi, orderId);
    if (!found) return ctx.notFound('Order not found');
    return { data: { id: orderId, marked } };
  },
}));
