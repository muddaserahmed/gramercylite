(function () {
  'use strict';

  angular
    .module('coupons.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.coupons', {
        abstract: true,
        url: '/coupons',
        template: '<ui-view/>'
      })
      .state('admin.coupons.list', {
        url: '',
        templateUrl: '/modules/coupons/client/views/admin/list-coupons.client.view.html',
        controller: 'CouponsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.coupons.create', {
        url: '/create',
        templateUrl: '/modules/coupons/client/views/admin/form-coupon.client.view.html',
        controller: 'CouponsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          couponResolve: newCoupon
        }
      })
      .state('admin.coupons.edit', {
        url: '/:couponId/edit',
        templateUrl: '/modules/coupons/client/views/admin/form-coupon.client.view.html',
        controller: 'CouponsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          couponResolve: getCoupon
        }
      });
  }

  getCoupon.$inject = ['$stateParams', 'CouponsService'];

  function getCoupon($stateParams, CouponsService) {
    return CouponsService.get({
      couponId: $stateParams.couponId
    }).$promise;
  }

  newCoupon.$inject = ['CouponsService'];

  function newCoupon(CouponsService) {
    return new CouponsService();
  }
}());
