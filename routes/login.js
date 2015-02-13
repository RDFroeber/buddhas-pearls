'use strict';

/**
 * Login Router
 **/

var express = require('express'),
    loginRouter = express.Router(),
    User = require('../models').User,
    Order = require('../models').Order,
    passport = require('passport'),
    async = require('async'),
    _ = require('underscore');

/**
 * Local Authentication
 **/

loginRouter.route('/signup')
  .get(function(req, res) {
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
  .get(function(req, res) {
    return res.render('login', {message: req.flash('error')[0]});
  })
  .post(passport.authenticate('localLogin', {
      failureRedirect : '/login',
      failureFlash: true
    }), function(req, res){
      updateCartAndRedirect(req, res); 
  });

loginRouter.route('/logout')
  .get(function(req, res) {
    req.logout();
    // TODO: Not erasing cart!
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
    var cart = req.session.cart.number;
  }
  if(req.user && req.user.cart){
    var userCartNum = req.user.cart;
  }

  if(cart && userCartNum){
    async.waterfall([
      function(next){
        Order.findOne({number: cart}).populate(['itemList', 'itemList.item']).exec(function(err, sessionCart) {
          if(err){
            console.log(err);
          }
          next(null, sessionCart);
        });
      },
      function(sessionCart, next){
        Order.findById(req.user.cart).populate(['itemList', 'itemList.item']).exec(function(err, userCart) {
          if(err){
            console.log(err);
          }
          next(null, sessionCart, userCart)
        });
      }
    ], function (err, sessionCart, userCart) {
      console.log('sessionCart', sessionCart)
      console.log('userCart', userCart)

      mergeCarts(sessionCart, userCart, function(){
        if(req.user.isAdmin){
          return res.redirect('/admin');
        } else {
          return res.redirect('/account');
        } 
      });
    });

  } else if(cart && !userCartNum){
    User.update({_id: req.user._id}, {cart: req.session.cart._id},function(err, user){
      if(err){
        console.log(err);
      }
      if(req.user.isAdmin){
        return res.redirect('/admin');
      } else {
        return res.redirect('/account');
      } 
    });
  } else {
    if(req.user.isAdmin){
      return res.redirect('/admin');
    } else {
      return res.redirect('/account');
    } 
  }
}

function mergeCarts(sessionCart, userCart, callback){
  var itemExists = false,
        itemQty,
        userItemQty;

  _.each(sessionCart.itemList, function(sessItemQty){
    itemQty = sessItemQty;

    _.each(userCart.itemList, function(usItemQty){
      userItemQty = usItemQty;

      if(itemQty.item === userItemQty.item){
        itemExists = true;
      }

      if(itemExists){
        // Update item quantity
        console.log('updating qty')
        console.log(userItemQty)
        var newQty = Number(userItemQty.qty) + Number(itemQty.qty);
        userItemQty.qty = newQty;
        console.log(userItemQty)

        userItemQty.save(function (err, updatedItemQty){
          if(err){
            console.log(err);
          } else {
            console.log('new qty', updatedItemQty)
            callback(err, updatedItemQty);
          }
        });
        // TODO: Change cart status
      } else {
        console.log('need to add')
        // push itemQty into userCart
        userCart.itemList.push(itemQty);
        userCart.save(function(err, updatedOrder){
          if(err){
            console.log(err);
          } else {
            console.log('updatedOrder', updatedOrder)
            callback(err, updatedOrder);
          }
        });
      }
    });
  });
}

module.exports = loginRouter;
