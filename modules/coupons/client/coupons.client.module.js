(function (app) {
  'use strict';

  app.registerModule('coupons', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('coupons.admin', ['core.admin']);
  app.registerModule('coupons.admin.routes', ['core.admin.routes']);
  app.registerModule('coupons.services');
  app.registerModule('coupons.routes', ['ui.router', 'core.routes', 'coupons.services']);
}(ApplicationConfiguration));
