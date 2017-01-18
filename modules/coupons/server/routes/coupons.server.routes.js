'use strict';

/**
 * Module dependencies
 */
var couponsPolicy = require('../policies/coupons.server.policy'),
  coupons = require('../controllers/coupons.server.controller');

module.exports = function (app) {
  // Coupons collection routes
  app.route('/api/coupons').all(couponsPolicy.isAllowed)
    .get(coupons.list)
    .post(coupons.create);

  // Single coupon routes
  app.route('/api/coupons/:couponId').all(couponsPolicy.isAllowed)
    .get(coupons.read)
    // .put(coupons.update)
    .delete(coupons.delete);

  // Finish by binding the coupon middleware
  app.param('couponId', coupons.couponByID);
};
