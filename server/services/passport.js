// Passport configrations (setup and logic)
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const bcryptjs = require('bcryptjs');

const User = require('../models/user.js');
const config = require('../config.js');

// Create local strategy
const localLogin = new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    // Verify this username and password? call done with a user
    // if it is a correct username and password
    // otherwise call done without a user object.
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return done(null, false);
        }

        // Compare the passwords
        const validPassword = bcryptjs.compareSync(password, user.password);

        if (!validPassword) {
          return done(null, false);
        }

        return done(null, user);
      })
      .catch((error) => done(error, false));
  }
);

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
passport.use(localLogin);

// The paylod is decoded jwt token,
// done is a callback function that we need to call
// depending on whether or not we are able to successfully
// authenticate this user.
