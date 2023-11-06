// Passport configrations (setup and logic)
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user.js');
const config = require('../config.js');

// Setup options for jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.scret,
};

// Create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if user ID in the payload exists in ourdatabase
  // If it does, call 'done' with that user
  // otherwise, call 'done' without a user object.

  User.findById(payload.sub)
    .then((user) => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
    .catch((error) => done(error, false));
});

// Tell passport to use this strategy
passport.use(jwtLogin);

// The paylod is decoded jwt token,
// done is a callback function that we need to call
// depending on whether or not we are able to successfully
// authenticate this user.
