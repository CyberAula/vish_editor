var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Video.Youtube", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Video.Youtube object', function(){
        VISH.Editor.Video.Youtube.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export beforeLoadTab function', function(){
        VISH.Editor.Video.Youtube.should.have.property('beforeLoadTab');
    });

    it('should export onLoadTab function', function(){
        VISH.Editor.Video.Youtube.should.have.property('onLoadTab');
    });

    it('should export addSelectedVideo function', function(){
        VISH.Editor.Video.Youtube.should.have.property('addSelectedVideo');
    });

    it('should export generateWrapperForYoutubeVideoUrl function', function(){
        VISH.Editor.Video.Youtube.should.have.property('generateWrapperForYoutubeVideoUrl');
    });

    it('should export generatePreviewWrapperForYoutubeVideoUrl function', function(){
        VISH.Editor.Video.Youtube.should.have.property('generatePreviewWrapperForYoutubeVideoUrl');
    });

});
