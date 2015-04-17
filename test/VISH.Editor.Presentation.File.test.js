var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Presentation.File", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Presentation.File object', function(){
        VISH.Editor.Presentation.File.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export exportTo function', function(){
        VISH.Editor.Presentation.File.should.have.property('exportTo');
    });

});
