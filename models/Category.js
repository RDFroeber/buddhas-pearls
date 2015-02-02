'use strict';

/**
 * Category Model
 **/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment');

var categorySchema = new Schema({
  name        : {
    type      : String, 
    require   : true,
    trim      : true
  },
  type        : {
    type      : String, 
    enum      : ['Jewelry', 'Misc'],
    require   : true
  },
  description : {
    type      : String, 
    trim      : true
  },
  counter     : {
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

categorySchema.virtual('created').get(function(){
  return moment(this.createdAt.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ').format('MMMM Do YYYY, h:mm a');
});

categorySchema.virtual('updated').get(function(){
  return moment(this.updatedAt.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ').format('MMMM Do YYYY, h:mm a');
});

categorySchema.set('toObject', { virtuals: true });


module.exports = mongoose.model('Category', categorySchema);
