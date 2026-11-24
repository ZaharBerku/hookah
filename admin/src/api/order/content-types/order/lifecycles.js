const {
  CANCELLED_STATUS,
  ORDER_UID,
  prepareOrderData,
  reserveStockForOrder,
  syncStockWithStatus,
} = require("../../utils/order-stock");

module.exports = {
  async beforeCreate(event) {
    await prepareOrderData(strapi, event.params.data);
  },
  async afterCreate(event) {
    const { result } = event;
    if (!result || result.status === CANCELLED_STATUS) return;
    try {
      await reserveStockForOrder(strapi, result.order);
    } catch (error) {
      try {
        await strapi.db
          .query(ORDER_UID)
          .delete({ where: { id: result.id } });
      } catch (deleteError) {
        strapi.log.error(
          `Order ${result.id} was created without reserved stock`,
          deleteError
        );
      }
      throw error;
    }
  },
  async beforeUpdate(event) {
    const { where, data } = event.params;
    await syncStockWithStatus(strapi, where, data?.status);
  },
};
