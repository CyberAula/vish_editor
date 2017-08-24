var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Image.XWiki", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Image.XWiki object', function(){
        VISH.Editor.Image.XWiki.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export beforeLoadTab function', function(){
        VISH.Editor.Image.XWiki.should.have.property('beforeLoadTab');
    });

    it('should export onLoadTab function', function(){
        VISH.Editor.Image.XWiki.should.have.property('onLoadTab');
    });

});
