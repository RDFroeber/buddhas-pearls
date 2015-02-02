/**
 * Store Router
 **/

var express = require('express'),
    moment = require('moment'),
    storeRouter = express.Router(),
    Item = require('../models').Item,
    Category = require('../models').Category;

storeRouter.route('/')
  .get(function(req, res, next) {
    Item.find().exec(function(err, items){
      if(err){
        console.log(err);
      }
      Category.find().exec(function(err, categories){
        if(err){
          console.log(err);
        }
        return res.render('items/store', {user: req.user, items: items, categories: categories});
      });
    });
  });

storeRouter.route('/new')
  .get(function(req, res, next) {
    var twoWeeksAgo = moment().subtract('weeks', 2).valueOf();

    Item.find({createdAt: {$lte: twoWeeksAgo}}).exec(function(err, items){
      if(err){
        console.log(err);
      }
      Category.find().exec(function(err, categories){
        if(err){
          console.log(err);
        }
        return res.render('items/store', {user: req.user, items: items, categories: categories});
      });
    });
  });

storeRouter.route('/sale')
  .get(function(req, res, next) {
    Item.find({'pricing.onSale': true}).exec(function(err, items){
      if(err){
        console.log(err);
      }
      Category.find().exec(function(err, categories){
        if(err){
          console.log(err);
        }
        return res.render('items/store', {user: req.user, items: items, categories: categories, sale: true});
      });
    });
  });

storeRouter.route('/items/:itemSku')
  .get(function(req, res, next) {
    var sku = req.param('itemSku');

    Item.findOne({sku: sku}).exec(function(err, item){
      if(err){
        console.log(err);
      }
      return res.render('items/storeDetail', {user: req.user, item: item});
    });
  });
 
module.exports = storeRouter;