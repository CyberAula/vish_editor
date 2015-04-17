var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Video.HTML5", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Video.HTML5 object', function(){
        VISH.Video.HTML5.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Video.HTML5.should.have.property('init');
    });

    it('should export renderVideoFromJSON function', function(){
        VISH.Video.HTML5.should.have.property('renderVideoFromJSON');
    });

    it('should export getVideoMimeType function', function(){
        VISH.Video.HTML5.should.have.property('getVideoMimeType');
    });

});
