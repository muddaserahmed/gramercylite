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
describe('Coupon Admin CRUD tests', function () {
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
      roles: ['user', 'admin'],
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

  it('should be able to save an coupon if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new coupon
        agent.post('/api/coupons')
          .send(coupon)
          .expect(200)
          .end(function (couponSaveErr, couponSaveRes) {
            // Handle coupon save error
            if (couponSaveErr) {
              return done(couponSaveErr);
            }

            // Get a list of coupons
            agent.get('/api/coupons')
              .end(function (couponsGetErr, couponsGetRes) {
                // Handle coupon save error
                if (couponsGetErr) {
                  return done(couponsGetErr);
                }

                // Get coupons list
                var coupons = couponsGetRes.body;

                // Set assertions
                (coupons[0].user._id).should.equal(userId);
                (coupons[0].title).should.match('Coupon Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an coupon if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new coupon
        agent.post('/api/coupons')
          .send(coupon)
          .expect(200)
          .end(function (couponSaveErr, couponSaveRes) {
            // Handle coupon save error
            if (couponSaveErr) {
              return done(couponSaveErr);
            }

            // Update coupon title
            coupon.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing coupon
            agent.put('/api/coupons/' + couponSaveRes.body._id)
              .send(coupon)
              .expect(200)
              .end(function (couponUpdateErr, couponUpdateRes) {
                // Handle coupon update error
                if (couponUpdateErr) {
                  return done(couponUpdateErr);
                }

                // Set assertions
                (couponUpdateRes.body._id).should.equal(couponSaveRes.body._id);
                (couponUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an coupon if no title is provided', function (done) {
    // Invalidate title field
    coupon.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new coupon
        agent.post('/api/coupons')
          .send(coupon)
          .expect(422)
          .end(function (couponSaveErr, couponSaveRes) {
            // Set message assertion
            (couponSaveRes.body.message).should.match('Title cannot be blank');

            // Handle coupon save error
            done(couponSaveErr);
          });
      });
  });

  it('should be able to delete an coupon if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new coupon
        agent.post('/api/coupons')
          .send(coupon)
          .expect(200)
          .end(function (couponSaveErr, couponSaveRes) {
            // Handle coupon save error
            if (couponSaveErr) {
              return done(couponSaveErr);
            }

            // Delete an existing coupon
            agent.delete('/api/coupons/' + couponSaveRes.body._id)
              .send(coupon)
              .expect(200)
              .end(function (couponDeleteErr, couponDeleteRes) {
                // Handle coupon error error
                if (couponDeleteErr) {
                  return done(couponDeleteErr);
                }

                // Set assertions
                (couponDeleteRes.body._id).should.equal(couponSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single coupon if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new coupon model instance
    coupon.user = user;
    var couponObj = new Coupon(coupon);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new coupon
        agent.post('/api/coupons')
          .send(coupon)
          .expect(200)
          .end(function (couponSaveErr, couponSaveRes) {
            // Handle coupon save error
            if (couponSaveErr) {
              return done(couponSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (couponInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
