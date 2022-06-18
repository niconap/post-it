const express = require('express');
const router = express.Router();
const {
  post_create,
  post_get_general,
  post_get_friends,
  post_delete,
  post_update,
  post_get_single,
  post_like_add,
  post_like_remove,
} = require('../controllers/postController');
const {
  comment_create,
  comment_delete,
} = require('../controllers/commentController');

router.post('/', verifyToken, post_create);

router.get('/general', post_get_general);

router.get('/friends', verifyToken, post_get_friends);

router.get('/:id', post_get_single);

router.delete('/:id', verifyToken, post_delete);

router.put('/:id', verifyToken, post_update);

router.post('/:id/comment/', verifyToken, comment_create);

router.delete('/:postid/comment/:commentid', verifyToken, comment_delete);

router.post('/like/:id', verifyToken, post_like_add);

router.delete('/like/:id', verifyToken, post_like_remove);

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
