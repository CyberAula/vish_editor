var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Status.Device.Features", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Status.Device.Features object', function(){
        VISH.Status.Device.Features.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Status.Device.Features.should.have.property('init');
    });

    it('should export fillFeatures function', function(){
        VISH.Status.Device.Features.should.have.property('fillFeatures');
    });


});
