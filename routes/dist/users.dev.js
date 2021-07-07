"use strict";

var express = require('express');

var router = express.Router();

var passport = require('passport');

var catchAsync = require('../utils/catchAsync');

var User = require('../models/user');

router.get('/register', function (req, res) {
  res.render('register');
});
router.post('/register', catchAsync(function _callee(req, res, next) {
  var _req$body, email, username, password, user, registeredUser;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, email = _req$body.email, username = _req$body.username, password = _req$body.password;
          user = new User({
            email: email,
            username: username
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(User.register(user, password));

        case 5:
          registeredUser = _context.sent;
          req.login(registeredUser, function (err) {
            if (err) return next(err);
            req.flash('success', 'welcome');
            res.redirect('/user');
          });
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          req.flash('error', _context.t0.message);
          res.redirect('/register');

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
}));
router.get('/login', function (req, res) {
  res.render('login');
});
router.get('/terms', function (req, res) {
  res.render('terms');
});
router.get('/privacy', function (req, res) {
  res.render('privacy');
});
router.post('/login', passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/login'
}), function (req, res) {
  req.flash('success', 'welcome back');
  res.redirect('/user');
});
router.get('/logout', function (req, res) {
  req.logout();
  req.flash('succes', 'Goodby');
  res.redirect('/');
});
module.exports = router;
//# sourceMappingURL=users.dev.js.map
