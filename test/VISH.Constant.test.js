var chai = require("chai");
chai.should();

require("./helpers/listdeps.js");

describe("VISH.Constant", function(){
    
//// CONSTANT DEFINITIONS

    it('should have VISH.Constant.Edit "Editor"', function(){
        VISH.Constant.Edit.should.be.equal('Editor');
    });

    it('should have VISH.Constant.Viewer "Viewer"', function(){
        VISH.Constant.Viewer.should.be.equal('Viewer');
    });

    it('should have VISH.Constant.AnyMode "Both"', function(){
        VISH.Constant.AnyMode.should.be.equal('Both');
    });

    it('should have VISH.Constant.NOSERVER "noserver"', function(){
        VISH.Constant.NOSERVER.should.be.equal('noserver');
    });

    it('should have VISH.Constant.VISH "vish"', function(){
        VISH.Constant.VISH.should.be.equal('vish');
    });

    it('should have VISH.Constant.UA_IE "Microsoft Internet Explorer"', function(){
        VISH.Constant.UA_IE.should.be.equal('Microsoft Internet Explorer');
    });

    it('should have VISH.Constant.UA_NETSCAPE "Netscape"', function(){
        VISH.Constant.UA_NETSCAPE.should.be.equal('Netscape');
    });

    it('should have VISH.Constant.IE "Internet Explorer"', function(){
        VISH.Constant.IE.should.be.equal('Internet Explorer');
    });

    it('should have VISH.Constant.FIREFOX "Mozilla Firefox"', function(){
        VISH.Constant.FIREFOX.should.be.equal('Mozilla Firefox');
    });

    it('should have VISH.Constant.CHROME "Google Chrome"', function(){
        VISH.Constant.CHROME.should.be.equal('Google Chrome');
    });

    it('should have VISH.Constant.SAFARI "Safari"', function(){
        VISH.Constant.SAFARI.should.be.equal('Safari');
    });

    it('should have VISH.Constant.ANDROID_BROWSER "Android Browser"', function(){
        VISH.Constant.ANDROID_BROWSER.should.be.equal('Android Browser');
    });

    it('should have VISH.Constant.EXTRA_SMALL "extra_small"', function(){
        VISH.Constant.EXTRA_SMALL.should.be.equal('extra_small');
    });

    it('should have VISH.Constant.SMALL "small"', function(){
        VISH.Constant.SMALL.should.be.equal('small');
    });

    it('should have VISH.Constant.MEDIUM "medium"', function(){
        VISH.Constant.MEDIUM.should.be.equal('medium');
    });

    it('should have VISH.Constant.LARGE "large"', function(){
        VISH.Constant.LARGE.should.be.equal('large');
    });

    it('should have VISH.Constant.THUMBNAIL "thumbnail"', function(){
        VISH.Constant.THUMBNAIL.should.be.equal('thumbnail');
    });

    it('should have VISH.Constant.NONE "none"', function(){
        VISH.Constant.NONE.should.be.equal('none');
    });

    it('should have VISH.Constant.UNKNOWN "Unknown"', function(){
        VISH.Constant.UNKNOWN.should.be.equal('Unknown');
    });

    it('should have VISH.Constant.PRESENTATION "presentation"', function(){
        VISH.Constant.PRESENTATION.should.be.equal('presentation');
    });

    it('should have VISH.Constant.QUIZ_SIMPLE "quiz_simple"', function(){
        VISH.Constant.QUIZ_SIMPLE.should.be.equal('quiz_simple');
    });

    it('should have VISH.Constant.STANDARD "standard"', function(){
        VISH.Constant.STANDARD.should.be.equal('standard');
    });

    it('should have VISH.Constant.SLIDESET "slideset"', function(){
        VISH.Constant.SLIDESET.should.be.equal('slideset');
    });

    it('should have VISH.Constant.FLASHCARD "flashcard"', function(){
        VISH.Constant.FLASHCARD.should.be.equal('flashcard');
    });

    it('should have VISH.Constant.VTOUR "VirtualTour"', function(){
        VISH.Constant.VTOUR.should.be.equal('VirtualTour');
    });

    it('should have VISH.Constant.EVIDEO "enrichedvideo"', function(){
        VISH.Constant.EVIDEO.should.be.equal('enrichedvideo');
    });

    it('should have VISH.Constant.GAME "game"', function(){
        VISH.Constant.GAME.should.be.equal('game');
    });

    it('should have VISH.Constant.TEXT "text"', function(){
        VISH.Constant.TEXT.should.be.equal('text');
    });

    it('should have VISH.Constant.IMAGE "image"', function(){
        VISH.Constant.IMAGE.should.be.equal('image');
    });

    it('should have VISH.Constant.AUDIO "audio"', function(){
        VISH.Constant.AUDIO.should.be.equal('audio');
    });

    it('should have VISH.Constant.VIDEO "video"', function(){
        VISH.Constant.VIDEO.should.be.equal('video');
    });

    it('should have VISH.Constant.OBJECT "object"', function(){
        VISH.Constant.OBJECT.should.be.equal('object');
    });

    it('should have VISH.Constant.SNAPSHOT "snapshot"', function(){
        VISH.Constant.SNAPSHOT.should.be.equal('snapshot');
    });

    it('should have VISH.Constant.APPLET "applet"', function(){
        VISH.Constant.APPLET.should.be.equal('applet');
    });

    it('should have VISH.Constant.QUIZ "quiz"', function(){
        VISH.Constant.QUIZ.should.be.equal('quiz');
    });

    it('should have VISH.Constant.MEDIA.IMAGE "image"', function(){
        VISH.Constant.MEDIA.IMAGE.should.be.equal('image');
    });

    it('should have VISH.Constant.MEDIA.FLASH "swf"', function(){
        VISH.Constant.MEDIA.FLASH.should.be.equal('swf');
    });

    it('should have VISH.Constant.MEDIA.PDF "pdf"', function(){
        VISH.Constant.MEDIA.PDF.should.be.equal('pdf');
    });

    it('should have VISH.Constant.MEDIA.YOUTUBE_VIDEO "Youtube"', function(){
        VISH.Constant.MEDIA.YOUTUBE_VIDEO.should.be.equal('Youtube');
    });

    it('should have VISH.Constant.MEDIA.HTML5_VIDEO "HTML5_VIDEO"', function(){
        VISH.Constant.MEDIA.HTML5_VIDEO.should.be.equal('HTML5_VIDEO');
    });

    it('should have VISH.Constant.MEDIA.HTML5_AUDIO "HTML5_AUDIO"', function(){
        VISH.Constant.MEDIA.HTML5_AUDIO.should.be.equal('HTML5_AUDIO');
    });

    it('should have VISH.Constant.MEDIA.SOUNDCLOUD_AUDIO "Soundcloud"', function(){
        VISH.Constant.MEDIA.SOUNDCLOUD_AUDIO.should.be.equal('Soundcloud');
    });

    it('should have VISH.Constant.MEDIA.WEB "web"', function(){
        VISH.Constant.MEDIA.WEB.should.be.equal('web');
    });

    it('should have VISH.Constant.MEDIA.JSON "json"', function(){
        VISH.Constant.MEDIA.JSON.should.be.equal('json');
    });

    it('should have VISH.Constant.MEDIA.DOC "doc"', function(){
        VISH.Constant.MEDIA.DOC.should.be.equal('doc');
    });

    it('should have VISH.Constant.MEDIA.PPT "ppt"', function(){
        VISH.Constant.MEDIA.PPT.should.be.equal('ppt');
    });

    it('should have VISH.Constant.MEDIA.SCORM_PACKAGE "scormpackage"', function(){
        VISH.Constant.MEDIA.SCORM_PACKAGE.should.be.equal('scormpackage');
    });

    it('should have VISH.Constant.MEDIA.WEB_APP "webapp"', function(){
        VISH.Constant.MEDIA.WEB_APP.should.be.equal('webapp');
    });

    it('should have VISH.Constant.MEDIA.IMS_QTI_QUIZ "IMS_QTI_QUIZ"', function(){
        VISH.Constant.MEDIA.IMS_QTI_QUIZ.should.be.equal('IMS_QTI_QUIZ');
    });

    it('should have VISH.Constant.WRAPPER.EMBED "EMBED"', function(){
        VISH.Constant.WRAPPER.EMBED.should.be.equal('EMBED');
    });

    it('should have VISH.Constant.WRAPPER.OBJECT "OBJECT"', function(){
        VISH.Constant.WRAPPER.OBJECT.should.be.equal('OBJECT');
    });

    it('should have VISH.Constant.WRAPPER.IFRAME "IFRAME"', function(){
        VISH.Constant.WRAPPER.IFRAME.should.be.equal('IFRAME');
    });

    it('should have VISH.Constant.WRAPPER.VIDEO "VIDEO"', function(){
        VISH.Constant.WRAPPER.VIDEO.should.be.equal('VIDEO');
    });

    it('should have VISH.Constant.WRAPPER.AUDIO "AUDIO"', function(){
        VISH.Constant.WRAPPER.AUDIO.should.be.equal('AUDIO');
    });

    it('should have VISH.Constant.QZ_TYPE.OPEN "openAnswer"', function(){
        VISH.Constant.QZ_TYPE.OPEN.should.be.equal('openAnswer');
    });

    it('should have VISH.Constant.QZ_TYPE.MCHOICE "multiplechoice"', function(){
        VISH.Constant.QZ_TYPE.MCHOICE.should.be.equal('multiplechoice');
    });

    it('should have VISH.Constant.QZ_TYPE.TF "truefalse"', function(){
        VISH.Constant.QZ_TYPE.TF.should.be.equal('truefalse');
    });

    it('should have VISH.Constant.QZ_TYPE.SORTING "sorting"', function(){
        VISH.Constant.QZ_TYPE.SORTING.should.be.equal('sorting');
    });

    it('should have VISH.Constant.QZ_MODE.SELFA "selfA"', function(){
        VISH.Constant.QZ_MODE.SELFA.should.be.equal('selfA');
    });

    it('should have VISH.Constant.QZ_MODE.RT "realTime"', function(){
        VISH.Constant.QZ_MODE.RT.should.be.equal('realTime');
    });

    it('should have VISH.Constant.Clipboard.Slide "slide"', function(){
        VISH.Constant.Clipboard.Slide.should.be.equal('slide');
    });

    it('should have VISH.Constant.Clipboard.LocalStorageStack "VishEditorClipboardStack"', function(){
        VISH.Constant.Clipboard.LocalStorageStack.should.be.equal('VishEditorClipboardStack');
    });

    it('should have VISH.Constant.Themes.Default "theme1"', function(){
        VISH.Constant.Themes.Default.should.be.equal('theme1');
    });

    it('should have VISH.Constant.Animations.Default "animation1"', function(){
        VISH.Constant.Animations.Default.should.be.equal('animation1');
    });

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

    it('should have VISH.Constant.Event.onShowRecommendations "onShowRecommendations"', function(){
        VISH.Constant.Event.onShowRecommendations.should.be.equal('onShowRecommendations');
    });

    it('should have VISH.Constant.Event.onHideRecommendations "onHideRecommendations"', function(){
        VISH.Constant.Event.onHideRecommendations.should.be.equal('onHideRecommendations');
    });

    it('should have VISH.Constant.Event.onAcceptRecommendation "onAcceptRecommendation"', function(){
        VISH.Constant.Event.onAcceptRecommendation.should.be.equal('onAcceptRecommendation');
    });

    it('should have VISH.Constant.Event.onEvaluate "onEvaluate"', function(){
        VISH.Constant.Event.onEvaluate.should.be.equal('onEvaluate');
    });

    it('should have VISH.Constant.Event.onEvaluateCompletion "onEvaluateCompletion"', function(){
        VISH.Constant.Event.onEvaluateCompletion.should.be.equal('onEvaluateCompletion');
    });

    it('should have VISH.Constant.Event.onViewportResize "onViewportResize"', function(){
        VISH.Constant.Event.onViewportResize.should.be.equal('onViewportResize');
    });

    it('should have VISH.Constant.Event.onProgressObjectiveUpdated "onProgressObjectiveUpdated"', function(){
        VISH.Constant.Event.onProgressObjectiveUpdated.should.be.equal('onProgressObjectiveUpdated');
    });

    it('should have VISH.Constant.Event.Touchable.onSimpleClick "onSimpleClick"', function(){
        VISH.Constant.Event.Touchable.onSimpleClick.should.be.equal('onSimpleClick');
    });

    it('should have VISH.Constant.Event.Touchable.onLongClick "onLongClick"', function(){
        VISH.Constant.Event.Touchable.onLongClick.should.be.equal('onLongClick');
    });

    it('should have VISH.Constant.Event.Touchable.onUnknownTouchMovement "onUnknownTouchMovement"', function(){
        VISH.Constant.Event.Touchable.onUnknownTouchMovement.should.be.equal('onUnknownTouchMovement');
    });

    it('should have VISH.Constant.Event.Touchable.onShiftRight "onShiftRight"', function(){
        VISH.Constant.Event.Touchable.onShiftRight.should.be.equal('onShiftRight');
    });

    it('should have VISH.Constant.Event.Touchable.onShiftLeft "onShiftLeft"', function(){
        VISH.Constant.Event.Touchable.onShiftLeft.should.be.equal('onShiftLeft');
    });

    it('should have VISH.Constant.Storage.Device "Device"', function(){
        VISH.Constant.Storage.Device.should.be.equal('Device');
    });

    it('should have VISH.Constant.VTour.DEFAULT_MAP "roadmap"', function(){
        VISH.Constant.VTour.DEFAULT_MAP.should.be.equal('roadmap');
    });

    it('should have VISH.Constant.VTour.ROADMAP "roadmap"', function(){
        VISH.Constant.VTour.ROADMAP.should.be.equal('roadmap');
    });

    it('should have VISH.Constant.VTour.SERVICES.GMaps "Google Maps"', function(){
        VISH.Constant.VTour.SERVICES.GMaps.should.be.equal('Google Maps');
    });

});
