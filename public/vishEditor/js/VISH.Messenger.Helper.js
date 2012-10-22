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
			if(VISH.Status.getIsInIframe()){
				origin = VISH.Status.getIframe().id;
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
			if((VISH.Status.getIsInIframe())&&(params)&&(params.allowSelfMessages===false)){
				if(VEMessageObject.origin===VISH.Status.getIframe().id){
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
			case VISH.Constant.Event.onGoToSlide:
				if((VEMessageObject.params)&&(VEMessageObject.params.slideNumber)){
						VISH.Slides.goToSlide(VEMessageObject.params.slideNumber,false);
				}
				break;
			case VISH.Constant.Event.onPlayVideo:
				if((VEMessageObject.params)&&(VEMessageObject.params.type)&&(VEMessageObject.params.videoId)){
						VISH.VideoPlayer.startVideo(VEMessageObject.params.type,VEMessageObject.params.videoId,VEMessageObject.params.currentTime,VEMessageObject.params.slideNumber);
				}
				break;
			case VISH.Constant.Event.onPauseVideo:
				if((VEMessageObject.params)&&(VEMessageObject.params.type)&&(VEMessageObject.params.videoId)){
						VISH.VideoPlayer.pauseVideo(VEMessageObject.params.type,VEMessageObject.params.videoId,VEMessageObject.params.currentTime,VEMessageObject.params.slideNumber);
				}
				break;
			case VISH.Constant.Event.onSeekVideo:
				if((VEMessageObject.params)&&(VEMessageObject.params.type)&&(VEMessageObject.params.videoId)){
						VISH.VideoPlayer.seekVideo(VEMessageObject.params.type,VEMessageObject.params.videoId,VEMessageObject.params.currentTime,VEMessageObject.params.slideNumber);
				}
				break;
			case VISH.Constant.Event.onSetSlave:
				if((VEMessageObject.params)&&(typeof VEMessageObject.params.slave != "undefined")){
					VISH.Events.setSlaveMode(VEMessageObject.params.slave);
				}
				break;	
			default:
					VISH.Debugging.log("VISH.Messenger.Proceesor Error: Unrecognized event: " + VEMessageObject.VEevent);
				break;
		}
	}


	return {
		createMessage		: createMessage,
		processVEMessage	: processVEMessage,
		validateVEMessage	: validateVEMessage
	};

}) (VISH, jQuery);