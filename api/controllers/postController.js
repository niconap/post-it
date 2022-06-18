const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
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
            User.updateOne(
              { _id: results.user[0]._id },
              {
                $push: {
                  posts: newPost._id,
                },
              },
              function (err) {
                if (err) return next(err);
              }
            );
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

exports.post_get_general = function (req, res, next) {
  async.parallel(
    {
      posts: function (callback) {
        Post.find()
          .populate({ path: 'user', select: 'username firstName lastName' })
          .populate('comments')
          .exec(callback);
      },
    },
    function (err, results) {
      console.log(err);
      if (err) return next(err);
      if (results.posts == null) {
        res.sendStatus(404);
        return;
      }
      res.send({
        posts: results.posts,
      });
      return;
    }
  );
};

exports.post_get_friends = [
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

  (req, res, next) => {
    async.parallel(
      {
        posts: function (callback) {
          Post.find({ user: { $in: req.authData.friends } })
            .populate({ path: 'user', select: 'username firstName lastName' })
            .populate('comments')
            .exec(callback);
        },
      },
      function (err, results) {
        if (err) return next(err);
        if (results.posts == null) {
          res.sendStatus(404);
          return;
        }
        res.send({
          posts: results.posts,
        });
        return;
      }
    );
  },
];

exports.post_delete = function (req, res, next) {
  jwt.verify(req.token, process.env.SESSION_SECRET, function (err, authData) {
    if (err) {
      res.sendStatus(403);
      return;
    } else {
      async.parallel(
        {
          post: function (callback) {
            Post.findById(req.params.id).exec(callback);
          },
          comments: function (callback) {
            Comment.find({ post: req.params.id }).exec(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);
          if (results.post == null) {
            res.sendStatus(404);
            return;
          }
          if (results.post.user != authData._id) {
            res.sendStatus(403);
            return;
          }
          if (results.comments.length > 0) {
            Comment.deleteMany({ post: req.params.id }, function (err) {
              if (err) return next(err);
            });
          }
          Post.findByIdAndDelete(req.params.id, function (err, thePost) {
            if (err) return next(err);
            User.updateOne(
              { _id: results.post.user },
              {
                $pull: {
                  posts: results.post._id,
                },
              },
              function (err) {
                if (err) return next(err);
              }
            );
            res.json({
              message: 'Post and associated comments have been removed.',
              post: thePost,
            });
          });
        }
      );
    }
  });
};

exports.post_update = [
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
    async.parallel(
      {
        post: function (callback) {
          Post.findById(req.params.id).exec(callback);
        },
      },
      function (err, results) {
        if (err) return next(err);
        if (results.post == null) {
          res.sendStatus(404);
          return;
        }
        if (results.post.user != req.authData._id) {
          res.sendStatus(403);
          return;
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.json({ errors: errors.array() });
          return;
        } else {
          if (err) return next(err);
          let post = new Post({
            title: req.body.title,
            content: req.body.content,
            likes: results.post.likes,
            comments: results.post.comments,
            timeStamp: new Date(),
            user: req.authData._id,
            _id: results.post._id,
          });

          Post.findByIdAndUpdate(
            results.post._id,
            post,
            { new: true },
            function (err, thePost) {
              if (err) return next(err);
              res.json({
                message: 'Post has been updated',
                post: thePost,
              });
            }
          );
        }
      }
    );
  },
];

exports.post_get_single = function (req, res, next) {
  async.parallel(
    {
      post: function (callback) {
        Post.findOne({ _id: req.params.id })
          .populate({ path: 'user', select: 'username firstName lastName' })
          .populate('comments')
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.post == null) {
        res.sendStatus(404);
        return;
      }
      res.json(results.post);
    }
  );
};

exports.post_like_add = function (req, res, next) {
  jwt.verify(req.token, process.env.SESSION_SECRET, function (err, authData) {
    if (err) {
      res.sendStatus(403);
      return;
    } else {
      async.parallel(
        {
          post: function (callback) {
            Post.findOne({ _id: req.params.id }).exec(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);
          if (results.post == null) {
            res.sendStatus(404);
            return;
          }
          if (results.post.likes.includes(authData._id)) {
            res.sendStatus(400);
            return;
          }
          Post.findByIdAndUpdate(
            req.params.id,
            {
              $push: {
                likes: authData._id,
              },
            },
            function (err) {
              if (err) return next(err);
              res.json({
                message: `A like has succesfully been added to a post called ${results.post.title}`,
              });
            }
          );
        }
      );
    }
  });
};

exports.post_like_remove = function (req, res, next) {
  jwt.verify(req.token, process.env.SESSION_SECRET, function (err, authData) {
    if (err) {
      res.sendStatus(403);
      return;
    } else {
      async.parallel(
        {
          post: function (callback) {
            Post.findOne({ _id: req.params.id }).exec(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);
          if (results.post == null) {
            res.sendStatus(404);
            return;
          }
          if (!results.post.likes.includes(authData._id)) {
            res.sendStatus(400);
            return;
          }
          Post.findByIdAndUpdate(
            req.params.id,
            {
              $pull: {
                likes: authData._id,
              },
            },
            function (err) {
              if (err) return next(err);
              res.json({
                message: `A like has succesfully been removed from a post called ${results.post.title}`,
              });
            }
          );
        }
      );
    }
  });
};
