/**
 * Admin Router
 **/

var express = require('express'),
    adminRouter = express.Router(),
    User = require('../models/User'),
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

module.exports = adminRouter;