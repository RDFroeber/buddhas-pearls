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
    var orderNumber = req.param('orderNum');

    Order.findOne({number: orderNumber}, {_id: 0}).populate('itemList.item').exec(function(err, order){
      if(err){
        console.log(err);
      }
      return res.render('orders/view', {user: req.user, order: order});
    });
  });

orderRouter.route('/cart')
  .put(function(req, res, next) {
    var userId = req.user && req.user._id,
        orderNumber = req.session.cart && req.session.cart.number,
        itemId = req.param('item'),
        itemQtyObj = req.body;

    async.waterfall([
      // Find or create order
      function(cb){
        if(orderNumber){
          Order.findOne({number: orderNumber}).populate(['itemList', 'itemList.item']).exec(function(err, order){
            if(err){
              console.log(err);
            } else {
              cb(err, order);
            }
          });
        } else {
          Order.create({user: userId, status: 'Cart'}, function(err, order){
            if(err){
              console.log(err);
            } else {
              orderNumber = order.number;
              cb(err, order);
            }
          });
        }
      },
      // Add items to order "cart"
      function(order, cb){
        // Existing items in itemList
        if(order.itemList && order.itemList.length >= 1){
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
                    }
                    console.log('saved: ', newItemQty)
                  });
                }
              });
            } else {
              ItemQty.create(itemQtyObj, function(err, newItemQty){
                if(err){
                  console.log(err);
                } else {
                  order.itemList.push(newItemQty);
                  cb(err, order);
                }
              });
            }
          });
          // var numericKeys = numericParse(order.itemList);
          // for(var i in numericKeys){
          //   var existingId = order.itemList[i].item;
          //   // Item in itemList matches item being added
          //   if(existingId.toString() === itemId.toString()){
          //     // Update that item's quantity
          //     var newQty = new Number(order.itemList[i].qty) + new Number(itemQtyObj.qty);
          //     ItemQty.findById(order.itemList[i]._id).exec(function(err, itemQty){
          //       if(err){
          //         console.log(err);
          //       } else {
          //         itemQty.qty = newQty;
          //         itemQty.save(function (err, newItemQty){
          //           if(err){
          //             console.log(err);
          //           }
          //           console.log('saved: ', newItemQty)
          //         });
          //       }
          //     });
          //   } else {
          //     ItemQty.create(itemQtyObj, function(err, newItemQty){
          //       if(err){
          //         console.log(err);
          //       } else {
          //         order.itemList.push(newItemQty);
          //         cb(err, order);
          //       }
          //     });
          //   }
          cb(null, order);
        // No items in itemList
        } else {
          ItemQty.create(itemQtyObj, function(err, newItemQty){
            if(err){
              console.log(err);
            } else {
              order.itemList.push(newItemQty);
              cb(err, order);
            }
          });
        }
      },
      // Calculate order total and update order
      function(order, cb){
        console.log('hi')
        order.updatedAt = Date.now();
        order.save(function (err, order){
          if(err){
            console.log(err);
          }
          console.log('saved')
          cb(err, order);
        });  
        // Order.findOne({number: orderNumber}).populate(['itemList', 'itemList.item']).exec(function(err, foundOrder){
        //   if(err){
        //     console.log(err);
        //   } else {
        //     console.log('foundOrder')
        //     console.log(foundOrder)
        //     _.each(foundOrder.itemList, function(itemQty){
        //       console.log(itemQty)
        //     });
        //     cb(err, order);
        //   }
        // });
      }
    ], function (err, order) {
      console.log('done')
      console.log(order)
      // order.updatedAt = Date.now();
      // order.save(function (err, order){
      //   if(err){
      //     console.log(err);
      //   }
        req.session.cart = order;
        return res.redirect('/orders/' + order.number);
      // });  
    });
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
