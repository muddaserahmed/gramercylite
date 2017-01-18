'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Coupon = mongoose.model('Coupon'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  coupon;

/**
 * Coupon routes tests
 */
describe('Coupon CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new coupon
    user.save(function () {
      coupon = {
        title: 'Coupon Title',
        content: 'Coupon Content'
      };

      done();
    });
  });

  it('should not be able to save an coupon if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/coupons')
          .send(coupon)
          .expect(403)
          .end(function (couponSaveErr, couponSaveRes) {
            // Call the assertion callback
            done(couponSaveErr);
          });

      });
  });

  it('should not be able to save an coupon if not logged in', function (done) {
    agent.post('/api/coupons')
      .send(coupon)
      .expect(403)
      .end(function (couponSaveErr, couponSaveRes) {
        // Call the assertion callback
        done(couponSaveErr);
      });
  });

  it('should not be able to update an coupon if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/coupons')
          .send(coupon)
          .expect(403)
          .end(function (couponSaveErr, couponSaveRes) {
            // Call the assertion callback
            done(couponSaveErr);
          });
      });
  });

  it('should be able to get a list of coupons if not signed in', function (done) {
    // Create new coupon model instance
    var couponObj = new Coupon(coupon);

    // Save the coupon
    couponObj.save(function () {
      // Request coupons
      request(app).get('/api/coupons')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single coupon if not signed in', function (done) {
    // Create new coupon model instance
    var couponObj = new Coupon(coupon);

    // Save the coupon
    couponObj.save(function () {
      request(app).get('/api/coupons/' + couponObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', coupon.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single coupon with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/coupons/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Coupon is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single coupon which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent coupon
    request(app).get('/api/coupons/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No coupon with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an coupon if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/coupons')
          .send(coupon)
          .expect(403)
          .end(function (couponSaveErr, couponSaveRes) {
            // Call the assertion callback
            done(couponSaveErr);
          });
      });
  });

  it('should not be able to delete an coupon if not signed in', function (done) {
    // Set coupon user
    coupon.user = user;

    // Create new coupon model instance
    var couponObj = new Coupon(coupon);

    // Save the coupon
    couponObj.save(function () {
      // Try deleting coupon
      request(app).delete('/api/coupons/' + couponObj._id)
        .expect(403)
        .end(function (couponDeleteErr, couponDeleteRes) {
          // Set message assertion
          (couponDeleteRes.body.message).should.match('User is not authorized');

          // Handle coupon error error
          done(couponDeleteErr);
        });

    });
  });

  it('should be able to get a single coupon that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new coupon
          agent.post('/api/coupons')
            .send(coupon)
            .expect(200)
            .end(function (couponSaveErr, couponSaveRes) {
              // Handle coupon save error
              if (couponSaveErr) {
                return done(couponSaveErr);
              }

              // Set assertions on new coupon
              (couponSaveRes.body.title).should.equal(coupon.title);
              should.exist(couponSaveRes.body.user);
              should.equal(couponSaveRes.body.user._id, orphanId);

              // force the coupon to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the coupon
                    agent.get('/api/coupons/' + couponSaveRes.body._id)
                      .expect(200)
                      .end(function (couponInfoErr, couponInfoRes) {
                        // Handle coupon error
                        if (couponInfoErr) {
                          return done(couponInfoErr);
                        }

                        // Set assertions
                        (couponInfoRes.body._id).should.equal(couponSaveRes.body._id);
                        (couponInfoRes.body.title).should.equal(coupon.title);
                        should.equal(couponInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single coupon if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new coupon model instance
    var couponObj = new Coupon(coupon);

    // Save the coupon
    couponObj.save(function () {
      request(app).get('/api/coupons/' + couponObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', coupon.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single coupon, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'couponowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Coupon
    var _couponOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _couponOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Coupon
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new coupon
          agent.post('/api/coupons')
            .send(coupon)
            .expect(200)
            .end(function (couponSaveErr, couponSaveRes) {
              // Handle coupon save error
              if (couponSaveErr) {
                return done(couponSaveErr);
              }

              // Set assertions on new coupon
              (couponSaveRes.body.title).should.equal(coupon.title);
              should.exist(couponSaveRes.body.user);
              should.equal(couponSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the coupon
                  agent.get('/api/coupons/' + couponSaveRes.body._id)
                    .expect(200)
                    .end(function (couponInfoErr, couponInfoRes) {
                      // Handle coupon error
                      if (couponInfoErr) {
                        return done(couponInfoErr);
                      }

                      // Set assertions
                      (couponInfoRes.body._id).should.equal(couponSaveRes.body._id);
                      (couponInfoRes.body.title).should.equal(coupon.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (couponInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Coupon.remove().exec(done);
    });
  });
});
