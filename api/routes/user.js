const express = require('express');
var router = express.Router();
const {
  get_current_user,
  delete_user,
  update_user,
  get_users,
} = require('../controllers/userController');
const {
  friend_request_user,
  friend_accept_user,
  friend_remove,
} = require('../controllers/friendController');

router.get('/:id', verifyToken, get_current_user);

router.get('/', get_users);

router.delete('/:id', verifyToken, delete_user);

router.put('/:id', verifyToken, update_user);

router.put('/friend/request/:id', verifyToken, friend_request_user);

router.put('/friend/accept/:id', verifyToken, friend_accept_user);

router.delete('/friend/remove/:id', verifyToken, friend_remove);

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
