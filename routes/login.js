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

  if(req.url === '/dashboard'){
    // TODO: Implement Logged in Policy
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
      successRedirect : '/dashboard',
      failureRedirect : '/signup',
      failureFlash: true
    }));

loginRouter.route('/login')
  .get(function(req, res, next) {
    return res.render('login', {message: req.flash('error')[0]});
  })
  .post(passport.authenticate('localLogin', {
      successRedirect : '/dashboard',
      failureRedirect : '/login',
      failureFlash: true
    }));

loginRouter.route('/dashboard')
  .get(function(req, res, next) {
    var user = req.user;
    return res.render('dashboard', user);
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
      successRedirect : '/dashboard',
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
      successRedirect : '/dashboard',
      failureRedirect : '/'
    }));

/**
 * Twitter Authentication
 **/

loginRouter.route('/auth/twitter')
  .get(passport.authenticate('twitter', { scope : 'email' }));

loginRouter.route('/auth/facebook/callback')
  .get(passport.authenticate('twitter', {
      successRedirect : '/dashboard',
      failureRedirect : '/'
    }));

/**
 * Connect Accounts
 **/

loginRouter.route('/connect/google')
  .get(passport.authorize('google', { scope : ['profile', 'email'] }));

loginRouter.route('/connect/google/callback')
  .get(passport.authorize('google', {
      successRedirect : '/account',
      failureRedirect : '/'
    }));

loginRouter.route('/connect/facebook')
  .get(passport.authorize('facebook', { scope : 'email' }));

loginRouter.route('/connect/facebook/callback')
  .get(passport.authorize('facebook', {
      successRedirect : '/account',
      failureRedirect : '/'
    }));

loginRouter.route('/connect/twitter')
  .get(passport.authorize('twitter', { scope : 'email' }));

loginRouter.route('/connect/twitter/callback')
  .get(passport.authorize('twitter', {
      successRedirect : '/account',
      failureRedirect : '/'
    }));

/**
 * Unlink Accounts
 **/

loginRouter.route('/unlink/google')
  .get(function(req, res) {
    var user = req.user;
    user.google.token = undefined;

    user.save(function(err) {
      return res.redirect('/account');
    });
  });

loginRouter.route('/unlink/facebook')
  .get(function(req, res) {
    var user = req.user;
    user.facebook.token = undefined;

    user.save(function(err) {
      return res.redirect('/account');
    });
  });

loginRouter.route('/unlink/twitter')
  .get(function(req, res) {
    var user = req.user;
    user.twitter.token = undefined;

    user.save(function(err) {
      res.redirect('/account');
    });
  });

module.exports = loginRouter;
