var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Video.Youtube", function(){
    
//// OBJECT CREATION

    it('should create a YT object', function(){
        YT.should.be.an.instanceof(Object);
    });

    it('should create a VISH.Video.Youtube object', function(){
        VISH.Video.Youtube.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Video.Youtube.should.have.property('init');
    });

    it('should export renderVideoFromJSON function', function(){
        VISH.Video.Youtube.should.have.property('renderVideoFromJSON');
    });

    it('should export renderVideoFromSource function', function(){
        VISH.Video.Youtube.should.have.property('renderVideoFromSource');
    });

    it('should export onPlayerReady function', function(){
        VISH.Video.Youtube.should.have.property('onPlayerReady');
    });

    it('should export onPlayerStateChange function', function(){
        VISH.Video.Youtube.should.have.property('onPlayerStateChange');
    });

    it('should export playVideo function', function(){
        VISH.Video.Youtube.should.have.property('playVideo');
    });

    it('should export pauseVideo function', function(){
        VISH.Video.Youtube.should.have.property('pauseVideo');
    });

    it('should export seekVideo function', function(){
        VISH.Video.Youtube.should.have.property('seekVideo');
    });

    it('should export getYouTubePlayer function', function(){
        VISH.Video.Youtube.should.have.property('getYouTubePlayer');
    });

    it('should export getYoutubeIdFromURL function', function(){
        VISH.Video.Youtube.should.have.property('getYoutubeIdFromURL');
    });

    it('should export getEmbedSource function', function(){
        VISH.Video.Youtube.should.have.property('getEmbedSource');
    });

});
