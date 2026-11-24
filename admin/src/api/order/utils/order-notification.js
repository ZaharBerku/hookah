"use strict";

const ORDER_UID = "api::order.order";

const markOrderNotified = async (strapi, orderId) => {
  const query = strapi.db.query(ORDER_UID);
  const { count } = await query.updateMany({
    where: { id: orderId, notifiedAt: { $null: true } },
    data: { notifiedAt: new Date() },
  });
  if (count > 0) return { found: true, marked: true };
  const order = await query.findOne({ where: { id: orderId } });
  return { found: Boolean(order), marked: false };
};

module.exports = { markOrderNotified };
