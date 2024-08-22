'use strict';

/**
 * calaud service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::calaud.calaud');
