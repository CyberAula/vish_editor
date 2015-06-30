VISH.Messenger.VE = (function(V,undefined){

	var createVEMessage = function(VEevent,params,destination,destinationId){
		var data = {};
		data.VEevent = VEevent;
		data.params = params;
		return V.IframeMessenger.createMessage("VE",data,destination,destinationId);
	};


	var validateVEMessage = function(VEMessage){
		if(!V.IframeMessenger.validateIframeMessage(VEMessage)){
			return false;
		}
		if(typeof VEMessage.data != "object"){
			return false;
		}
		if(typeof VEMessage.data.VEevent != "string"){
			return false;
		}
		return true;
	};


	/////////////////////
	// VE Message Processor
	/////////////////////

	var processVEMessage = function(VEMessage){
		data = VEMessage.data;

		switch(data.VEevent){
			case V.Constant.Event.onGoToSlide:
				if((data.params)&&(data.params.slideNumber)){
					V.Slides.goToSlide(data.params.slideNumber,false);
				}
				break;
			case V.Constant.Event.onPlayVideo:
				if((data.params)&&(data.params.videoId)){
					if((data.params.slideNumber)&&(V.Slides.getCurrentSlideNumber()!=data.params.slideNumber)){
						V.Slides.goToSlide(data.params.slideNumber,false);
					}
					V.Video.playVideo(data.params.videoId,data.params.currentTime,false);
				}
				break;
			case V.Constant.Event.onPauseVideo:
				if((data.params)&&(data.params.videoId)){
					if((data.params.slideNumber)&&(V.Slides.getCurrentSlideNumber()!=data.params.slideNumber)){
						V.Slides.goToSlide(data.params.slideNumber,false);
					}
					V.Video.pauseVideo(data.params.videoId,data.params.currentTime,false);
				}
				break;
			case V.Constant.Event.onSeekVideo:
				if((data.params)&&(data.params.videoId)){
						if((data.params.slideNumber)&&(V.Slides.getCurrentSlideNumber()!=data.params.slideNumber)){
							V.Slides.goToSlide(data.params.slideNumber,false);
						}
						V.Video.seekVideo(data.params.videoId,data.params.currentTime,false);
				}
				break;
			case V.Constant.Event.onSubslideOpen:
				if((data.params)&&(data.params.slideId)){
						V.Slides.openSubslide(data.params.slideId,false);
				}
				break;
			case V.Constant.Event.onSubslideClosed:
				if((data.params)&&(data.params.slideId)){
						V.Slides.closeSubslide(data.params.slideId,false);
				}
				break;
			case V.Constant.Event.onSetSlave:
				if((data.params)&&(typeof data.params.slave != "undefined")){
					V.Status.setSlaveMode(data.params.slave);
				}
				break;
			case V.Constant.Event.onPreventDefault:
				if((data.params)&&(typeof data.params.preventDefaults != "undefined")){
					V.Status.setPreventDefaultMode(data.params.preventDefaults);
				}
				break;
			case V.Constant.Event.allowExitWithoutConfirmation:
				if(V.Editing){
					V.Editor.Events.allowExitWithoutConfirmation();
				}
				break;
			case V.Constant.Event.onSelectedSlides:
				//Do nothing (handled in V.Editor.Presentation)
				break;
			case V.Constant.Event.onVEFocusChange:
				break;
			default:
				V.Debugging.log("V.Messenger.Proceesor Error: Unrecognized event: " + data.VEevent);
				break;
		}
	};


	return {
		createVEMessage		: createVEMessage,
		processVEMessage	: processVEMessage,
		validateVEMessage	: validateVEMessage
	};

}) (VISH, jQuery);