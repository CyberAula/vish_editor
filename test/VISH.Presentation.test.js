var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Presentation", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Presentation object', function(){
        VISH.Presentation.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Presentation.should.have.property('init');
    });

});
