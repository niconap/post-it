const User = require('../models/user');
const async = require('async');
const jwt = require('jsonwebtoken');

exports.friend_request_user = [
  (req, res, next) => {
    jwt.verify(req.token, process.env.SESSION_SECRET, (err, authData) => {
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
        followedUser: function (callback) {
          User.findById(req.params.id).exec(callback);
        },
      },
      function (err, results) {
        if (err) return next(err);
        if (results.followedUser == null) {
          res.sendStatus(404);
          return;
        }
        if (results.followedUser._id == req.authData._id) {
          res.sendStatus(400);
          return;
        }
        if (
          results.followedUser.requests.includes(req.authData._id) ||
          results.followedUser.friends.includes(req.authData._id)
        ) {
          res.sendStatus(400);
          return;
        }
        User.updateOne(
          { _id: results.followedUser._id },
          {
            $push: {
              requests: req.authData._id,
            },
          },
          function (err) {
            if (err) return next(err);
            res.json({
              message: `Friend request to ${results.followedUser.username} has been succesfully sent`,
            });
          }
        );
      }
    );
  },
];

exports.friend_accept_user = [
  (req, res, next) => {
    jwt.verify(req.token, process.env.SESSION_SECRET, (err, authData) => {
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
        acceptedUser: function (callback) {
          User.findById(req.params.id).exec(callback);
        },
      },
      function (err, results) {
        if (err) return next(err);
        if (results.acceptedUser == null) {
          res.sendStatus(404);
          return;
        }
        if (results.acceptedUser._id == req.authData._id) {
          res.sendStatus(400);
          return;
        }
        if (
          req.authData.friends.includes(results.acceptedUser._id) ||
          !req.authData.requests.includes(results.acceptedUser._id)
        ) {
          res.sendStatus(400);
          return;
        }
        User.updateOne(
          {
            _id: results.acceptedUser._id,
          },
          {
            $push: {
              friends: req.authData._id,
            },
            $pull: {
              requests: req.authData._id,
            },
          },
          function (err) {
            if (err) return next(err);
          }
        );
        User.updateOne(
          { _id: req.authData._id },
          {
            $push: {
              friends: results.acceptedUser._id,
            },
            $pull: {
              requests: results.acceptedUser._id,
            },
          },
          function (err) {
            if (err) return next(err);
            res.json({
              message: `${results.acceptedUser.username} has succesfully been accepted as a friend`,
            });
          }
        );
      }
    );
  },
];
