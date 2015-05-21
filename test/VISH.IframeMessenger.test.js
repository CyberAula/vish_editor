var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.IframeMessenger", function(){
    
//// OBJECT CREATION

    it('should create a VISH.IframeMessenger object', function(){
        VISH.IframeMessenger.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.IframeMessenger.should.have.property('init');
    });

});
