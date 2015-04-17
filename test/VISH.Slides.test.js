var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Slides", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Slides object', function(){
        VISH.Slides.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Slides.should.have.property('init');
    });

    it('should export getSlides function', function(){
        VISH.Slides.should.have.property('getSlides');
    });

    it('should export getCurrentSlide function', function(){
        VISH.Slides.should.have.property('getCurrentSlide');
    });

    it('should export getTargetSlide function', function(){
        VISH.Slides.should.have.property('getTargetSlide');
    });

    it('should export getCurrentSlideNumber function', function(){
        VISH.Slides.should.have.property('getCurrentSlideNumber');
    });

    it('should export getTargetSlideNumber function', function(){
        VISH.Slides.should.have.property('getTargetSlideNumber');
    });

    it('should export setCurrentSlideNumber function', function(){
        VISH.Slides.should.have.property('setCurrentSlideNumber');
    });

    it('should export getSlideWithNumber function', function(){
        VISH.Slides.should.have.property('getSlideWithNumber');
    });

    it('should export isCurrentFirstSlide function', function(){
        VISH.Slides.should.have.property('isCurrentFirstSlide');
    });

    it('should export isCurrentLastSlide function', function(){
        VISH.Slides.should.have.property('isCurrentLastSlide');
    });

    it('should export updateCurrentSlideFromHash function', function(){
        VISH.Slides.should.have.property('updateCurrentSlideFromHash');
    });

    it('should export triggerEnterEvent function', function(){
        VISH.Slides.should.have.property('triggerEnterEvent');
    });

    it('should export triggerLeaveEvent function', function(){
        VISH.Slides.should.have.property('triggerLeaveEvent');
    });

    it('should export forwardOneSlide function', function(){
        VISH.Slides.should.have.property('forwardOneSlide');
    });

    it('should export backwardOneSlide function', function(){
        VISH.Slides.should.have.property('backwardOneSlide');
    });

    it('should export moveSlides function', function(){
        VISH.Slides.should.have.property('moveSlides');
    });

    it('should export lastSlide function', function(){
        VISH.Slides.should.have.property('lastSlide');
    });

//// METHOD RETURNS
    describe("#isCurrentFirstSlide", function(){
       it('should return unknown', function(){
           VISH.Slides.isCurrentFirstSlide().should.eql(false);
       })
    });

});
