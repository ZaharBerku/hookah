'use strict';

/**
 * hose service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::hose.hose');
