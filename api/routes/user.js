const express = require('express');
var router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { get_user } = require('../controllers/userController');

router.get('/:id', verifyToken, get_user);

function verifyToken(req, res, next) {
  console.log('verify');
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader != 'undefined') {
    const bearer = bearerHeader.split(' ')[1];
    req.token = bearer;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
