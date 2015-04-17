var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Audio", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Audio object', function(){
        VISH.Editor.Audio.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Audio.should.have.property('init');
    });

});
