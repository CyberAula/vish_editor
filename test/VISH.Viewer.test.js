var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Viewer", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Viewer object', function(){
        VISH.Viewer.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export getOptions function', function(){
        VISH.Viewer.should.have.property('getOptions');
    });

    it('should export getCurrentPresentation function', function(){
        VISH.Viewer.should.have.property('getCurrentPresentation');
    });

    it('should export getPresentationType function', function(){
        VISH.Viewer.should.have.property('getPresentationType');
    });

});
