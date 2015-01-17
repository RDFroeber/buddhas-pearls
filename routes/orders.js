/**
 * Order Router
 **/

var express = require('express'),
    orderRouter = express.Router(),
    async = require('async'),
    _ = require('underscore');
    Order = require('../models').Order,
    Item = require('../models').Item,
    ItemQty = require('../models').ItemQty;

/**
 * Order Router Middleware 
 **/

orderRouter.use(function(req, res, next) {
  res.app.locals.cart = req.session.cart;
  return next();
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

orderRouter.route('/cart')
  .put(function(req, res, next) {
    var userId = req.user && req.user._id,
        orderNumber = req.session.cart && req.session.cart.number,
        itemId = req.param('item'),
        itemQtyObj = new ItemQty(req.body);

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
                    return res.redirect('/orders/' + order.number);
                  }
                });
              }
            });
          } else {
            console.log('need to create')
            addItemToOrder(order, itemQtyObj, function(newOrder){
              req.session.cart = newOrder;
              return res.redirect('/orders/' + newOrder.number);
            });
          }
        }
      });
    } else {
      console.log('no order');
      createOrderWithItem(userId, itemQtyObj, function(newOrder){
        req.session.cart = newOrder;
        return res.redirect('/orders/' + newOrder.number);
      });
    }
  });
 
module.exports = orderRouter;

/**
 * Private Methods 
 **/

function numericParse(dirtyObj){
  var numericKeys = Object.keys(dirtyObj).filter(function(key){
    return !isNaN(parseInt(key, 10));
  });
  return numericKeys;
}

function createOrderWithItem(userId, itemQtyObj, callback){
  // create itemqty
  itemQtyObj.saveAsync()
  .spread(function(savedItemQty, numAffected) {
    console.log(savedItemQty)
    return savedItemQty;
  })
  .then(function(ItemQty){
    var order = new Order({user: userId, status: 'Cart', itemList: [ItemQty]});
    // create order
    order.saveAsync()
    .spread(function(savedOrder, numAffected) {
      callback(savedOrder);
    })
    .catch(function(err) {
      console.log(err);
    });
  }).catch(function(err) {
    console.log(err);
  });
}

function addItemToOrder(order, itemQtyObj, callback){
  // create itemqty
  itemQtyObj.saveAsync()
  .spread(function(savedItemQty, numAffected) {
    console.log(savedItemQty)
    return savedItemQty;
  })
  .then(function(ItemQty){
    order.itemList.push(ItemQty);
    // create order
    order.saveAsync()
    .spread(function(savedOrder, numAffected) {
      callback(savedOrder);
    })
    .catch(function(err) {
      console.log(err);
    });
  }).catch(function(err) {
    console.log(err);
  });
}

function populateItems(itemId, order, itemQtyObj, callback){
  _.each(order.itemList, function(oneItemQty){
    var existingId = oneItemQty.item;

    if(existingId.toString() === itemId.toString()){
      // Update that item's quantity
      var newQty = new Number(oneItemQty.qty) + new Number(itemQtyObj.qty);
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