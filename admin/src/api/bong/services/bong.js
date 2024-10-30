'use strict';

/**
 * bong service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bong.bong');
