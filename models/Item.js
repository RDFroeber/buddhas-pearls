/**
 * Item Model
 **/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    moment = require('moment');

var itemSchema = new Schema({
  name        : {
    type      : String, 
    require   : true,
    trim      : true
  },
  sku         : {
    type      : String, 
    // require   : true
  },
  imageUrl    : {
    type      : String, 
    // require   : true
  },
  description : {
    type      : String, 
    require   : true,
    trim      : true
  },
  price       : {
    type      : Number, 
    require   : true
  },
  inStock     : {
    type      : Number, 
    require   : true
  },
  onSale      : {
    type      : Boolean,
    default   : false 
  },
  additional  : {
    type      : String, 
    trim      : true
  },
  dimensions  : {
    height    : Number,
    length    : Number,
    width     : Number,
    weight    : Number
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

itemSchema.virtual('created').get(function(){
  return moment(this.createdAt.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ').format('MMMM Do YYYY, h:mm a');
});

itemSchema.virtual('updated').get(function(){
  return moment(this.updatedAt.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ').format('MMMM Do YYYY, h:mm a');
});

itemSchema.set('toObject', { virtuals: true });


module.exports = mongoose.model('Item', itemSchema);
