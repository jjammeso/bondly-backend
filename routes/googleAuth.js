const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

require('../passport/google');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign(req.user, 'your_jwt_secret');
    res.redirect(`https://bondly-chi.vercel.app/login/success?token=${token}`);
  }
);

module.exports = router;
