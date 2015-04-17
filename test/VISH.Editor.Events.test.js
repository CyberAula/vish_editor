var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Events", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Events object', function(){
        VISH.Editor.Events.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Events.should.have.property('init');
    });

    it('should export allowExitWithoutConfirmation function', function(){
        VISH.Editor.Events.should.have.property('allowExitWithoutConfirmation');
    });

});
