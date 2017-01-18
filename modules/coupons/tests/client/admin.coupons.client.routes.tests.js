(function () {
  'use strict';

  describe('Coupons Route Tests', function () {
    // Initialize global variables
    var $scope,
      CouponsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CouponsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CouponsService = _CouponsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.coupons');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/coupons');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('admin.coupons.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/coupons/client/views/admin/list-coupons.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CouponsAdminController,
          mockCoupon;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.coupons.create');
          $templateCache.put('/modules/coupons/client/views/admin/form-coupon.client.view.html', '');

          // Create mock coupon
          mockCoupon = new CouponsService();

          // Initialize Controller
          CouponsAdminController = $controller('CouponsAdminController as vm', {
            $scope: $scope,
            couponResolve: mockCoupon
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.couponResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/coupons/create');
        }));

        it('should attach an coupon to the controller scope', function () {
          expect($scope.vm.coupon._id).toBe(mockCoupon._id);
          expect($scope.vm.coupon._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/coupons/client/views/admin/form-coupon.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CouponsAdminController,
          mockCoupon;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.coupons.edit');
          $templateCache.put('/modules/coupons/client/views/admin/form-coupon.client.view.html', '');

          // Create mock coupon
          mockCoupon = new CouponsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Coupon about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CouponsAdminController = $controller('CouponsAdminController as vm', {
            $scope: $scope,
            couponResolve: mockCoupon
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:couponId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.couponResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            couponId: 1
          })).toEqual('/admin/coupons/1/edit');
        }));

        it('should attach an coupon to the controller scope', function () {
          expect($scope.vm.coupon._id).toBe(mockCoupon._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/coupons/client/views/admin/form-coupon.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
