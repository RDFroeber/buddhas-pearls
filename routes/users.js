/**
 * User Router
 **/

var express = require('express'),
    userRouter = express.Router(),
    User = require('../models').User;
 
userRouter.param('userId', function(req, res, next, id) {
  User.findById(req.params.userId).exec(function(err, user) {
    req.user = user;
    return next();
  });
});

userRouter.route('/:userId')
  .get(function(req, res, next) {
    return res.json(req.user || {});
  })
  .post(function(req, res, next) {
    var user = new User(req.body);
    user.save(function(err, user) {
      return res.json(user);
    });
  })
  .put(function(req, res, next) {
    req.user.set(req.body);
    req.user.save(function(err, user) {
      return res.json(user);
    });
  })
  .delete(function(req, res, next) {
    req.user.remove(function(err) {
      return res.json({});
    });
  });
 
module.exports = userRouter;
