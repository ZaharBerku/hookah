'use strict';

/**
 * flask controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::flask.flask');
