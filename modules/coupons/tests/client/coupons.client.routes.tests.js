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
          mainstate = $state.get('coupons');
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
          liststate = $state.get('coupons.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/coupons/client/views/list-coupons.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CouponsController,
          mockCoupon;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('coupons.view');
          $templateCache.put('/modules/coupons/client/views/view-coupon.client.view.html', '');

          // create mock coupon
          mockCoupon = new CouponsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Coupon about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CouponsController = $controller('CouponsController as vm', {
            $scope: $scope,
            couponResolve: mockCoupon
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:couponId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.couponResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            couponId: 1
          })).toEqual('/coupons/1');
        }));

        it('should attach an coupon to the controller scope', function () {
          expect($scope.vm.coupon._id).toBe(mockCoupon._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/coupons/client/views/view-coupon.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/coupons/client/views/list-coupons.client.view.html', '');

          $state.go('coupons.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('coupons/');
          $rootScope.$digest();

          expect($location.path()).toBe('/coupons');
          expect($state.current.templateUrl).toBe('/modules/coupons/client/views/list-coupons.client.view.html');
        }));
      });
    });
  });
}());
