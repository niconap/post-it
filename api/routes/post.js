const express = require('express');
const router = express.Router();
const {
  post_create,
  post_get_general,
  post_get_friends,
  post_delete,
  post_update,
} = require('../controllers/postController');
const { comment_create } = require('../controllers/commentController');

router.post('/create', verifyToken, post_create);

router.get('/get/general', post_get_general);

router.get('/get/friends', verifyToken, post_get_friends);

router.delete('/:id', verifyToken, post_delete);

router.put('/:id', verifyToken, post_update);

router.post('/:id/comment', verifyToken, comment_create);

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
