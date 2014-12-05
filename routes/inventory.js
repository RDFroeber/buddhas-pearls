/**
 * Item Inventory Router
 **/

var express = require('express'),
    inventoryRouter = express.Router(),
    Item = require('../models').Item;

inventoryRouter.use(function(req, res, next) {
  if(req.user && req.user.isAdmin){
    return next();
  } else {
    return res.redirect('/');
  }
});

inventoryRouter.route('/')
  .get(function(req, res, next) {
    Item.find().exec(function(err, items){
      if(err){
        console.log(err);
      }
      return res.render('inventory', {user: req.user, items: items});
    });
  })
  .post(function(req, res, next) {
    var itemObj = req.body;

    Item.create(itemObj, function(err, item) {
      if(err){
        return res.redirect('/inventory/');
      } else {
        return res.redirect('/inventory/items/' + item.sku);
      }
    });
  });

inventoryRouter.route('/new')
  .get(function(req, res, next) {
    return res.render('items/new', {user: req.user});
  });

inventoryRouter.route('/items/:itemSku')
  .get(function(req, res, next) {
    var sku = req.param('itemSku');

    Item.findOne({sku: sku}).exec(function(err, item){
      if(err){
        console.log(err);
      }
      return res.render('items/edit', {user: req.user, item: item});
    });
  })
  .put(function(req, res, next) {
    var itemObj = req.body;

    itemObj.updatedAt = Date.now();
    
    Item.findOne({sku: sku}).exec(function(err, item){
      if(err){
        console.log(err);
      }
      item.set(itemObj);
      item.save(function(err, updatedItem) {
        if(err){
          return res.redirect('/item/' + item.sku);
        } else {
          return res.redirect('/inventory');
        }
      });
    });
  })
  .delete(function(req, res, next) {
    // req.user.remove(function(err) {
    //   return res.json({});
    // });
  });
 
module.exports = inventoryRouter;