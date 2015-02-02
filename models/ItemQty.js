'use strict';

/**
 * ItemQty Model
 **/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Item = require('./Item');

var itemQtySchema = new Schema({
  item       : {
    type     : Schema.Types.ObjectId, 
    ref      : 'Item' 
  },
  qty        : {
    type     : Number,
    required : true
  },
  itemTotal  : {
    type     : Number,
    // required : true
  }
});

/**
* Pre-Save
**/

itemQtySchema.pre('save', function(next) {
  var self = this;

  Item.findById(self.item).exec(function(err, item){
    if(err) {
      console.log(err);
    }
    self.itemTotal = self.qty * item.pricing.total;
    return next();
  });
});

module.exports = mongoose.model('ItemQty', itemQtySchema);
