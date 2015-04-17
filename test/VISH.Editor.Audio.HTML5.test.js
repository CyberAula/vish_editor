var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Audio.HTML5", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Audio.HTML5 object', function(){
        VISH.Editor.Audio.HTML5.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Audio.HTML5.should.have.property('init');
    });

    it('should export drawAudioWithWrapper function', function(){
        VISH.Editor.Audio.HTML5.should.have.property('drawAudioWithWrapper');
    });

    it('should export drawAudioWithUrl function', function(){
        VISH.Editor.Audio.HTML5.should.have.property('drawAudioWithUrl');
    });

    it('should export renderAudioFromWrapper function', function(){
        VISH.Editor.Audio.HTML5.should.have.property('renderAudioFromWrapper');
    });

    it('should export renderAudioWithURL function', function(){
        VISH.Editor.Audio.HTML5.should.have.property('renderAudioWithURL');
    });

});
