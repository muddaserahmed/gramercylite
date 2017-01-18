(function () {
  'use strict';

  angular
    .module('coupons.services')
    .factory('CouponsService', CouponsService);

  CouponsService.$inject = ['$resource', '$log'];

  function CouponsService($resource, $log) {
    var Coupon = $resource('/api/coupons/:couponId', {
      couponId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Coupon.prototype, {
      createOrUpdate: function () {
        var coupon = this;
        return createOrUpdate(coupon);
      }
    });

    return Coupon;

    function createOrUpdate(coupon) {
      if (coupon._id) {
        return coupon.$update(onSuccess, onError);
      } else {
        return coupon.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(coupon) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
