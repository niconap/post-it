const express = require('express');
var router = express.Router();
var multer = require('multer');
const {
  delete_user,
  update_user,
  get_user,
  get_users,
  image_upload,
} = require('../controllers/userController');
const {
  get_friend_requests,
  friend_request_user,
  friend_request_revoke,
  friend_accept_user,
  friend_decline_user,
  friend_remove,
} = require('../controllers/friendController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/picture', verifyToken, upload.single('image'), image_upload);

router.get('/get/:id', get_user);

router.get('/requests', verifyToken, get_friend_requests);

router.get('/all', verifyToken, get_users);

router.delete('/:id', verifyToken, delete_user);

router.put('/:id', verifyToken, update_user);

router.put('/friend/request/:id', verifyToken, friend_request_user);

router.put('/friend/request/:id/revoke', verifyToken, friend_request_revoke);

router.put('/friend/accept/:id', verifyToken, friend_accept_user);

router.put('/friend/decline/:id', verifyToken, friend_decline_user);

router.put('/friend/remove/:id', verifyToken, friend_remove);

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
