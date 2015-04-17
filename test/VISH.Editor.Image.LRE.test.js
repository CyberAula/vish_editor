var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Image.LRE", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Image.LRE object', function(){
        VISH.Editor.Image.LRE.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export beforeLoadTab function', function(){
        VISH.Editor.Image.LRE.should.have.property('beforeLoadTab');
    });

    it('should export onLoadTab function', function(){
        VISH.Editor.Image.LRE.should.have.property('onLoadTab');
    });

});
