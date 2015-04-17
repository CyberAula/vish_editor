var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Editor.VirtualTour", function(){
    
//// OBJECT CREATION

    it('should create a VISH.Editor.VirtualTour object', function(){
        VISH.Editor.VirtualTour.should.be.an.instanceof(Object);
    });

//// EXPORTED METHODS

    it('should export init function', function(){
        VISH.Editor.VirtualTour.should.have.property('init');
    });

    it('should export getDummy function', function(){
        VISH.Editor.VirtualTour.should.have.property('getDummy');
    });

    it('should export draw function', function(){
        VISH.Editor.VirtualTour.should.have.property('draw');
    });

    it('should export onEnterSlideset function', function(){
        VISH.Editor.VirtualTour.should.have.property('onEnterSlideset');
    });

    it('should export onLeaveSlideset function', function(){
        VISH.Editor.VirtualTour.should.have.property('onLeaveSlideset');
    });

    it('should export unloadSlideset function', function(){
        VISH.Editor.VirtualTour.should.have.property('unloadSlideset');
    });

    it('should export beforeCreateSlidesetThumbnails function', function(){
        VISH.Editor.VirtualTour.should.have.property('beforeCreateSlidesetThumbnails');
    });

    it('should export getThumbnailURL function', function(){
        VISH.Editor.VirtualTour.should.have.property('getThumbnailURL');
    });

    it('should export preCopyActions function', function(){
        VISH.Editor.VirtualTour.should.have.property('preCopyActions');
    });

    it('should export postCopyActions function', function(){
        VISH.Editor.VirtualTour.should.have.property('postCopyActions');
    });

//// METHOD RETURNS

    describe("#getDummy", function(){
       it('should return unknown', function(){
           VISH.Editor.VirtualTour.getDummy("slidesetId", "options").should.eql("<article id='slidesetId' type='VirtualTour' slidenumber='undefined'><div class='delete_slide'></div><img class='help_in_slide help_in_vt' src='undefinedvicons/helptutorial_circle_blank.png'/><div class='vt_canvas'></div><div class='vt_search'><input class='vt_search_input' type='text' placeholder='null'></input><button class='vt_search_button'><img class='vt_search_button_img' src='undefinedicons/gsearch.png'/></button></div></article>");
       })
    });

    describe("#getThumbnailURL", function(){
       it('should return unknown', function(){
           VISH.Editor.VirtualTour.getThumbnailURL("vt").should.eql("undefinedtemplatesthumbs/tVTour.png");
       })
    });

});
