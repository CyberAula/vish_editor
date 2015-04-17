var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Renderer", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Renderer object', function(){
        VISH.Renderer.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Renderer.should.have.property('init');
    });

});
