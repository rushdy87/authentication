const Authentication = require('./controllers/authentication.js');

module.exports = (app) => {
  app.post('/signup', Authentication.signup);
};
