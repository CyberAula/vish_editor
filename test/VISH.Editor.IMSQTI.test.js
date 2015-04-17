var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.IMSQTI", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.IMSQTI object', function(){
        VISH.Editor.IMSQTI.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.IMSQTI.should.have.property('init');
    });

});
