var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Dummies", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Dummies object', function(){
        VISH.Editor.Dummies.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Dummies.should.have.property('init');
    });

    it('should export getDummy function', function(){
        VISH.Editor.Dummies.should.have.property('getDummy');
    });

    it('should export getScaffoldForSlide function', function(){
        VISH.Editor.Dummies.should.have.property('getScaffoldForSlide');
    });

});
