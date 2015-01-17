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
  return next();
});

/**
 * Local Authentication
 **/

loginRouter.route('/signup')
  .get(function(req, res, next) {
    return res.render('signup', {message: req.flash('error')[0]});
  })
  .post(passport.authenticate('localSignup', {
      failureRedirect : '/signup',
      failureFlash: true
    }), function(req, res){
      if(req.user.isAdmin){
        return res.redirect('/admin');
      } else {
        return res.redirect('/account');
      } 
  });

loginRouter.route('/login')
  .get(function(req, res, next) {
    return res.render('login', {message: req.flash('error')[0]});
  })
  .post(passport.authenticate('localLogin', {
      failureRedirect : '/login',
      failureFlash: true
    }), function(req, res){
      updateCartAndRedirect(req, res); 
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
      failureRedirect : '/',
      failureFlash: true
    }), function(req, res){
      updateCartAndRedirect(req, res); 
  });

/**
 * Facebook Authentication
 **/

loginRouter.route('/auth/facebook')
  .get(passport.authenticate('facebook', { scope : 'email' }));

loginRouter.route('/auth/facebook/callback')
  .get(passport.authenticate('facebook', {
      failureRedirect : '/'
    }), function(req, res){
      updateCartAndRedirect(req, res); 
  });

/**
 * Twitter Authentication
 **/

loginRouter.route('/auth/twitter')
  .get(passport.authenticate('twitter', { scope : 'email' }));

loginRouter.route('/auth/facebook/callback')
  .get(passport.authenticate('twitter', {
      failureRedirect : '/'
    }), function(req, res){
      updateCartAndRedirect(req, res); 
  });

/**
 * Connect Accounts
 **/

loginRouter.route('/connect/google')
  .get(passport.authorize('google', { scope : ['profile', 'email'] }));

loginRouter.route('/connect/google/callback')
  .get(passport.authorize('google', {
      successRedirect : '/account/settings',
      failureRedirect : '/'
    }));

loginRouter.route('/connect/facebook')
  .get(passport.authorize('facebook', { scope : 'email' }));

loginRouter.route('/connect/facebook/callback')
  .get(passport.authorize('facebook', {
      successRedirect : '/account/settings',
      failureRedirect : '/'
    }));

loginRouter.route('/connect/twitter')
  .get(passport.authorize('twitter', { scope : 'email' }));

loginRouter.route('/connect/twitter/callback')
  .get(passport.authorize('twitter', {
      successRedirect : '/account/settings',
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
      return res.redirect('/account/settings');
    });
  });

loginRouter.route('/unlink/facebook')
  .get(function(req, res) {
    var user = req.user;
    user.facebook.token = undefined;

    user.save(function(err) {
      return res.redirect('/account/settings');
    });
  });

loginRouter.route('/unlink/twitter')
  .get(function(req, res) {
    var user = req.user;
    user.twitter.token = undefined;

    user.save(function(err) {
      res.redirect('/account/settings');
    });
  });


/**
 * Private Methods
 **/

function updateCartAndRedirect(req, res){
  if(req.session.cart && req.session.cart.number){
    Order.update({number: req.session.cart.number}, {user: req.user._id}, function(err, order){
      if(err){
        console.log(err);
      }
    });
  }
  if(req.user.isAdmin){
    return res.redirect('/admin');
  } else {
    return res.redirect('/account');
  } 
}

module.exports = loginRouter;
