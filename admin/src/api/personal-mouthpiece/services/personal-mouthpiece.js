'use strict';

/**
 * personal-mouthpiece service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::personal-mouthpiece.personal-mouthpiece');
