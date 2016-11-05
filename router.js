/**
 *            router
 *
 * Created by marcusjwhelan on 11/5/16.
 *
 * Contact: marcus.j.whelan@gmail.com
 *
 */
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// object we insert in the middle between incoming request and route handler
//                                using jwt strat, when authed dont try to make a session for them E.G. a cookie. so set false.
const requireAuth = passport.authenticate('jwt', { session: false });

const requireSignin = passport.authenticate('local', {session: false});

module.exports = function (app) {
  // First go through auth. If they get through then run function to handle request.
  app.get('/', requireAuth, function (req, res) {
    res.send({ hi: 'there'})
  });
  app.post('/signin', requireSignin,Authentication.signin);
  app.post('/signup', Authentication.signup);
};