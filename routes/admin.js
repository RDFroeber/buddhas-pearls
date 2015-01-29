/**
 * Admin Router
 **/

var express = require('express'),
    adminRouter = express.Router(),
    User = require('../models').User,
    passport = require('passport');

/**
 * Admin Router Middleware 
 **/

adminRouter.use(function(req, res, next) {
  if(req.user && req.user.isAdmin){
    return next();
  } else if(req.user && !req.user.isAdmin){
    return res.redirect('/account');
  } else {
    return res.redirect('/login');
  }
});
 
/**
 * Admin Authentication
 **/

adminRouter.route('/')
  .get(function(req, res, next) {
    return res.render('admin');
  });

adminRouter.route('/users')
  .get(function(req, res, next) {
    User.find().exec(function(err, users){
      if(err){
        console.log(err);
      }
      return res.render('users/index', {user: req.user, users: users});
    });
  });

module.exports = adminRouter;