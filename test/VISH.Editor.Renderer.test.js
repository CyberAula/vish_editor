var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Renderer", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Renderer object', function(){
        VISH.Editor.Renderer.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Renderer.should.have.property('init');
    });

    it('should export renderPresentation function', function(){
        VISH.Editor.Renderer.should.have.property('renderPresentation');
    });

    it('should export isRendering function', function(){
        VISH.Editor.Renderer.should.have.property('isRendering');
    });

});
