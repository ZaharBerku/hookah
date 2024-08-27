'use strict';

/**
 * heat-regulator service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::heat-regulator.heat-regulator');
