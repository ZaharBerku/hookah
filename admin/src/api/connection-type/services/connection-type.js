'use strict';

/**
 * connection-type service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::connection-type.connection-type');
