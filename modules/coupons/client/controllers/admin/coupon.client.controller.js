(function () {
  'use strict';

  angular
    .module('coupons.admin')
    .controller('CouponsAdminController', CouponsAdminController);

  CouponsAdminController.$inject = ['$scope', '$state', '$window', 'couponResolve', 'Authentication', 'Notification'];

  function CouponsAdminController($scope, $state, $window, coupon, Authentication, Notification) {
    var vm = this;

    vm.coupon = coupon;
    vm.coupon.duration = 'repeating';
    vm.authentication = Authentication;
    vm.form = {};
    vm.save = save;

    

    // Save Coupon
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.couponForm');
        return false;
      }

      // Create a new coupon, or update the current instance
      vm.coupon.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.coupons.list'); // should we send the User to the list or the updated Coupon's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Coupon saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Coupon save error!' });
      }
    }
  }
}());
