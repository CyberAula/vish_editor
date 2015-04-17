var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Image.Thumbnails", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Image.Thumbnails object', function(){
        VISH.Editor.Image.Thumbnails.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Image.Thumbnails.should.have.property('init');
    });

    it('should export beforeLoadTab function', function(){
        VISH.Editor.Image.Thumbnails.should.have.property('beforeLoadTab');
    });

    it('should export onLoadTab function', function(){
        VISH.Editor.Image.Thumbnails.should.have.property('onLoadTab');
    });

});
