var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Addons.IframeMessenger", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Addons.IframeMessenger object', function(){
        VISH.Addons.IframeMessenger.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Addons.IframeMessenger.should.have.property('init');
    });

});
