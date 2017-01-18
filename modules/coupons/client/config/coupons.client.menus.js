(function () {
  'use strict';

  angular
    .module('coupons')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Coupons',
      state: 'coupons',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'coupons', {
      title: 'List Coupons',
      state: 'coupons.list',
      roles: ['*']
    });
  }
}());
