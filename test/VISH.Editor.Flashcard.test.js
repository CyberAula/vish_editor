var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.Flashcard", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.Flashcard object', function(){
        VISH.Editor.Flashcard.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.Flashcard.should.have.property('init');
    });

    it('should export getDummy function', function(){
        VISH.Editor.Flashcard.should.have.property('getDummy');
    });

    it('should export onEnterSlideset function', function(){
        VISH.Editor.Flashcard.should.have.property('onEnterSlideset');
    });

    it('should export onLeaveSlideset function', function(){
        VISH.Editor.Flashcard.should.have.property('onLeaveSlideset');
    });

    it('should export beforeCreateSlidesetThumbnails function', function(){
        VISH.Editor.Flashcard.should.have.property('beforeCreateSlidesetThumbnails');
    });

    it('should export getDefaultThumbnailURL function', function(){
        VISH.Editor.Flashcard.should.have.property('getDefaultThumbnailURL');
    });

    it('should export preCopyActions function', function(){
        VISH.Editor.Flashcard.should.have.property('preCopyActions');
    });

    it('should export postCopyActions function', function(){
        VISH.Editor.Flashcard.should.have.property('postCopyActions');
    });

//// METHOD RETURNS

    describe("#getDummy", function(){
       it('should return unknown', function(){
           VISH.Editor.Flashcard.getDummy("slidesetId", "options").should.eql("<article id='slidesetId' type='flashcard' slidenumber='undefined'><div class='delete_slide'></div><img class='help_in_slide help_in_flashcard' src='undefinedvicons/helptutorial_circle_blank.png'/><div class='change_bg_button'></div></article>");
       })
    });

    describe("#getDefaultThumbnailURL", function(){
       it('should return unknown', function(){
           VISH.Editor.Flashcard.getDefaultThumbnailURL().should.eql("undefinedtemplatesthumbs/flashcard_template.png");
       })
    });

});
