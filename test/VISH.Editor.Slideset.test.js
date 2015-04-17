var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Slideset", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Slideset object', function(){
        VISH.Editor.Slideset.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Slideset.should.have.property('init');
    });

    it('should export getCreatorModule function', function(){
        VISH.Editor.Slideset.should.have.property('getCreatorModule');
    });

    it('should export getDummy function', function(){
        VISH.Editor.Slideset.should.have.property('getDummy');
    });

    it('should export getCurrentSubslide function', function(){
        VISH.Editor.Slideset.should.have.property('getCurrentSubslide');
    });

    it('should export beforeCreateSlidesetThumbnails function', function(){
        VISH.Editor.Slideset.should.have.property('beforeCreateSlidesetThumbnails');
    });

    it('should export onClickOpenSlideset function', function(){
        VISH.Editor.Slideset.should.have.property('onClickOpenSlideset');
    });


});
