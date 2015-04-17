var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Preview", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Preview object', function(){
        VISH.Editor.Preview.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Preview.should.have.property('init');
    });

    it('should export getPreview function', function(){
        VISH.Editor.Preview.should.have.property('getPreview');
    });

});
