var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Events", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Events object', function(){
        VISH.Events.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Events.should.have.property('init');
    });

});
