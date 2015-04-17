var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Slides", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Slides object', function(){
        VISH.Editor.Slides.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export updateCurrentSlideFromHash function', function(){
        VISH.Editor.Slides.should.have.property('updateCurrentSlideFromHash');
    });

    it('should export forwardOneSubslide function', function(){
        VISH.Editor.Slides.should.have.property('forwardOneSubslide');
    });

    it('should export backwardOneSubslide function', function(){
        VISH.Editor.Slides.should.have.property('backwardOneSubslide');
    });

    it('should export moveSubslides function', function(){
        VISH.Editor.Slides.should.have.property('moveSubslides');
    });

    it('should export goToSubslide function', function(){
        VISH.Editor.Slides.should.have.property('goToSubslide');
    });

    it('should export removeSlideKeyboard function', function(){
        VISH.Editor.Slides.should.have.property('removeSlideKeyboard');
    });

});
