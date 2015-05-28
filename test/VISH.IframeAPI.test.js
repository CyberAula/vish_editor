var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.IframeAPI", function(){
    
    //// OBJECT CREATION

    it('should create a VISH object', function(){
        VISH.should.be.an.instanceof(Object);
    });

    it('should create a VISH.IframeAPI object', function(){
        VISH.IframeAPI.should.be.an.instanceof(Object);
    });

    //// EXPORTED METHODS

    it('should export init function', function(){
        VISH.IframeAPI.should.have.property('init');
    });

    it('should export registerCallback function', function(){
        VISH.IframeAPI.should.have.property('registerCallback');
    });

    it('should export unRegisterCallback function', function(){
        VISH.IframeAPI.should.have.property('unRegisterCallback');
    });

    it('should export sendMessage function', function(){
        VISH.IframeAPI.should.have.property('sendMessage');
    });

    it('should export goToSlide function', function(){
        VISH.IframeAPI.should.have.property('goToSlide');
    });

    it('should export playVideo function', function(){
        VISH.IframeAPI.should.have.property('playVideo');
    });

    it('should export pauseVideo function', function(){
        VISH.IframeAPI.should.have.property('pauseVideo');
    });

    it('should export seekVideo function', function(){
        VISH.IframeAPI.should.have.property('seekVideo');
    });

    it('should export openSubslide function', function(){
        VISH.IframeAPI.should.have.property('openSubslide');
    });

    it('should export closeSubslide function', function(){
        VISH.IframeAPI.should.have.property('closeSubslide');
    });

    it('should export setSlave function', function(){
        VISH.IframeAPI.should.have.property('setSlave');
    });

    it('should export setMaster function', function(){
        VISH.IframeAPI.should.have.property('setMaster');
    });

    it('should export allowExitWithoutConfirmation function', function(){
        VISH.IframeAPI.should.have.property('allowExitWithoutConfirmation');
    });

});
