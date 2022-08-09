const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');
const async = require('async');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup_user = [
  body('username', 'Username must be longer than 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('username', 'Username is already taken').custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      User.findOne({ username: req.body.username }, function (err, user) {
        if (err) return next(err);
        if (user && user.username == value) {
          reject(new Error('Username is already taken'));
        }
        resolve(true);
      });
    });
  }),
  body('firstName', 'First name cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('lastName', 'Last name cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('email', 'E-mail cannot be empty').trim().isLength({ min: 1 }),
  body('email', 'Enter a valid e-mail').isEmail(),
  body('password', 'Password must be 8 characters or longer').isLength({
    min: 8,
  }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        message:
          'Something went wrong while trying to validate the entered data',
        errors: errors.array(),
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        var user = new User({
          username: req.body.username,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hashedPassword,
          friends: [],
          requests: [],
          posts: [],
        }).save((err, newUser) => {
          if (err) return next(err);
          res.json({
            message: 'Signup completed succesfully',
            username: newUser.username,
            id: newUser._id,
          });
        });
      });
    }
  },
];

exports.get_user = function (req, res, next) {
  async.parallel(
    {
      user: function (callback) {
        User.findById(req.params.id)
          .populate('friends')
          .populate('posts')
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.user == null) {
        res.sendStatus(404);
        return;
      }
      results.user.password = null;
      results.user.email = null;
      results.user.friends.map((friend) => {
        friend.password = null;
        friend.email = null;
      });
      res.json(results.user);
    }
  );
};

exports.delete_user = function (req, res, next) {
  jwt.verify(req.token, process.env.SESSION_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    async.parallel(
      {
        user: function (callback) {
          User.findById(req.params.id).exec(callback);
        },
        posts: function (callback) {
          Post.find({ user: req.params.id }).exec(callback);
        },
        comments: function (callback) {
          Comment.find({ user: req.params.id }).exec(callback);
        },
      },
      function (err, results) {
        if (err) return next(err);
        if (results.user == null) {
          res.sendStatus(404);
          return;
        }
        if (authData.username != results.user.username) {
          res.sendStatus(403);
          return;
        }
        if (results.posts.length > 0) {
          Post.deleteMany({ user: results.user._id }, function (err) {
            if (err) return next(err);
          });
        }
        if (results.comments.length > 0) {
          Comment.deleteMany({ user: results.user._id }, function (err) {
            if (err) return next(err);
          });
        }
        User.findByIdAndDelete(results.user._id, function (err, theUser) {
          if (err) return next(err);
          res.json({
            message: 'User and associated posts and comments have been removed',
            user: theUser,
          });
        });
      }
    );
  });
};

exports.update_user = [
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

  body('username', 'Username must be longer than 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('username', 'Username is already taken').custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      User.findOne({ username: req.body.username }, function (err, user) {
        if (err) return next(err);
        if (
          user &&
          user.username == value &&
          user.username != req.authData.username
        ) {
          reject(new Error('Username is already taken'));
        }
        resolve(true);
      });
    });
  }),
  body('firstName', 'First name cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('lastName', 'Last name cannot be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('email', 'E-mail cannot be empty').trim().isLength({ min: 1 }),
  body('email', 'Enter a valid e-mail').isEmail(),
  body('password', 'Password must be 8 characters or longer').isLength({
    min: 8,
  }),

  (req, res, next) => {
    async.parallel(
      {
        user: function (callback) {
          User.findById(req.params.id).exec(callback);
        },
      },
      function (err, results) {
        if (err) return next(err);
        if (results.user == null) {
          res.sendStatus(404);
          return;
        }
        if (results.user.username != req.authData.username) {
          res.sendStatus(403);
          return;
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.json({ errors: errors.array() });
          return;
        } else {
          bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) return next(err);
            var user = new User({
              _id: results.user._id,
              username: req.body.username,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              password: hashedPassword,
              friends: results.user.friends,
              requests: results.user.requests,
              posts: results.user.posts,
            });
            User.findByIdAndUpdate(
              results.user._id,
              user,
              { new: true },
              function (err, theUser) {
                if (err) return next(err);
                res.json({
                  message: 'User has been updated',
                  user: theUser,
                  new_token: jwt.sign(
                    theUser.toJSON(),
                    process.env.SESSION_SECRET
                  ),
                });
              }
            );
          });
        }
      }
    );
  },
];
