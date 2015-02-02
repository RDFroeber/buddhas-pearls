'use strict';

/**
 * User Router
 **/

var express = require('express'),
    userRouter = express.Router(),
    User = require('../models').User;

/**
 * User Router Middleware 
 **/

userRouter.use(function(req, res, next) {
  if(req.user){
    // TODO: only their account || isAdmin
    return next();
  } else {
    return res.redirect('/login');
  }
});

userRouter.route('/settings')
  .get(function(req, res) {
    return res.render('users/settings', req.user);
  });

userRouter.route('/edit')
  .get(function(req, res) {
    var statesArray = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
    return res.render('users/edit', {user: req.user, states: statesArray});
  });

userRouter.route('/')
  .get(function(req, res) {
    return res.render('users/dashboard', req.user);
  })
  // .post(function(req, res) {
  //   var userObj = req.body;
  //   userObj.updatedAt = Date.now();

  //   req.user.set(userObj);
  //   req.user.save(function(err, user) {
  //     return res.redirect('/account');
  //   });
  // })
  .put(function(req, res) {
    var userObj = req.body;
    userObj.updatedAt = Date.now();

    req.user.set(userObj);
    req.user.save(function(err, user) {
      return res.redirect('/account/settings');
    });
  })
  .delete(function(req, res) {
    req.user.remove(function(err) {
      return res.json({});
    });
  });
 
module.exports = userRouter;
