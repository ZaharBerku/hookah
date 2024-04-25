'use strict';

/**
 * hookah router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::hookah.hookah');
