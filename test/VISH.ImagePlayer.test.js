var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.ImagePlayer", function(){
    
//// OBJECT CREATION

    it('should create a VISH.ImagePlayer object', function(){
        VISH.ImagePlayer.should.be.an.instanceof(Object);
    });

});
