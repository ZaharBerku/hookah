const {
  CANCELLED_STATUS,
  getRestockItems,
  prepareOrderData,
  releaseStock,
} = require("../../utils/order-stock");

const ORDER_UID = "api::order.order";

module.exports = {
  async beforeCreate(event) {
    await prepareOrderData(strapi, event.params.data);
  },
  async beforeUpdate(event) {
    const previous = await strapi.db
      .query(ORDER_UID)
      .findOne({ where: event.params.where });
    event.state.previousStatus = previous?.status;
  },
  async afterUpdate(event) {
    const { result, state } = event;
    if (
      result?.status === CANCELLED_STATUS &&
      state.previousStatus !== CANCELLED_STATUS
    ) {
      await releaseStock(strapi, getRestockItems(result.order));
    }
  },
};
