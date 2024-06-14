const { v4: uuidv4 } = require("uuid");

module.exports = {
  async beforeCreate(event) {
    const latestProduct = await strapi.query("api::product.product").findOne({
      orderBy: { odId: "desc" },
    });

    const newOdId = latestProduct ? latestProduct.odId + 1 : 1;
    event.params.data.odId = newOdId;
    event.params.data.compositeId = `${newOdId}-${event.params.data.slug}`;
  },
  async afterUpdate(event) {
    if (
      !event.params.data.compositeId &&
      event.params.data.odId &&
      event.params.data.slug
    ) {
      event.params.data.compositeId = `${event.params.data.odId}-${event.params.data.slug}`;
    } else if (!event.params.data.compositeId) {
      const latestProduct = await strapi.query("api::product.product").findOne({
        orderBy: { odId: "desc" },
        where: { locale: "uk" },
      });
      const newOdId = latestProduct.length > 0 ? latestProduct[0].odId + 1 : 1;
      event.params.data.odId = newOdId;
      event.params.data.compositeId = `${newOdId}-${event.params.data.slug}`;
    }
  },
};