module.exports = {
  async beforeCreate(event) {
    event.params.data.order = event.params.data.order.map((product) => {
      product.numberOf = product.numberOf - product.quantity;
      return product;
    });
    const products = await Promise.all(
      event.params.data.order.map(async (product) => {
        const data = await strapi.query("api::product.product").findMany({
          where: { odId: product.odId },
        });
        return {
          data,
          quantity: product.quantity,
        };
      })
    );
    await Promise.all(
      products.map(async (product) => {
        return await Promise.all(
          product.data.map((item) => {
            return strapi.query("api::product.product").update({
              where: { id: item.id },
              data: {
                numberOf: item.numberOf - product.quantity,
              },
            });
          })
        );
      })
    );
  },
  async afterUpdate(event) {
    console.log(event.params.data.order, "event.params.data.order");
    if (event.params.data.status === "Скасовано") {
      const products = await Promise.all(
        event.params.data.order.map(async (product) => {
          const data = await strapi.query("api::product.product").findMany({
            where: { odId: product.odId },
          });
          return {
            data,
            quantity: product.quantity,
          };
        })
      );
      await Promise.all(
        products.map(async (product) => {
          return await Promise.all(
            product.data.map((item) => {
              return strapi.query("api::product.product").update({
                where: { id: item.id },
                data: {
                  numberOf: +item.numberOf + +product.quantity,
                },
              });
            })
          );
        })
      );
    }
  },
};
