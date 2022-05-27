const express = require('express');
var router = express.Router();
const {
  get_user,
  delete_user,
  update_user,
} = require('../controllers/userController');
const { friend_request_user } = require('../controllers/friendController');

router.get('/:id', verifyToken, get_user);

router.delete('/:id', verifyToken, delete_user);

router.put('/:id', verifyToken, update_user);

router.post('/follow/:id', verifyToken, friend_request_user);

function verifyToken(req, res, next) {
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
