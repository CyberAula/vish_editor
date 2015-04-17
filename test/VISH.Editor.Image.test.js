var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Image", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Image object', function(){
        VISH.Editor.Image.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export onLoadTab function', function(){
        VISH.Editor.Image.should.have.property('onLoadTab');
    });

    it('should export addContent function', function(){
        VISH.Editor.Image.should.have.property('addContent');
    });

    it('should export getAddContentMode function', function(){
        VISH.Editor.Image.should.have.property('getAddContentMode');
    });

//// METHOD RETURNS

    describe("#getAddContentMode", function(){
       it('should return internal object', function(){
           VISH.Editor.Image.getAddContentMode().should.eql("none");
       })
    });

});
