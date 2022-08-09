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
        requestedUser: function (callback) {
          User.findById(req.params.id).exec(callback);
        },
      },
      function (err, results) {
        if (err) return next(err);
        if (results.requestedUser == null) {
          res.sendStatus(404);
          return;
        }
        if (results.requestedUser._id == req.authData._id) {
          res.sendStatus(400);
          return;
        }
        if (
          results.requestedUser.requests.includes(req.authData._id) ||
          results.requestedUser.friends.includes(req.authData._id)
        ) {
          res.sendStatus(400);
          return;
        }
        User.updateOne(
          { _id: results.requestedUser._id },
          {
            $push: {
              requests: req.authData._id,
            },
          },
          function (err) {
            if (err) return next(err);
            res.json({
              message: `Friend request to ${results.requestedUser.username} has been succesfully sent`,
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
          !req.authData.requests.includes(results.acceptedUser._id.toString())
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

exports.friend_remove = [
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
        removedUser: function (callback) {
          User.findById(req.params.id).exec(callback);
        },
      },
      function (err, results) {
        if (err) return next(err);
        if (results.removedUser == null) {
          res.sendStatus(404);
          return;
        }
        if (
          results.removedUser._id == req.authData._id ||
          !req.authData.friends.includes(results.removedUser._id)
        ) {
          res.sendStatus(400);
          return;
        }
        User.updateOne(
          { _id: req.authData._id },
          {
            $pull: {
              friends: results.removedUser._id,
            },
          },
          function (err) {
            if (err) return next(err);
            res.json({
              message: `${results.removedUser.username} has succesfully been removed from your friend list`,
            });
          }
        );
      }
    );
  },
];

exports.friend_request_revoke = [
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
        requestedUser: function (callback) {
          User.findById(req.params.id).exec(callback);
        },
      },
      function (err, results) {
        if (err) return next(err);
        if (results.requestedUser == null) {
          res.sendStatus(404);
          return;
        }
        if (results.requestedUser._id == req.authData._id) {
          res.sendStatus(400);
          return;
        }
        if (
          !results.requestedUser.requests.includes(req.authData._id) ||
          results.requestedUser.friends.includes(req.authData._id)
        ) {
          res.sendStatus(400);
          return;
        }
        User.updateOne(
          { _id: results.requestedUser._id },
          {
            $pull: {
              requests: req.authData._id,
            },
          },
          function (err) {
            if (err) return next(err);
            res.json({
              message: `Friend request to ${results.requestedUser.username} has been succesfully revoked`,
            });
          }
        );
      }
    );
  },
];
