var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.IframeAPI", function(){
    
//// CONSTANT DEFINITIONS

    it('should have VISH.Constant.Event.onMessage "onMessage"', function(){
        VISH.Constant.Event.onMessage.should.be.equal('onMessage');
    });

    it('should have VISH.Constant.Event.onGoToSlide "onGoToSlide"', function(){
        VISH.Constant.Event.onGoToSlide.should.be.equal('onGoToSlide');
    });

    it('should have VISH.Constant.Event.onEnterSlide "onEnterSlide"', function(){
        VISH.Constant.Event.onEnterSlide.should.be.equal('onEnterSlide');
    });

    it('should have VISH.Constant.Event.onPlayVideo "onPlayVideo"', function(){
        VISH.Constant.Event.onPlayVideo.should.be.equal('onPlayVideo');
    });

    it('should have VISH.Constant.Event.onPauseVideo "onPauseVideo"', function(){
        VISH.Constant.Event.onPauseVideo.should.be.equal('onPauseVideo');
    });

    it('should have VISH.Constant.Event.onSeekVideo "onSeekVideo"', function(){
        VISH.Constant.Event.onSeekVideo.should.be.equal('onSeekVideo');
    });

    it('should have VISH.Constant.Event.onPlayAudio "onPlayAudio"', function(){
        VISH.Constant.Event.onPlayAudio.should.be.equal('onPlayAudio');
    });

    it('should have VISH.Constant.Event.onPauseAudio "onPauseAudio"', function(){
        VISH.Constant.Event.onPauseAudio.should.be.equal('onPauseAudio');
    });

    it('should have VISH.Constant.Event.onSeekAudio "onSeekAudio"', function(){
        VISH.Constant.Event.onSeekAudio.should.be.equal('onSeekAudio');
    });

    it('should have VISH.Constant.Event.onSubslideOpen "onSubslideOpen"', function(){
        VISH.Constant.Event.onSubslideOpen.should.be.equal('onSubslideOpen');
    });

    it('should have VISH.Constant.Event.onSubslideClosed "onSubslideClosed"', function(){
        VISH.Constant.Event.onSubslideClosed.should.be.equal('onSubslideClosed');
    });

    it('should have VISH.Constant.Event.onAnswerQuiz "onAnswerQuiz"', function(){
        VISH.Constant.Event.onAnswerQuiz.should.be.equal('onAnswerQuiz');
    });

    it('should have VISH.Constant.Event.onSetSlave "onSetSlave"', function(){
        VISH.Constant.Event.onSetSlave.should.be.equal('onSetSlave');
    });

    it('should have VISH.Constant.Event.onPreventDefault "onPreventDefault"', function(){
        VISH.Constant.Event.onPreventDefault.should.be.equal('onPreventDefault');
    });

    it('should have VISH.Constant.Event.allowExitWithoutConfirmation "allowExitWithoutConfirmation"', function(){
        VISH.Constant.Event.allowExitWithoutConfirmation.should.be.equal('allowExitWithoutConfirmation');
    });

    it('should have VISH.Constant.Event.exit "exit"', function(){
        VISH.Constant.Event.exit.should.be.equal('exit');
    });

    it('should have VISH.Constant.Event.onSelectedSlides "onSelectedSlides"', function(){
        VISH.Constant.Event.onSelectedSlides.should.be.equal('onSelectedSlides');
    });

    it('should have VISH.Constant.Event.onVEFocusChange "onVEFocusChange"', function(){
        VISH.Constant.Event.onVEFocusChange.should.be.equal('onVEFocusChange');
    });

    it('should have VISH.Constant.Event.onIframeMessengerHello "onIframeMessengerHello"', function(){
        VISH.Constant.Event.onIframeMessengerHello.should.be.equal('onIframeMessengerHello');
    });

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
