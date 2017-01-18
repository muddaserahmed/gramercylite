(function () {
  'use strict';

  angular
    .module('coupons.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('coupons', {
        abstract: true,
        url: '/coupons',
        template: '<ui-view/>'
      })
      .state('coupons.list', {
        url: '',
        templateUrl: '/modules/coupons/client/views/list-coupons.client.view.html',
        controller: 'CouponsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Coupons List'
        }
      })
      .state('coupons.view', {
        url: '/:couponId',
        templateUrl: '/modules/coupons/client/views/view-coupon.client.view.html',
        controller: 'CouponsController',
        controllerAs: 'vm',
        resolve: {
          couponResolve: getCoupon
        },
        data: {
          pageTitle: 'Coupon {{ couponResolve.title }}'
        }
      });
  }

  getCoupon.$inject = ['$stateParams', 'CouponsService'];

  function getCoupon($stateParams, CouponsService) {
    return CouponsService.get({
      couponId: $stateParams.couponId
    }).$promise;
  }
}());
