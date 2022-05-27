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
        }
        // Chech if user is already following
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
              message: 'Friend request has been succesfully sent',
            });
          }
        );
      }
    );
  },
];
