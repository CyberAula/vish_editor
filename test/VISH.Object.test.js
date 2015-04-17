var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Object", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Object object', function(){
        VISH.Object.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Object.should.have.property('init');
    });

    it('should export getExtensionFromSrc function', function(){
        VISH.Object.should.have.property('getExtensionFromSrc');
    });

//// METHOD RETURNS

    describe("#getExtensionFromSrc", function(){
       it('should return external object', function(){
           VISH.Object.getExtensionFromSrc("source.doc").should.eql("doc");
       })
    });

});
