var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Image.Flickr", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Image.Flickr object', function(){
        VISH.Editor.Image.Flickr.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export beforeLoadTab function', function(){
        VISH.Editor.Image.Flickr.should.have.property('beforeLoadTab');
    });

    it('should export onLoadTab function', function(){
        VISH.Editor.Image.Flickr.should.have.property('onLoadTab');
    });

});
