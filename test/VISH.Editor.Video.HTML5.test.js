var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Video.HTML5", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Video.HTML5 object', function(){
        VISH.Editor.Video.HTML5.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Video.HTML5.should.have.property('init');
    });

    it('should export drawVideoWithWrapper function', function(){
        VISH.Editor.Video.HTML5.should.have.property('drawVideoWithWrapper');
    });

    it('should export drawVideoWithUrl function', function(){
        VISH.Editor.Video.HTML5.should.have.property('drawVideoWithUrl');
    });

    it('should export renderVideoFromWrapper function', function(){
        VISH.Editor.Video.HTML5.should.have.property('renderVideoFromWrapper');
    });

    it('should export renderVideoWithURL function', function(){
        VISH.Editor.Video.HTML5.should.have.property('renderVideoWithURL');
    });

    it('should export getDefaultPoster function', function(){
        VISH.Editor.Video.HTML5.should.have.property('getDefaultPoster');
    });

//// METHOD RETURNS

    describe("#getDefaultPoster", function(){
       it('should return unknown', function(){
           VISH.Editor.Video.HTML5.getDefaultPoster().should.eql("undefinedicons/example_poster_image.jpg");
       })
    });

});
