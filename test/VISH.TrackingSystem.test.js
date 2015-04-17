var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.TrackingSystem", function(){
    
//// OBJECT CREATION

    it('should create a VISH.TrackingSystem object', function(){
        VISH.TrackingSystem.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export registerAction function', function(){
        VISH.TrackingSystem.should.have.property('registerAction');
    });

    it('should export getAbsoluteTime function', function(){
        VISH.TrackingSystem.should.have.property('getAbsoluteTime');
    });

    it('should export getRelativeTime function', function(){
        VISH.TrackingSystem.should.have.property('getRelativeTime');
    });

    it('should export getChronology function', function(){
        VISH.TrackingSystem.should.have.property('getChronology');
    });

//// METHOD RETURNS

    describe("#getAbsoluteTime", function(){
       it('should return external object', function(){
           VISH.TrackingSystem.getAbsoluteTime().should.eql(NaN);
       })
    });

    describe("#getRelativeTime", function(){
       it('should return external object', function(){
           VISH.TrackingSystem.getRelativeTime().should.eql(NaN);
       })
    });

});
