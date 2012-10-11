/*
 * VISH Messenger
 * Provides an API that allows web applications to communicate with Vish Editor
 * @author GING
 * @version 1.0
 */

var VISH = VISH || {};

VISH.Messenger = (function(V,undefined){
	
	var external;
	var initialized = false;

	var init = function(isExternal) {
		if(typeof isExternal !== "boolean"){
			external = true;
		} else {
			external = isExternal;
		}

		if (window.addEventListener){
			window.addEventListener("message", _onMessage, false);
		} else if (el.attachEvent){
			window.attachEvent("message", _onMessage);
		}

		initialized = true;
	};

	var isInitialized = function(){
		return initialized;
	}

	///////////////
	// VISH EDITOR MESSAGE
	//////////////

	function message(action,params,text,origin,destination){
	  this.vishEditor = true;
	  this.action = action
	  this.params = params
	  if(text){
	  	this.text = text
	  }
	  if(origin){
	  	this.origin = origin;
	  } else {
	  	if((!external)&&(VISH.Status.getIsInIframe())){
	  		this.origin = VISH.Status.getIframe().id;
	  	}
	  }
	  if(destination){
	  	this.destination = destination;
	  }
	}

	var _createMessage = function(action,params,text,origin,destination){
		var vishEditorMessage = new message(action,params,text,origin,destination);
		return JSON.stringify(vishEditorMessage);
	}

	///////////////
	// Core Methods
	///////////////

	var sendMessage = function(action,params,text,origin,destination){
		// _print("Send Message")
		// _print(params)
		if(isInitialized()){
			_sendMessage(_createMessage(action,params,text,origin,destination),destination);
		}
	}

	var _sendMessage = function(message,destination){
		if(!_validateVishEditorMessage(message)){
			return;
		}
		if(external){
			if(typeof destination === "string"){
				var iframe = document.getElementById(destination).contentWindow;
				iframe.postMessage(message,'*');
			} else if((_isArray(destination))&&(typeof destination[0] == "string")){
				for(var i=0; i<destination.length; i++){
					document.getElementById(destination[i]).contentWindow.postMessage(message,'*');
				}
			}
		} else {
			if(V.Status.getIsInIframe()){
				window.parent.postMessage(message,'*');
			} else {
				_print("No receiver available to receive message");
			}
		}
	}

	var _onMessage = function(message){
		// _print("onMessage");
		// _print(message.data);

		var vishEditorMessage = _validateMessage(message);
		if(!vishEditorMessage){
			return;
		}
		_processVishEditorMessage(vishEditorMessage);
	}

	var _validateMessage = function(message){
		if(!external){
			if((!VISH.Status.getIsInIframe())||(message.source!==window.parent)){
				_print("Message received error: Unknown source");
				return false;
			}
		}
		var vishEditorMessage = _validateVishEditorMessage(message.data);
		if(!vishEditorMessage){
			return false;
		}
		return vishEditorMessage;
	}

	var _validateVishEditorMessage = function(message){
		if(typeof message != "string"){
			return false;
		}
		try{
			var vishEditorMessage = JSON.parse(message);
			if(!vishEditorMessage.vishEditor){
				return false;
			}
			if(!vishEditorMessage.action){
				return false;
			}
		} catch(e){
			return false;
		}
		return vishEditorMessage;
	}
	

	////////////sendMessage
	//Process Actions
	///////////

	var _processVishEditorMessage = function(message){
		switch(message.action){
			case "goToSlide":
				if((message.params)&&(message.params[0])){
					var slideNumber = message.params[0];
					if(external){
						//Callback
						if(typeof onGoToSlide === "function"){
							onGoToSlide(slideNumber,message.origin);
						}
					} else {
						VISH.Slides.goToSlide(slideNumber,false);
					}
				}
				break;
			case "playVideo":
				if((message.params)&&(message.params.length===4)){
					var videoType = message.params[0];
					var videoId = message.params[1];
					var currentTime = message.params[2];
					var videoSlideNumber = message.params[3];

					if(external){
						//Callback
						if(typeof onPlayVideo === "function"){
							onPlayVideo(videoType,videoId,currentTime,videoSlideNumber,message.origin);
						}
					} else {
						VISH.VideoPlayer.startVideo(videoType,videoId,currentTime,videoSlideNumber);
					}

				}
				break;
			case "pauseVideo":
				if((message.params)&&(message.params.length===4)){
					var videoType = message.params[0];
					var videoId = message.params[1];
					var currentTime = message.params[2];
					var videoSlideNumber = message.params[3];

					if(external){
						//Callback
						if(typeof onPauseVideo === "function"){
							onPauseVideo(videoType,videoId,currentTime,videoSlideNumber,message.origin);
						}
					} else {
						VISH.VideoPlayer.pauseVideo(videoType,videoId,currentTime,videoSlideNumber);
					}

				}
				break;
			case "seekVideo":
				if((message.params)&&(message.params.length===4)){
					var videoType = message.params[0];
					var videoId = message.params[1];
					var currentTime = message.params[2];
					var videoSlideNumber = message.params[3];

					if(external){
						//Callback
						if(typeof onSeekVideo === "function"){
							onSeekVideo(videoType,videoId,currentTime,videoSlideNumber,message.origin);
						}
					} else {
						VISH.VideoPlayer.seekVideo(videoType,videoId,currentTime,videoSlideNumber);
					}

				}
				break;
			default:
					_print("VISH Messenger Error: Unrecognized action: " + message.action);
				break;
		}
	}

	////////////
	//API
	///////////	

	var goToSlide = function(slideNumber,destination){
		VISH.Messenger.sendMessage("goToSlide",[slideNumber],null,null,destination);
	}

	var playVideo = function(videoType,videoId,currentTime,videoSlideNumber,destination){
		VISH.Messenger.sendMessage("playVideo",[videoType,videoId,currentTime,videoSlideNumber],null,null,destination);
	}

	var pauseVideo = function(videoType,videoId,currentTime,videoSlideNumber,destination){
		VISH.Messenger.sendMessage("pauseVideo",[videoType,videoId,currentTime,videoSlideNumber],null,null,destination);
	}

	var seekVideo = function(videoType,videoId,currentTime,videoSlideNumber,destination){
		VISH.Messenger.sendMessage("seekVideo",[videoType,videoId,currentTime,videoSlideNumber],null,null,destination);
	}

	///////////
	//SUPPORT
	///////////

	var _print = function(objectToPrint){
		if(external){
			// if((console)&&(console.log)){
			// 	console.log(objectToPrint);
			// }
		} else {
			VISH.Debugging.log(objectToPrint);
		}
	}

	var _isArray = function(object) {
		if (typeof object !== "undefined") {
			return object.constructor === Array;
		}
		return false;
	}

	return {
			init 		: init,
			sendMessage	: sendMessage,
			goToSlide 	: goToSlide,
			playVideo   : playVideo,
			pauseVideo	: pauseVideo,
			seekVideo   : seekVideo
	};

}) (VISH);