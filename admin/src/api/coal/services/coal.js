'use strict';

/**
 * coal service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::coal.coal');
