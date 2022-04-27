const express = require('express');
var router = express.Router();
const passport = require('passport');

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'email'],
  })
);

router.get(
  '/facebook/redirect',
  passport.authenticate('facebook', {
    failureRedirect: '/auth/facebook',
    successRedirect: '/success',
  })
);

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/success', function (req, res) {
  console.log(req.user);
  res.send(`Success!`);
});

module.exports = router;
