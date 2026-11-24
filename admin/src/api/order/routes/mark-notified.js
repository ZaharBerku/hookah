"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/orders/:id/mark-notified",
      handler: "order.markNotified",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
