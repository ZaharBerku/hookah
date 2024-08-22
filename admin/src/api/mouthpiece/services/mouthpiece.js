'use strict';

/**
 * mouthpiece service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::mouthpiece.mouthpiece');
