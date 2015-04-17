var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.AppletPlayer", function(){
    
//// OBJECT CREATION

    it('should create a VISH.AppletPlayer object', function(){
        VISH.AppletPlayer.should.be.an.instanceof(Object);
    });

});
