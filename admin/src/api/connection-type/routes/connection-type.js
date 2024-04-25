'use strict';

/**
 * connection-type router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::connection-type.connection-type');
