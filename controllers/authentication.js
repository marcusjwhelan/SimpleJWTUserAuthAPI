/**
 *            authentication
 *
 * Created by marcusjwhelan on 11/5/16.
 *
 * Contact: marcus.j.whelan@gmail.com
 *
 */
const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

// create the JWT
function tokenForUser (user) {
  const timestamp = new Date().getTime();
  // what we want to encode, what our secret is
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
  /*
  * jwt have a subject. > sub . and the subject is this very
  * specific user
  *
  * iat > issued at time. When was this user created.
  * */
}

// new helper to returna token for a user signing in
exports.signin = function (req, res, next) {
  // user has already had their email and pass auth'd
  // they just need a toke.
  // passport in the done cb in passport.js in local strat returns the user as req.user object
  res.send({token: tokenForUser(req.user)});
};

// where to process a request.
exports.signup = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  // Have to send a password and an email to save new user.
  if( !email || !password ) {
    return res.status(422).send({ error: 'You must provide an email and a password.'});
  }

  // see if a user with the given email exists ---------------------
  // User = all the users in the database
  User.findOne({ email: email }, function (err, existingUser) {
    if (err) { return next(err); } // connection to db failed

    // if user with a email does exist, return error: duplicate----
    if (existingUser) { // 422 un-processable entity
      return res.status(422).send({ error: 'Email is in use'});
    }

    // if user with email does not exist, create and save user  record -------------------------------------------
    const user = new User({
      email: email,
      password: password
    }); // creates user but does not save

    user.save( function (err) {
      if (err) { return next(err); } // failed to save

      // Respond to request indication the user was created -------
      res.json({ token: tokenForUser(user) });

    }); // save record to the db .. takes time
  });
};