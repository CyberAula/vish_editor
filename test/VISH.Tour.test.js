var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Tour", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Tour object', function(){
        VISH.Tour.should.be.an.instanceof(Object);
    });

});
