const {
  ORDER_UID,
  prepareOrderData,
  reserveStockForOrder,
  syncOrderUpdate,
} = require("../../utils/order-stock");

module.exports = {
  async beforeCreate(event) {
    await prepareOrderData(strapi, event.params.data);
  },
  async afterCreate(event) {
    const { result } = event;
    if (!result) return;
    try {
      await reserveStockForOrder(strapi, result.id);
    } catch (error) {
      try {
        await strapi.db.query(ORDER_UID).delete({ where: { id: result.id } });
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
    if (!data) return;
    delete data.stockReserved;
    if (await syncOrderUpdate(strapi, where, data)) delete data.status;
  },
};
