/**
 * Item Model
 **/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment'),
    Category = require('./Category');

var itemSchema = new Schema({
  name        : {
    type      : String, 
    require   : true,
    trim      : true
  },
  category: { 
    type      : Schema.Types.ObjectId, 
    required  : true,
    ref       : 'Category' 
  },
  sku         : {
    type      : String, 
    unique    : true,
    require   : true
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

/**
* Private Methods
**/

function generateSku(category) {
  var name = category.name,
      counter = category.counter,
      sku = '';

  switch(name.toLowerCase()) {
    case 'necklace':
      sku = 'NL';
      break;
    case 'earrings':
      sku = 'EA';
      break;
    case 'bracelet':
      sku = 'BR';
      break;
    case 'set':
      sku = 'SE';
      break;
    case 'jewelry':
      sku = 'JE';
      break;
    default:
      sku = 'UN';
  }

  switch(counter.toString().length) {
    case 1:
      sku = sku + '-000' + counter.toString();
      break;
    case 2:
      sku = sku + '-00' + counter.toString();
      break;
    case 3:
      sku = sku + '-00' + counter.toString();
      break;
    case 4:
      sku = sku + '-0' + counter.toString();
      break;
     default:
      sku = sku + '-' + counter.toString();
  }

  return sku;
    
};

/**
* Pre-Save
**/

itemSchema.pre('save', function(next) {
    var self = this;
    Category.findById(self.category).exec(function(err, category){
      if(err) {
        console.log(err);
      }
      self.sku = generateSku(category);
      category.counter += 1;
      category.save(function(err, updatedCategory){
        if(err){
          console.log(err);
        }
        next();
      })
    });
});

module.exports = mongoose.model('Item', itemSchema);
