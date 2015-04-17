var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Audio", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Audio object', function(){
        VISH.Audio.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Audio.should.have.property('init');
    });

});
