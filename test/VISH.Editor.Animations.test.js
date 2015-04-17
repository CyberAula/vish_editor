var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Animations", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Animations object', function(){
        VISH.Editor.Animations.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Animations.should.have.property('init');
    });

    it('should export selectAnimation function', function(){
        VISH.Editor.Animations.should.have.property('selectAnimation');
    });

    it('should export getCurrentAnimation function', function(){
        VISH.Editor.Animations.should.have.property('getCurrentAnimation');
    });

    it('should export setCurrentAnimation function', function(){
        VISH.Editor.Animations.should.have.property('setCurrentAnimation');
    });

});
