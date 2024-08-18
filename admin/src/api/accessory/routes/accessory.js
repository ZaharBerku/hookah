'use strict';

/**
 * accessory router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::accessory.accessory');
