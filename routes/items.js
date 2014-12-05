/**
 * Item Router
 **/

var express = require('express'),
    itemRouter = express.Router(),
    Item = require('../models').Item;

itemRouter.route('/')
  .get(function(req, res, next) {
    Item.find().exec(function(err, items){
      if(err){
        console.log(err);
      }
      return res.render('items/index', {user: req.user, items: items});
    });
  });

itemRouter.route('/items/:itemSku')
  .get(function(req, res, next) {
    var sku = req.param('itemSku');

    Item.findOne({sku: sku}).exec(function(err, item){
      if(err){
        console.log(err);
      }
      return res.render('items/view', {user: req.user, item: item});
    });
  });
 
module.exports = itemRouter;