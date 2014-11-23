/**
 * Home Router
 **/

var express = require('express'),
    homeRouter = express.Router();

homeRouter.route('/')
  .get(function(req, res, next) {
    return res.render('index', {greeting: 'Welcome to My Site!'});
  });
 
module.exports = homeRouter;
