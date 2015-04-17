var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Animations", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Animations object', function(){
        VISH.Animations.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export loadAnimation function', function(){
        VISH.Animations.should.have.property('loadAnimation');
    });

});
