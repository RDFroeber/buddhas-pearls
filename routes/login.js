/**
 * Login Router
 **/

var express = require('express'),
    loginRouter = express.Router(),
    User = require('../models/User'),
    passport = require('passport');

/**
 * Login Router Middleware 
 **/

loginRouter.use(function(req, res, next) {
  res.app.locals.user = req.user;
  // console.log("Trying to: " + req.method, req.url);

  if(req.url === '/profile'){
    if(req.user){
      return next();
    } else {
      return res.redirect('/login');
    }
  } else {
    return next(); 
  }
});

/**
 * Local Authentication
 **/

loginRouter.route('/signup')
  .get(function(req, res, next) {
    return res.render('signup', {message: req.flash('error')[0]});
  })
  .post(passport.authenticate('localSignup', {
      successRedirect : '/profile',
      failureRedirect : '/signup',
      failureFlash: true
    }));

loginRouter.route('/login')
  .get(function(req, res, next) {
    return res.render('login', {message: req.flash('error')[0]});
  })
  .post(passport.authenticate('localLogin', {
      successRedirect : '/profile',
      failureRedirect : '/login',
      failureFlash: true
    }));

loginRouter.route('/profile')
  .get(function(req, res, next) {
    var user = req.user;
    return res.render('profile', user);
  });

loginRouter.route('/logout')
  .get(function(req, res, next) {
    req.logout();
    return res.redirect('/');
  });

/**
 * Google Authentication
 **/

loginRouter.route('/auth/google')
  .get(passport.authenticate('google', {scope : ['profile', 'email']}));

loginRouter.route('/auth/google/callback')
  .get(passport.authenticate('google', {
      successRedirect : '/profile',
      failureRedirect : '/',
      failureFlash: true
    }));

/**
 * Facebook Authentication
 **/

loginRouter.route('/auth/facebook')
  .get(passport.authenticate('facebook', { scope : 'email' }));

loginRouter.route('/auth/facebook/callback')
  .get(passport.authenticate('facebook', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

/**
 * Twitter Authentication
 **/

// loginRouter.route('/auth/twitter')
//   .get(function(req, res, next) {
//     passport.authenticate('twitter', { scope : 'email' });
//   })
//   .get(function(req, res, next) {
//     passport.authenticate('twitter', {
//       successRedirect : '/profile',
//       failureRedirect : '/'
//     });
//   });
 
module.exports = loginRouter;
