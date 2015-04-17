var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Image.Flikr", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Image.Flikr object', function(){
        VISH.Editor.Image.Flikr.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export beforeLoadTab function', function(){
        VISH.Editor.Image.Flikr.should.have.property('beforeLoadTab');
    });

    it('should export onLoadTab function', function(){
        VISH.Editor.Image.Flikr.should.have.property('onLoadTab');
    });

});
