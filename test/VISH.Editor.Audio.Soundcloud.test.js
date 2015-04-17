var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Audio.Soundcloud", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Audio.Soundcloud object', function(){
        VISH.Editor.Audio.Soundcloud.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export beforeLoadTab function', function(){
        VISH.Editor.Audio.Soundcloud.should.have.property('beforeLoadTab');
    });

    it('should export onLoadTab function', function(){
        VISH.Editor.Audio.Soundcloud.should.have.property('onLoadTab');
    });

});
