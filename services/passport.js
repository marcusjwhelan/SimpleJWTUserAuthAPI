/**
 *            passport
 *
 * Created by marcusjwhelan on 11/5/16.
 *
 * Contact: marcus.j.whelan@gmail.com
 *
 */
const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// strategy where we use an email and password not jwt
const LocalStrategy = require('passport-local');

// create Local Strat ----------------------------------------------
const localOptions = { usernameField: 'email'};
const LocalLogin = new LocalStrategy( localOptions, function (email, password, done) {
  // Verify this email and password, cal done with the user
  User.findOne({ email: email }, function (err, user) {
    if(err) return done(err);

    // if user not found. thinks they have an account
    if(!user) { return done(null, false);}

    // compare passwords - is this.password = user.password?
    user.comparePassword(password, function (err, isMatch) {
      if(err) return done(err);
      if(!isMatch) return done(null, false);

      // if the user was found return the user :D
      return done(null, user);
    })
  });

  // if it is the correct email and password
  // otherwise, call done with false
});


// setup options for jwt strategy ----------------------------------
const jwtOptions = {
  // have to tell it where to look on the request for this token
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  // second arg need to provide the secret
  secretOrKey: config.secret
};


// Create JWT Strategy ---------------------------------------------
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // See if the user Id in the payload exists in our database ==
  User.findById(payload.sub, function (err, user) {
    // if there is a user the second arg is the user. if not then false
    if(err) { return done( err, false); }

    // if it does, call 'done' with that user ====================
    if (user) {
      // no error and found the user
      done(null, user);
    }
    // otherwise, call done without a user object ================
    else {
      // no error but did not find that user
      done(null, false);
    }

  });
});

// Tell passport to use this strategy ------------------------------
passport.use(jwtLogin);
passport.use(LocalLogin);