/**
 * Order Model
 **/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment');

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
    enum      : ['Cart', 'Pending', 'Approved', 'Complete', 'Canceled']
  },
  total       : {
    type      : Number,
    default   : 0
  },
  quantity    : {
    type      : Number,
    default   : 0
  },
  createdAt   : { 
    type      : Date, 
    default   : Date.now 
  },
  updatedAt   :  { 
    type      : Date, 
    default   : Date.now 
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

  while(time === new Date().getTime());
  return new Date().getTime();
};

/**
* Pre-Save
**/

orderSchema.pre('save', function(next) {
  var self = this;

  if(self.number === undefined){
    self.number = generateOrderNum();
    return next();
  } else {
    return next();
  }
});

module.exports = mongoose.model('Order', orderSchema);
