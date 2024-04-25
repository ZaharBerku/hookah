'use strict';

/**
 * hookah service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::hookah.hookah');
