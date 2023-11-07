const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config.js');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user.id, iat: timestamp }, config.scret);
}

exports.signin = async (req, res, next) => {
  // User has already had their email and password auth'd
  // we just need to give them a token..
  res.status(200).json({ token: tokenForUser(req.user) });
};

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: 'You most provide email and password.' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    user.save();

    res.status(200).json({ token: tokenForUser(user) });
  } catch (error) {
    return next(error);
  }
};
