const User = require('../models/user');
const Post = require('../models/post');
const async = require('async');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

exports.post_create = [
  (req, res, next) => {
    jwt.verify(req.token, process.env.SESSION_SECRET, function (err, authData) {
      if (err) {
        res.sendStatus(403);
        return;
      } else {
        req.authData = authData;
        next();
      }
    });
  },

  body('title', 'Your title must be less than 100 characters long.')
    .trim()
    .isLength({ max: 100 }),
  body('title', 'Your title must be at least 2 characters long.')
    .trim()
    .isLength({ min: 2 }),
  body('content', 'Your content must be less than 300 characters.')
    .trim()
    .isLength({ max: 300 }),
  body('content', 'Your content must be at least 2 characters long.')
    .trim()
    .isLength({ min: 2 }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({
        message: 'Something went wrong while trying to create a new post',
        errors: errors.array(),
      });
      return;
    } else {
      async.parallel(
        {
          user: function (callback) {
            User.find({ username: req.authData.username }).exec(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);
          if (results.user == null) {
            res.sendStatus(404);
            return;
          }
          let post = new Post({
            title: req.body.title,
            content: req.body.content,
            likes: [],
            comments: [],
            timeStamp: new Date(),
            user: results.user[0]._id,
          }).save((err, newPost) => {
            if (err) return next(err);
            res.json({
              message: 'A new post has succesfully been created',
              post: newPost,
            });
          });
        }
      );
    }
  },
];
