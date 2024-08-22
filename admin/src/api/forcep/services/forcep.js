'use strict';

/**
 * forcep service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::forcep.forcep');
