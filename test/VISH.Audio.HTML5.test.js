var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Audio.HTML5", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Audio.HTML5 object', function(){
        VISH.Audio.HTML5.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Audio.HTML5.should.have.property('init');
    });

    it('should export renderAudioFromJSON function', function(){
        VISH.Audio.HTML5.should.have.property('renderAudioFromJSON');
    });

    it('should export getSourcesFromJSON function', function(){
        VISH.Audio.HTML5.should.have.property('getSourcesFromJSON');
    });

    it('should export getAudioMimeType function', function(){
        VISH.Audio.HTML5.should.have.property('getAudioMimeType');
    });

//// METHOD RETURNS

    describe("#getSourcesFromJSON", function(){
       it('should return external object', function(){
           VISH.Audio.HTML5.getSourcesFromJSON("audioJSON").should.eql([]);
       })
    });

});
