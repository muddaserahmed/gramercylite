(function () {
  'use strict';

  angular
    .module('coupons')
    .controller('CouponsController', CouponsController);

  CouponsController.$inject = ['$scope', 'couponResolve', 'Authentication'];

  function CouponsController($scope, coupon, Authentication) {
    var vm = this;

    vm.coupon = coupon;
    vm.authentication = Authentication;

  }
}());
