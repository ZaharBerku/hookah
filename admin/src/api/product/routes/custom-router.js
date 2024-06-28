"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/product/updateProductByOdId/:odId",
      handler: "api::product.product.updateProductByOdId",
    },
  ],
};
