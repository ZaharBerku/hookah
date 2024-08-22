'use strict';

/**
 * bowl router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::bowl.bowl');
