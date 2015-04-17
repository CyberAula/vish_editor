var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Video", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Video object', function(){
        VISH.Editor.Video.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export addContent function', function(){
        VISH.Editor.Video.should.have.property('addContent');
    });

    it('should export getAddContentMode function', function(){
        VISH.Editor.Video.should.have.property('getAddContentMode');
    });

//// METHOD RETURNS

    describe("#getAddContentMode", function(){
       it('should return internal object', function(){
           VISH.Editor.Video.getAddContentMode().should.eql("none");
       })
    });

});
