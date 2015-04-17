var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Status.Device.Browser", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Status.Device.Browser object', function(){
        VISH.Status.Device.Browser.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Status.Device.Browser.should.have.property('init');
    });

    it('should export fillBrowser function', function(){
        VISH.Status.Device.Browser.should.have.property('fillBrowser');
    });

});
