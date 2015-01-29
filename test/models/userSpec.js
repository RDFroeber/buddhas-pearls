'use strict';

var expect = require('chai').expect,
    User = require('../../models').User;

describe('User', function() {
  var schema = User.schema.paths;

  it('should exist', function() {
    expect(User).to.exist;
  });

  describe('.firstName', function() {
    it('should exist and be a String', function() {
      expect(schema.firstName).to.exist;
      expect(schema.firstName.instance).to.equal('String');
    });
  });

  describe('.lastName', function() {
    it('should exist and be a String', function() {
      expect(schema.lastName).to.exist;
      expect(schema.lastName.instance).to.equal('String');
    });
  });

  describe('local:', function() {
    describe('.email', function() {
      it('should exist and be a String', function() {
        expect(schema['local.email']).to.exist;
        expect(schema['local.email'].instance).to.equal('String');
      });

      it('should be an index', function() {
        expect(schema['local.email']._index).to.not.equal(null);
      });

      it('should be lowercase', function() {
        expect(schema['local.email'].options.lowercase).to.equal(true);
      });
    });

    describe('.password', function() {
      it('should exist and be a String', function() {
        expect(schema['local.password']).to.exist;
        expect(schema['local.password'].instance).to.equal('String');
      });
    });
  });

  describe('google:', function() {
    describe('.id', function() {
      it('should exist and be a String', function() {
        expect(schema['google.id']).to.exist;
        expect(schema['google.id'].instance).to.equal('String');
      });
    });

    describe('.token', function() {
      it('should exist and be a String', function() {
        expect(schema['google.token']).to.exist;
        expect(schema['google.token'].instance).to.equal('String');
      });
    });

    describe('.email', function() {
      it('should exist and be a String', function() {
        expect(schema['google.email']).to.exist;
        expect(schema['google.email'].instance).to.equal('String');
      });
    });

    describe('.name', function() {
      it('should exist and be a String', function() {
        expect(schema['google.name']).to.exist;
        expect(schema['google.name'].instance).to.equal('String');
      });
    });
  });

  describe('facebook:', function() {
    describe('.id', function() {
      it('should exist and be a String', function() {
        expect(schema['facebook.id']).to.exist;
        expect(schema['facebook.id'].instance).to.equal('String');
      });
    });

    describe('.token', function() {
      it('should exist and be a String', function() {
        expect(schema['facebook.token']).to.exist;
        expect(schema['facebook.token'].instance).to.equal('String');
      });
    });

    describe('.email', function() {
      it('should exist and be a String', function() {
        expect(schema['facebook.email']).to.exist;
        expect(schema['facebook.email'].instance).to.equal('String');
      });
    });

    describe('.name', function() {
      it('should exist and be a String', function() {
        expect(schema['facebook.name']).to.exist;
        expect(schema['facebook.name'].instance).to.equal('String');
      });
    });
  });

  describe('twitter:', function() {
    describe('.id', function() {
      it('should exist and be a String', function() {
        expect(schema['twitter.id']).to.exist;
        expect(schema['twitter.id'].instance).to.equal('String');
      });
    });

    describe('.token', function() {
      it('should exist and be a String', function() {
        expect(schema['twitter.token']).to.exist;
        expect(schema['twitter.token'].instance).to.equal('String');
      });
    });

    describe('.email', function() {
      it('should exist and be a String', function() {
        expect(schema['twitter.email']).to.exist;
        expect(schema['twitter.email'].instance).to.equal('String');
      });
    });

    describe('.name', function() {
      it('should exist and be a String', function() {
        expect(schema['twitter.name']).to.exist;
        expect(schema['twitter.name'].instance).to.equal('String');
      });
    });
  });

  describe('.isAdmin', function() {
    it('should exist and be a Boolean', function() {
      expect(schema.isAdmin).to.exist;
      expect(schema.isAdmin.options.type.name).to.equal('Boolean');
    });

    it('should default to false', function() {
      expect(schema.isAdmin.options.default).to.equal(false);
    });
  });

  describe('addresses:', function() {
    it('should exist and be an Array', function() {
      expect(schema.addresses).to.exist;
      expect(schema.addresses.options.type).to.be.a('Array');
    });

    // describe('.street', function() {
    //   it('should exist and be a String', function() {
    //     expect(schema['addresses.street']).to.exist;
    //     expect(schema['addresses.street'].instance).to.equal('String');
    //   });
    // });

    // describe('.city', function() {
    //   it('should exist and be a String', function() {
    //     expect(schema['addresses.city']).to.exist;
    //     expect(schema['addresses.city'].instance).to.equal('String');
    //   });
    // });

    // describe('.state', function() {
    //   it('should exist and be a String', function() {
    //     expect(schema['addresses.state']).to.exist;
    //     expect(schema['addresses.state'].instance).to.equal('String');
    //   });
    // });

    // describe('.zipcode', function() {
    //   it('should exist and be a String', function() {
    //     expect(schema['addresses.zipcode']).to.exist;
    //     expect(schema['addresses.zipcode'].instance).to.equal('String');
    //   });
    // });

    // describe('.primary', function() {
    //   it('should exist and be a Boolean', function() {
    //     expect(schema['addresses.primary']).to.exist;
    //     expect(schema['addresses.primary'].options.type.name).to.equal('Boolean');
    //   });
    // });
  });

  describe('numbers:', function() {
    describe('.home', function() {
      it('should exist and be a Number', function() {
        expect(schema['numbers.home']).to.exist;
        expect(schema['numbers.home'].instance).to.equal('Number');
      });
    });

    describe('.cell', function() {
      it('should exist and be a Number', function() {
        expect(schema['numbers.cell']).to.exist;
        expect(schema['numbers.cell'].instance).to.equal('Number');
      });
    });

    describe('.work', function() {
      it('should exist and be a Number', function() {
        expect(schema['numbers.work']).to.exist;
        expect(schema['numbers.work'].instance).to.equal('Number');
      });
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