'use strict';

/**
 * bowl service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bowl.bowl');
