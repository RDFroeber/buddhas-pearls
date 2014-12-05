/**
 * User Router
 **/

var express = require('express'),
    userRouter = express.Router(),
    User = require('../models').User;

userRouter.use(function(req, res, next) {
  if(req.user){
    return next();
  } else {
    return res.redirect('/login');
  }
});

userRouter.route('/edit')
  .get(function(req, res, next) {
    var statesArray = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
    return res.render('users/edit', {user: req.user, states: statesArray});
  })

userRouter.route('/')
  .get(function(req, res, next) {
    return res.render('users/view', req.user);
  })
  .post(function(req, res, next) {
    delete req.body._csrf;
    var userObj = req.body;
    userObj.updatedAt = Date.now();

    req.user.set(userObj);
    req.user.save(function(err, user) {
      return res.redirect('/account');
    });
  })
  .delete(function(req, res, next) {
    req.user.remove(function(err) {
      return res.json({});
    });
  });
 
module.exports = userRouter;
