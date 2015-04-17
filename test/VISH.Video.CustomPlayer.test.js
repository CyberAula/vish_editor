var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Video.CustomPlayer", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Video.CustomPlayer object', function(){
        VISH.Video.CustomPlayer.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Video.CustomPlayer.should.have.property('init');
    });

});
