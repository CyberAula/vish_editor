var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Video", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Video object', function(){
        VISH.Video.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Video.should.have.property('init');
    });

    it('should export playVideo function', function(){
        VISH.Video.should.have.property('playVideo');
    });

    it('should export pauseVideo function', function(){
        VISH.Video.should.have.property('pauseVideo');
    });

    it('should export seekVideo function', function(){
        VISH.Video.should.have.property('seekVideo');
    });

    it('should export getTypeVideoWithId function', function(){
        VISH.Video.should.have.property('getTypeVideoWithId');
    });

});
