const User = require('../models/user');
const Post = require('../models/post');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.post_create = [
  body('title', 'Your title must be less than 100 characters long.')
    .trim()
    .isLength({ max: 100 }),
  body('content', 'Your content must be less than 300 characters.')
    .trim()
    .isLength({ max: 300 }),

  (req, res, next) => {
    const errors = validationResult(req);

    let;
  },
];
