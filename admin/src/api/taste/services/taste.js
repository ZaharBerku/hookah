'use strict';

/**
 * taste service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::taste.taste');
