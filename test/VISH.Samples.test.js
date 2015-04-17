var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Samples", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Samples object', function(){
        VISH.Samples.should.be.an.instanceof(Object);
    });

});
