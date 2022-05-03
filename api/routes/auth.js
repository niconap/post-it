const express = require('express');
var router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/login', function (req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something went wrong',
        user,
        info,
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) res.json({ error: err });

      const token = jwt.sign(user.toJSON(), process.env.SESSION_SECRET);
      return res.json({ user, token });
    });
  })(req, res);
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/success', function (req, res) {
  res.redirect(`/?auth=${req.user.token}`); // Later: add frontend site here
});

module.exports = router;
