var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Status.Device", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Status.Device object', function(){
        VISH.Status.Device.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Status.Device.should.have.property('init');
    });

    it('should export fillScreen function', function(){
        VISH.Status.Device.should.have.property('fillScreen');
    });

});
