(function () {
  'use strict';

  angular
    .module('coupons.admin')
    .controller('CouponsAdminListController', CouponsAdminListController);

  CouponsAdminListController.$inject = ['CouponsService', '$window', '$http'];

  function CouponsAdminListController(CouponsService, $window, $http) {
    var vm = this;

    vm.coupons = CouponsService.query();

    vm.remove = remove;

    // Remove existing Coupon
    function remove(id, index) {
      if ($window.confirm('Are you sure you want to delete?')) {
        
        // $http.delete('/api/coupons/' + id , function(err, res){
       	  
        // })

        $http.delete('/api/coupons/' + id )
       .then(
           function(response){
              vm.coupons.splice(  index, 1 );
              Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Coupon deleted successfully!' }); 
           }, 
           function(response){
             // failure call back
           }
        );

        // vm.coupon.$remove(function() {
        //   $state.go('admin.coupons.list');
        //   Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Coupon deleted successfully!' });
        // });
      }
    }



  }
}());
