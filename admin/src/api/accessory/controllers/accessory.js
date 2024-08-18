'use strict';

/**
 * accessory controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::accessory.accessory');
