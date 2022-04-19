const passport = require('passport');
const express = require('express');
var router = express.Router();

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/redirect',
  passport.authenticate('facebook', {
    failureRedirect: '/auth/facebook',
    failureMessage: true,
  }),
  function (req, res) {
    res.redirect('/');
  }
);

module.exports = router;
