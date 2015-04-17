var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Events.Touchable", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Events.Touchable object', function(){
        VISH.Events.Touchable.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Events.Touchable.should.have.property('init');
    });

});
