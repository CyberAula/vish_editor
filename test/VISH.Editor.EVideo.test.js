var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.EVideo", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.EVideo object', function(){
        VISH.Editor.EVideo.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.EVideo.should.have.property('init');
    });

    it('should export onHTML5VideoReady function', function(){
        VISH.Editor.EVideo.should.have.property('onHTML5VideoReady');
    });

    it('should export draw function', function(){
        VISH.Editor.EVideo.should.have.property('draw');
    });

    it('should export onEnterSlideset function', function(){
        VISH.Editor.EVideo.should.have.property('onEnterSlideset');
    });

    it('should export onLeaveSlideset function', function(){
        VISH.Editor.EVideo.should.have.property('onLeaveSlideset');
    });

    it('should export beforeCreateSlidesetThumbnails function', function(){
        VISH.Editor.EVideo.should.have.property('beforeCreateSlidesetThumbnails');
    });

    it('should export getThumbnailURL function', function(){
        VISH.Editor.EVideo.should.have.property('getThumbnailURL');
    });

    it('should export preCopyActions function', function(){
        VISH.Editor.EVideo.should.have.property('preCopyActions');
    });

    it('should export postCopyActions function', function(){
        VISH.Editor.EVideo.should.have.property('postCopyActions');
    });

//// METHOD RETURNS

    describe("#getThumbnailURL", function(){
       it('should return unknown', function(){
           VISH.Editor.EVideo.getThumbnailURL("eVideo").should.eql("undefinedtemplatesthumbs/tEVideo.png");
       })
    });

});
