const express = require('express');
var router = express.Router();
const passport = require('passport');
var User = require('../models/user');

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
  })
);

router.post(
  '/facebook/token',
  passport.authenticate('facebook-token'),
  function (req, res) {
    User.findById(req.user._id, function (err, user) {
      console.log(err);
      if (err) res.send(err);
      res.send(user);
    });
  }
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
  res.redirect(`/?auth=${req.user.token}`); // Later: add frontend site here
});

module.exports = router;
