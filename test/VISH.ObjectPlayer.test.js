var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.ObjectPlayer", function(){
    
//// OBJECT CREATION

    it('should create a VISH.ObjectPlayer object', function(){
        VISH.ObjectPlayer.should.be.an.instanceof(Object);
    });

});
