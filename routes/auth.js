const express = require('express');
const passport = require('passport');
const { registerUser, loginUser, oauthCallback } = require('../controllers/authController');

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', (req, res, next) => {
  req.authType = 'Google';
  passport.authenticate('google', { failureRedirect: '/login' }, (err, user) => {
    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      oauthCallback(req, res);
    });
  })(req, res, next);
});

// Facebook OAuth routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', (req, res, next) => {
  req.authType = 'Facebook';
  passport.authenticate('facebook', { failureRedirect: '/login' }, (err, user) => {
    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      oauthCallback(req, res);
    });
  })(req, res, next);
});

module.exports = router;
