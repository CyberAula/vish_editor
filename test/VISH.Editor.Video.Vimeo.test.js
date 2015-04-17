var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Video.Vimeo", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Video.Vimeo object', function(){
        VISH.Editor.Video.Vimeo.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Video.Vimeo.should.have.property('init');
    });

    it('should export beforeLoadTab function', function(){
        VISH.Editor.Video.Vimeo.should.have.property('beforeLoadTab');
    });

    it('should export onLoadTab function', function(){
        VISH.Editor.Video.Vimeo.should.have.property('onLoadTab');
    });

});
