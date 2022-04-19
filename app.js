var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();
const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var User = require('./models/user');

var app = express();

dev_db_url = process.env.CONNECTION_STRING;
var mongoDB = dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:3000/auth/facebook/redirect',
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      if (User.exists({ facebookId: profile.id })) {
        User.findOne({ facebookId: profile.id }, function (err, user) {
          if (err) return cb(err);
          return cb(null, user);
        });
      } else {
        User.create(
          { displayName: profile.displayName, facebookId: profile.id },
          function (err, user) {
            if (err) return cb(err);
            return cb(null, user);
          }
        );
      }
    }
  )
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
