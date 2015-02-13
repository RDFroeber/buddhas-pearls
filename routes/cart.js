'use strict';

/**
 * Cart Router
 **/

var express = require('express'),
    cartRouter = express.Router(),
    async = require('async'),
    _ = require('underscore'),
    Order = require('../models').Order,
    Item = require('../models').Item,
    ItemQty = require('../models').ItemQty;

cartRouter.route('/')
  .get(function(req, res) {
    var orderId,
        itemQties = [];

    if(req.session.cart && req.session.cart.number){
      orderId = req.session.cart._id;
    } else if(req.user && req.user.cart){
      orderId = req.user.cart;
    }

    Order.findById(orderId, {_id: 0}).populate('itemList').exec(function(err, order){
      if(err){
        console.log(err);
      } else if(order){
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
            return res.render('orders/cart', {user: req.user, order: orderObj});
        });
      } else {
        console.log('empty cart');
        return res.render('orders/cart', {user: req.user});  
      }
    });
  })
  .put(function(req, res) {
    var userId = req.user && req.user._id,
        orderNumber,
        itemId = req.params.item,
        itemQtyObj = new ItemQty(req.body);

    if(req.user && req.user.cart){
      orderNumber = req.user.cart;
    } else if(req.session.cart && req.session.cart.number){
      orderNumber = req.session.cart.number;
    }
    // TODO: Fix logic!
    if(orderNumber){
      Order.findOne({number: orderNumber}).populate(['itemList', 'itemList.item']).exec(function(err, order) {
        if(err){
          console.log(err);
        } else {
          if(userId){
            order.user = userId;
          }
          // Existing items in itemList
          if(order.itemList && order.itemList.length >= 1){
            // Updated quantity
            console.log('need to update')
            populateItems(itemId, order, itemQtyObj, function(err, order){
              if(err){
                console.log(err);
              } else {
                order.save(function (err, savedOrder){
                  console.log('savedOrder!', savedOrder)
                  if(err){
                    console.log(err);
                  } else {
                    return res.redirect('/cart');
                  }
                });
              }
            });
          } else {
            console.log('need to create')
            addItemToOrder(order, itemQtyObj, function(newOrder){
              req.session.cart = newOrder;
              return res.redirect('/cart');
            });
          }
        }
      });
    } else {
      console.log('no order');
      createOrderWithItem(userId, itemQtyObj, function(newOrder){
        req.session.cart = newOrder;
        return res.redirect('/cart');
      });
    }
  });
 
module.exports = cartRouter;

/**
 * Private Methods 
 **/

function createOrderWithItem(userId, itemQtyObj, callback){
  async.waterfall([
    function(next){
      // create itemqty
      itemQtyObj.save(function(err, savedQty){
        if(err){
          console.log(err);
        } else {
          next(null, savedQty);
        }
      });
    },
    function(ItemQty, next){
      var order = new Order({user: userId, status: 'Cart', itemList: [ItemQty]});
      // create order
      order.save(function(err, savedOrder){
       if(err){
          console.log(err);
        } else {
          next(null, savedOrder);
        }
      });
    }
  ], function (err, savedOrder) {
     callback(savedOrder);
  });
}

function addItemToOrder(order, itemQtyObj, callback){
  async.waterfall([
    function(next){
      // create itemqty
      itemQtyObj.save(function(err, savedQty){
        if(err){
          console.log(err);
        } else {
          next(null, savedQty);
        }
      });
    },
    function(ItemQty, next){
      order.itemList.push(ItemQty);
      // update order
      order.save(function(err, savedOrder){
       if(err){
          console.log(err);
        } else {
          next(null, savedOrder);
        }
      });
    },
  ], function (err, savedOrder) {
     callback(savedOrder);
  });
}

function populateItems(itemId, order, itemQtyObj, callback){
  _.each(order.itemList, function(oneItemQty){
    var existingId = oneItemQty.item;

    if(existingId.toString() === itemId.toString()){
      // Update that item's quantity
      var newQty = Number(oneItemQty.qty) + Number(itemQtyObj.qty);
      ItemQty.findById(oneItemQty._id).exec(function(err, itemQty){
        if(err){
          console.log(err);
        } else {
          itemQty.qty = newQty;
          itemQty.save(function (err, newItemQty){
            if(err){
              console.log(err);
            } else {
              callback(err, order);
            }
          });
        }
      });
    } else {
      ItemQty.create(itemQtyObj, function(err, newItemQty){
        if(err){
          console.log(err);
        } else {
          order.itemList.push(newItemQty);
          callback(err, order);
        }
      });
    }
  });
}