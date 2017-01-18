(function () {
  'use strict';

  // Configuring the Coupons Admin module
  angular
    .module('coupons.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Coupons',
      state: 'admin.coupons.list'
    });
  }
}());
