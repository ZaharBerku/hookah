'use strict';

/**
 * accessory service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::accessory.accessory');
