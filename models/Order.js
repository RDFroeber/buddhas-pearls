'use strict';

/**
 * Order Model
 **/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment'),
    async = require('async'),
    ItemQty = require('./ItemQty');

var orderSchema = new Schema({
  number      : {
    type      : String, 
    require   : true,
    trim      : true
  },
  user        : {
    type      : Schema.Types.ObjectId, 
    ref       : 'User' 
  },
  itemList    : [{
    type      : Schema.Types.ObjectId, 
    ref       : 'ItemQty' 
  }],
  status      : {
    type      : String, 
    enum      : ['Cart', 'Pending', 'Approved', 'Complete', 'Canceled', 'Merged']
  },
  totalPrice  : {
    type      : Number,
    default   : 0
  },
  quantity    : {
    type      : Number,
    default   : 0
  },
  createdAt   : { 
    type      : Date, 
    default   : Date.now()
  },
  updatedAt   :  { 
    type      : Date, 
    default   : Date.now()
  }
});

/**
* Set Global Virtual Attributes
**/

orderSchema.virtual('created').get(function(){
  return moment(this.createdAt.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ').format('MMMM Do YYYY, h:mm a');
});

orderSchema.virtual('updated').get(function(){
  return moment(this.updatedAt.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ').format('MMMM Do YYYY, h:mm a');
});

orderSchema.set('toObject', { virtuals: true });

/**
* Private Methods
**/

function generateOrderNum() {
  var time = new Date().getTime();

  while(time === new Date().getTime()){
    return new Date().getTime();
  }
}

function calculateTotal(self, next) {
  var order = self,
      orderTotal = 0,
      orderQuant = 0;

  async.each(order.itemList, function(itemQtyId, callback) {
    ItemQty.findById(itemQtyId).exec(function(err, item){
      if(err){
        console.log(err);
      } else {
        orderQuant += item.qty;
        orderTotal += parseInt(item.itemTotal, 10);
        callback(err, item);
      }
    });
  }, function(err, item){
    if(err){
      console.log(err);
    } else {
      order.totalPrice = orderTotal;
      order.quantity = orderQuant;
      return next();
    }
  });
}

/**
* Pre-Save
**/

orderSchema.pre('save', function(next) {
  var self = this;

  calculateTotal(self, function(){
    if(self.number === undefined){
      self.number = generateOrderNum();
      return next();
    } else {
      return next();
    }
  });
});

module.exports = mongoose.model('Order', orderSchema);
