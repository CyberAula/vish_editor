var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.EVideo", function(){
    
//// OBJECT CREATION

    it('should create a VISH.EVideo object', function(){
        VISH.EVideo.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.EVideo.should.have.property('init');
    });

    it('should export onHTML5VideoReady function', function(){
        VISH.EVideo.should.have.property('onHTML5VideoReady');
    });

    it('should export onTimeUpdate function', function(){
        VISH.EVideo.should.have.property('onTimeUpdate');
    });

    it('should export onStatusChange function', function(){
        VISH.EVideo.should.have.property('onStatusChange');
    });

    it('should export getBallOfEVideo function', function(){
        VISH.EVideo.should.have.property('getBallOfEVideo');
    });

    it('should export haveSources function', function(){
        VISH.EVideo.should.have.property('haveSources');
    });

});
