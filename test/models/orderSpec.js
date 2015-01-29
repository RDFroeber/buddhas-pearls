'use strict';

var expect = require('chai').expect,
    Order = require('../../models').Order;

describe('Order', function() {
  var schema = Order.schema.paths;

  it('should exist', function() {
    expect(Order).to.exist;
  });

  describe('.number', function() {
    it('should exist and be a String', function() {
      expect(schema.number).to.exist;
      expect(schema.number.instance).to.equal('String');
    });

    it('should be required', function() {
      expect(schema.number.options.require).to.equal(true);
    });
  });

  describe('.user', function() {
    it('should exist and be an Object Id', function() {
      expect(schema.user).to.exist;
      expect(schema.user.instance).to.equal('ObjectID');
    });

    it('should reference User', function() {
      expect(schema.user.options.ref).to.equal('User');
    });
  });

  describe('.itemList', function () {
    it('should exist and be an Array', function() {
      expect(schema.itemList).to.exist;
      expect(schema.itemList.options.type).to.be.a('Array');
    });

    it('should contain a collection of Object Ids', function() {
      expect(schema.itemList.caster.instance).to.equal('ObjectID');
    });

    it('should reference ItemQty', function() {
      expect(schema.itemList.caster.options.ref).to.equal('ItemQty');
    });
  });

  // status      : {
  //   type      : String, 
  //   enum      : ['Cart', 'Pending', 'Approved', 'Complete', 'Canceled']
  // },

  describe('.totalPrice', function() {
    it('should exist and be a Number', function() {
      expect(schema.totalPrice).to.exist;
      expect(schema.totalPrice.options.type.name).to.equal('Number');
    });

    it('should default to 0', function() {
      expect(schema.totalPrice.options.default).to.equal(0);
    });
  });

  describe('.quantity', function() {
    it('should exist and be a Number', function() {
      expect(schema.quantity).to.exist;
      expect(schema.quantity.options.type.name).to.equal('Number');
    });

    it('should default to 0', function() {
      expect(schema.quantity.options.default).to.equal(0);
    });
  });

  describe('timestamps:', function() {
    describe('.createdAt', function() {
      it('should exist and be a Date', function() {
        expect(schema.createdAt).to.exist;
        expect(schema.createdAt.options.type.name).to.equal('Date');
      });
    });

    describe('.updatedAt', function() {
      it('should exist and be a Date', function() {
        expect(schema.updatedAt).to.exist;
        expect(schema.updatedAt.options.type.name).to.equal('Date');
      });
    });
  });

});