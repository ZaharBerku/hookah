'use strict';

/**
 * saucer service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::saucer.saucer');
