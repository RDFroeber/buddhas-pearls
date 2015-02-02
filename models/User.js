'use strict';

/**
 * User Model
 **/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    moment = require('moment');

var userSchema = new Schema({
  firstName   : {
    type      : String, 
    trim      : true
  },
  lastName    : {
    type      : String, 
    trim      : true
  },
  local       : {
    email     : {
      type    : String, 
      unique  : true,
      lowercase: true,
      trim    : true
    },
    password: {
      type    : String
    }
  },
  google      : {
    id        : String,
    token     : String,
    email     : String,
    name      : String
  },
  facebook    : {
    id        : String,
    token     : String,
    email     : String,
    name      : String
  },
  twitter     : {
    id        : String,
    token     : String,
    email     : String,
    name      : String
  },
  isAdmin     : {
    type      : Boolean,
    default   : false 
  },
  addresses   : [{
    street    : {
      type    : String, 
      trim    : true
    },
    city      : {
      type    : String, 
      trim    : true
    },
    state     : String,
    zipcode   : Number,
    primary   : Boolean
  }],
  numbers     : {
    home      : {
      type    : Number
    },
    cell      : {
      type    : Number
    },
    work      : {
      type    : Number
    }
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

userSchema.virtual('fullName').get(function(){
  var fullName;

  if(this.firstName && this.lastName){
    fullName = this.firstName + ' ' + this.lastName;
  } else if(this.google.name){
    fullName = this.google.name;
  } else if(this.facebook.name){
    fullName = this.facebook.name;
  }
  
  return fullName;
});

userSchema.virtual('email').get(function(){
  var email;

  if(this.local.email){
    email = this.local.email;
  } else if(this.google.email){
    email = this.google.email;
  } else if(this.facebook.email){
    email = this.facebook.email;
  }
  
  return email;
});

userSchema.virtual('created').get(function(){
  return moment(this.createdAt.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ').format('MMMM Do YYYY, h:mm a');
});

userSchema.virtual('updated').get(function(){
  return moment(this.updatedAt.toISOString(), 'YYYY-MM-DDTHH:mm:ss.sssZ').format('MMMM Do YYYY, h:mm a');
});

userSchema.set('toObject', { virtuals: true });

/**
* Set Global Methods
**/

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
