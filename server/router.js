const passport = require('passport');

const Authentication = require('./controllers/authentication.js');
const passportService = require('./services/passport.js');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
  app.get('/', requireAuth, (req, res) => res.send({ hi: 'There' }));
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
};
