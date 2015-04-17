var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.API", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.API object', function(){
        VISH.Editor.API.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.API.should.have.property('init');
    });

    it('should export requestImages function', function(){
        VISH.Editor.API.should.have.property('requestImages');
    });

    it('should export requestVideos function', function(){
        VISH.Editor.API.should.have.property('requestVideos');
    });

    it('should export requestObjects function', function(){
        VISH.Editor.API.should.have.property('requestObjects');
    });

    it('should export requestPresentations function', function(){
        VISH.Editor.API.should.have.property('requestPresentations');
    });

});
