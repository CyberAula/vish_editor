var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Events.Mobile", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Events.Mobile object', function(){
        VISH.Events.Mobile.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Events.Mobile.should.have.property('init');
    });

});
