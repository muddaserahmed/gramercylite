'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Coupon = mongoose.model('Coupon'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an coupon
 */
exports.create = function (req, res) {

  if ( req.user.stripe_key ){
    var stripe = require('stripe')(
      req.user.stripe_key
    );

    stripe.coupons.create({
      percent_off: req.body.percent_off,
      duration: req.body.duration,
      duration_in_months: req.body.duration_in_months,
      id: req.body.id
    }, function(err, coupon) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(coupon);
      }
    });
  } else {
    return res.status(422).send({
      message: 'Add stripe key'
    });
  }


  // var coupon = new Coupon(req.body);
  // coupon.user = req.user;

  // coupon.save(function (err) {
  //   if (err) {
  //     return res.status(422).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(coupon);
  //   }
  // });
};

/**
 * Show the current coupon
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var coupon = req.coupon ? req.coupon : {};

  // Add a custom field to the Coupon, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Coupon model.
  coupon.isCurrentUserOwner = !!(req.user && coupon.user && coupon.user._id.toString() === req.user._id.toString());

  res.json(coupon);
};

/**
 * Update an coupon
 */
// exports.update = function (req, res) {
//   var coupon = req.coupon;

//   coupon.title = req.body.title;
//   coupon.content = req.body.content;

//   coupon.save(function (err) {
//     if (err) {
//       return res.status(422).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.json(coupon);
//     }
//   });
// };

/**
 * Delete an coupon
 */
exports.delete = function (req, res) {
  var coupon = req.coupon;

  var stripe = require("stripe")(
    req.user.stripe_key
  );

  stripe.coupons.del(coupon.id);

  res.json(coupon);

  // coupon.remove(function (err) {
  //   if (err) {
  //     return res.status(422).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(coupon);
  //   }
  // });
};

/**
 * List of Coupons
 */
exports.list = function (req, res) {
  var stripe = require('stripe')(
    req.user.stripe_key
  );

  console.log(req.user.stripe_key);

  stripe.coupons.list({ },
    function(err, coupons) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log(coupons.data);
        res.json(coupons.data);
      }
    }
  );

  // Coupon.find().sort('-created').populate('user', 'displayName').exec(function (err, coupons) {
  //   if (err) {
  //     return res.status(422).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(coupons);
  //   }
  // });
};

/**
 * Coupon middleware
 */
exports.couponByID = function (req, res, next, id) {


  var stripe = require('stripe')(
    req.user.stripe_key
  );

  stripe.coupons.retrieve(
    id,
    function(err, coupon) {
      if (err) {
        return next(err);
      } else if (!coupon) {
        return res.status(404).send({
          message: 'No coupon with that identifier has been found'
        });
      }
      req.coupon = coupon;
      next();
    }
  );


  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).send({
  //     message: 'Coupon is invalid'
  //   });
  // }

  // Coupon.findById(id).populate('user', 'displayName').exec(function (err, coupon) {
  //   if (err) {
  //     return next(err);
  //   } else if (!coupon) {
  //     return res.status(404).send({
  //       message: 'No coupon with that identifier has been found'
  //     });
  //   }
  //   req.coupon = coupon;
  //   next();
  // });
};
