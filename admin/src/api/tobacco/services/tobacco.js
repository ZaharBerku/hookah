'use strict';

/**
 * tobacco service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tobacco.tobacco');
