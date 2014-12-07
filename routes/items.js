/**
 * Item Inventory Router
 **/

var express = require('express'),
    inventoryRouter = express.Router(),
    moment = require('moment'),
    Item = require('../models').Item,
    Category = require('../models').Category,
    AWS = require('aws-sdk'),
    auth = require('../config/auth').AWS;

var s3 = new AWS.S3({accessKeyId: auth.accessKeyId, secretAccessKey: auth.secretAccessKey});

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
      return res.render('items/index', {user: req.user, items: items});
    });
  })
  .post(function(req, res, next) {
    var itemObj = req.body,
        imageObj = req.files.image;

    Category.findById(itemObj.category).exec(function(err, category){
      if(err){
        console.log(err);
      }

      if(imageObj){
        var imagePath = 'https://divorante.s3-us-west-2.amazonaws.com/' + uploadImage(s3, imageObj, category);
        itemObj.imageUrl = imagePath; 
      }

      Item.create(itemObj, function(err, item) {
        if(err){
          return res.redirect('/inventory');
        } else {
          return res.redirect('/inventory/items/' + item.sku);
        }
      });
    });
  });

inventoryRouter.route('/new')
  .get(function(req, res, next) {
    Category.find().exec(function(err, categories){
      if(err){
        console.log(err);
      }
      return res.render('items/new', {user: req.user, categories: categories});
    });
  });


inventoryRouter.route('/edit/:itemSku')
  .get(function(req, res, next) {
    var sku = req.param('itemSku');

    Category.find().exec(function(err, categories){
      if(err){
        console.log(err);
      }
      Item.findOne({sku: sku}).exec(function(err, item){
        if(err){
          console.log(err);
        }
        return res.render('items/edit', {user: req.user, item: item, categories: categories});
      });
    });
  });

inventoryRouter.route('/items/:itemSku')
  .get(function(req, res, next) {
    var sku = req.param('itemSku');

    Item.findOne({sku: sku}).exec(function(err, item){
      if(err){
        console.log(err);
      }
      return res.render('items/view', {user: req.user, item: item});
    });
  })
  .post(function(req, res, next) {
    var sku = req.param('itemSku'),
        itemObj = req.body,
        imageObj = req.files.image;

    for (var i in itemObj) {
      if (itemObj[i] === undefined) {
        delete itemObj[i];
      }
    }

    Category.findById(itemObj.category).exec(function(err, category){
      if(err){
        console.log(err);
      } else {
        
        if(imageObj){
          var imagePath = 'https://divorante.s3-us-west-2.amazonaws.com/' + uploadImage(s3, imageObj, category);
          itemObj.imageUrl = imagePath; 
        }
        
        itemObj.updatedAt = Date.now();
        
        Item.findOne({sku: sku}).exec(function(err, item){
          if(err){
            console.log(err);
          }
          item.set(itemObj);
          item.save(function(err, updatedItem) {
            if(err){
              return res.redirect('/inventory');
            } else {
              return res.redirect('/inventory/items/' + item.sku);
            }
          });
        });
      }
    });
  })
  .delete(function(req, res, next) {
    var sku = req.param('itemSku');

    Item.findOne({sku: sku}).remove(function(err) {
      if(err){
        console.log(err);
      }
      return res.redirect('/inventory');
    });   
  });

/**
 * Private Methods
 **/

function uploadImage(s3, imageObj, category){
  var date = moment().format('YYYY/MM/DD'),
      imageName = imageObj.originalname,
      path = 'buddhas/';

  path += category.name.toLowerCase() + '/' + date + '/' + imageName;

  var data = {
    Bucket: 'divorante',
    ACL: 'public-read',
    Key: path,
    ContentType: imageObj.mimetype,
    Body: imageObj.buffer
  };

  s3.putObject(data, function(err, data) {
    if(err) {
      console.log(err);
    } else {
      console.log('Successfully uploaded image!');
    }
  });

  return path;
}
 
module.exports = inventoryRouter;