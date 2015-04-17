var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Thumbnails", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Thumbnails object', function(){
        VISH.Editor.Thumbnails.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Thumbnails.should.have.property('init');
    });

});
