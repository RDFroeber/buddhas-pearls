/**
 * Category Router
 **/

var express = require('express'),
    categoryRouter = express.Router(),
    Category = require('../models').Category;

categoryRouter.route('/categories')
  .get(function(req, res, next) {
    Category.find().populate('parent').exec(function(err, categories){
      if(err){
        console.log(err);
      }
      return res.render('categories/index', {user: req.user, categories: categories});
    });
  })
  .post(function(req, res, next) {
    var categoryObj = req.body;
    if(categoryObj.parent === 'null'){
      delete categoryObj.parent;
    }

    Category.create(categoryObj, function(err, category) {
      if(err){
        console.log(err);
      } else {
        return res.redirect('/inventory/categories');
      }
    });
  });

categoryRouter.route('/categories/new')
  .get(function(req, res, next) {
    Category.find().exec(function(err, categories){
      if(err){
        console.log(err);
      }
      return res.render('categories/new', {user: req.user, categories: categories});
    });
  })

// categoryRouter.route('/categories/:name')
//   .get(function(req, res, next) {
//     var name = req.param('name');

//     Category.findOne({name: name}).exec(function(err, category){
//       if(err){
//         console.log(err);
//       }
//       return res.render('items/categories/view', {user: req.user, category: category});
//     });
//   });
 
module.exports = categoryRouter;