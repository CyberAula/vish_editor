VISH.Messenger.Helper = (function(V,undefined){

	/////////////////////
	// Message Factory
	/////////////////////

	function message(VEevent,params,origin,destination){
		this.vishEditor = true;
		this.VEevent = VEevent
		if(params){
			this.params = params
		}
		if(origin){
			this.origin = origin;
		} else {
			this.origin = "?";
		}
		if(destination){
			this.destination = destination;
		} else {
			this.destination = "*";
		}
	}

	var createMessage = function(VEevent,params,origin,destination){
		if(!origin){
			if((V.Status.getIsInIframe())&&(V.Status.getIframe()!=null)){
				origin = V.Status.getIframe().id;
			}
		}
		var VEMessage = new message(VEevent,params,origin,destination);
		return JSON.stringify(VEMessage);
	}


	var validateVEMessage = function(VEMessage,params){
		if(typeof VEMessage !== "string"){
			return false;
		}
		try{
			var VEMessageObject = JSON.parse(VEMessage);
			if(typeof VEMessageObject !== "object"){
				return false;
			}
			if(VEMessageObject.vishEditor !== true){
				return false;
			}
			if(!VEMessageObject.VEevent){
				return false;
			}
			if((V.Status.getIsInIframe())&&(V.Status.getIframe()!=null)&&(params)&&(params.allowSelfMessages===false)){
				if(VEMessageObject.origin===V.Status.getIframe().id){
					return false;
				}
			}
			//Avoid messages from subiframes
			if((typeof VEMessageObject.origin != "undefined")&&(VEMessageObject.origin!=="?")){
				if($.contains(document, $("#"+VEMessageObject.origin)[0])){
					return false;
				}
			}
		} catch(e){
			return false;
		}
		return true;
	}


	/////////////////////
	// Message Processor
	/////////////////////

	var processVEMessage = function(VEMessage){
		var VEMessageObject = JSON.parse(VEMessage);

		switch(VEMessageObject.VEevent){
			case V.Constant.Event.onGoToSlide:
				if((VEMessageObject.params)&&(VEMessageObject.params.slideNumber)){
						V.Slides.goToSlide(VEMessageObject.params.slideNumber,false);
				}
				break;
			case V.Constant.Event.onPlayVideo:
				if((VEMessageObject.params)&&(VEMessageObject.params.videoId)){
						if((VEMessageObject.params.slideNumber)&&(V.Slides.getCurrentSlideNumber()!=VEMessageObject.params.slideNumber)){
							V.Slides.goToSlide(VEMessageObject.params.slideNumber,false);
						}
						V.Video.playVideo(VEMessageObject.params.videoId,VEMessageObject.params.currentTime,false);
				}
				break;
			case V.Constant.Event.onPauseVideo:
				if((VEMessageObject.params)&&(VEMessageObject.params.videoId)){
						if((VEMessageObject.params.slideNumber)&&(V.Slides.getCurrentSlideNumber()!=VEMessageObject.params.slideNumber)){
							V.Slides.goToSlide(VEMessageObject.params.slideNumber,false);
						}
						V.Video.pauseVideo(VEMessageObject.params.videoId,VEMessageObject.params.currentTime,false);
				}
				break;
			case V.Constant.Event.onSeekVideo:
				if((VEMessageObject.params)&&(VEMessageObject.params.videoId)){
						if((VEMessageObject.params.slideNumber)&&(V.Slides.getCurrentSlideNumber()!=VEMessageObject.params.slideNumber)){
							V.Slides.goToSlide(VEMessageObject.params.slideNumber,false);
						}
						V.Video.seekVideo(VEMessageObject.params.videoId,VEMessageObject.params.currentTime,false);
				}
				break;
			case V.Constant.Event.onFlashcardPointClicked:
				if((VEMessageObject.params)&&(VEMessageObject.params.slideNumber)){
						V.Slides.openSubslide(VEMessageObject.params.slideNumber,false);
				}
				break;
			case V.Constant.Event.onFlashcardSlideClosed:
				if((VEMessageObject.params)&&(VEMessageObject.params.slideNumber)){
						V.Slides.closeSubslide(VEMessageObject.params.slideNumber,false);
				}
				break;
			case V.Constant.Event.onSetSlave:
				if((VEMessageObject.params)&&(typeof VEMessageObject.params.slave != "undefined")){
					V.Status.setSlaveMode(VEMessageObject.params.slave);
				}
				break;	
			case V.Constant.Event.onPreventDefault:
				if((VEMessageObject.params)&&(typeof VEMessageObject.params.preventDefaults != "undefined")){
					V.Status.setPreventDefaultMode(VEMessageObject.params.preventDefaults);
				}
				break;
			case V.Constant.Event.allowExitWithoutConfirmation:
					V.Editor.Events.allowExitWithoutConfirmation();
				break;
			case V.Constant.Event.onSelectedSlides:
					V.EventsNotifier.notifyEvent(V.Constant.Event.onSelectedSlides,VEMessageObject.params,true);
				break;
			default:
					V.Debugging.log("V.Messenger.Proceesor Error: Unrecognized event: " + VEMessageObject.VEevent);
				break;
		}
	}


	return {
		createMessage		: createMessage,
		processVEMessage	: processVEMessage,
		validateVEMessage	: validateVEMessage
	};

}) (VISH, jQuery);