/**
 * Order Router
 **/

var express = require('express'),
    orderRouter = express.Router(),
    async = require('async'),
    Order = require('../models').Order,
    Item = require('../models').Item,
    ItemQty = require('../models').ItemQty;

/**
 * Order Router Middleware 
 **/

orderRouter.use(function(req, res, next) {
  res.app.locals.cart = req.session.cart;
  if(req.user){
    return next();
  } else {
    return res.redirect('/login');
  }
});

orderRouter.route('/')
  .get(function(req, res, next) {
    Order.find({user: req.user._id}, {_id: 0}).populate('itemList').exec(function(err, orders){
      if(err){
        console.log(err);
      } else {
        return res.render('orders/index', {user: req.user, orders: orders});
      }
    });
  });

orderRouter.route('/:orderNum')
  .get(function(req, res, next) {
    var orderNumber = req.param('orderNum'),
        itemQties = [];

    Order.findOne({number: orderNumber}, {_id: 0}).populate('itemList').exec(function(err, order){
      if(err){
        console.log(err);
      } else {
        var orderObj = order.toObject();
        async.each(order.itemList, function(itemQty, callback) {
          var itemQtyObj = itemQty.toObject();

          Item.findById(itemQty.item).exec(function(err, item){
            if(err){
              console.log(err);
            } else {
              itemQtyObj.item = item;
              itemQties.push(itemQtyObj);
              callback(err, item)
            }
          });
        }, function(err, item){
            orderObj.itemList = itemQties;
            return res.render('orders/view', {user: req.user, order: orderObj});
        });
      }
    });
  });
 
module.exports = orderRouter;
