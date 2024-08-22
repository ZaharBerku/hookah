'use strict';

/**
 * flask service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::flask.flask');
