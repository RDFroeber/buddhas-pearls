'use strict';

/**
 * Home Router
 **/

var express = require('express'),
    homeRouter = express.Router();

/**
 * Home Router Middleware 
 **/

homeRouter.use(function(req, res, next) {
  res.app.locals.user = req.user;
  res.app.locals.cart = req.session.cart;
  return next();
});

homeRouter.route('/')
  .get(function(req, res) {
    return res.render('index', {home: true, greeting: 'Welcome to My Site!'});
  });
 
homeRouter.route('/about')
  .get(function(req, res) {
    return res.render('about', {});
  });

module.exports = homeRouter;
