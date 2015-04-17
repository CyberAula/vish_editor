var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Events.Mobile", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Events.Mobile object', function(){
        VISH.Editor.Events.Mobile.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Events.Mobile.should.have.property('init');
    });

});
