const express = require('express');
var router = express.Router();
const passport = require('passport');

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
  })
);

router.get(
  '/facebook/redirect',
  passport.authenticate('facebook', {
    failureRedirect: '/auth/facebook',
    successRedirect: '/auth/success',
  })
);

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/success', function (req, res) {
  res.json(req.user);
});

module.exports = router;
