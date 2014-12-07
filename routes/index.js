/**
 * Home Router
 **/

var express = require('express'),
    homeRouter = express.Router();

homeRouter.route('/')
  .get(function(req, res, next) {
    return res.render('index', {home: true, greeting: 'Welcome to My Site!'});
  });
 
homeRouter.route('/about')
  .get(function(req, res, next) {
    return res.render('about', {});
  });

module.exports = homeRouter;
