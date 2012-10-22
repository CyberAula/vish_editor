/*
 * VISH Iframe Messenger API
 * Provides an API that allows web applications to communicate with Vish Editor
 * @author GING
 * @version 1.0
 */

var VISH = VISH || {};
VISH.Constant = {};
VISH.Constant.Event = {};
VISH.Constant.Event.onMessage = "onMessage";
VISH.Constant.Event.onGoToSlide = "onGoToSlide";
VISH.Constant.Event.onPlayVideo = "onPlayVideo";
VISH.Constant.Event.onPauseVideo = "onPauseVideo";
VISH.Constant.Event.onSeekVideo = "onSeekVideo";
VISH.Constant.Event.onSetSlave = "onSetSlave";
//Constant added by IframeAPI addon
VISH.Constant.Event.onIframeMessengerHello = "onIframeMessengerHello";


VISH.IframeAPI = (function(V,undefined){

	var helloAttempts;
	var maxHelloAttempts = 10;
	var helloTimeout;

	var listeners;
	// listeners['event'] = callback;

	var init = function(options) {
		if (window.addEventListener){
			window.addEventListener("message", _onWrapperedVEMessage, false);
		} else if (el.attachEvent){
			window.attachEvent("message", _onWrapperedVEMessage);
		}
		listeners = new Array();
		_startHelloExchange();
	};

	var _startHelloExchange = function(){
		registerCallback(VISH.Constant.Event.onIframeMessengerHello, function(){
			//Communication stablished
			// console.log("Communication stablished");
			if(helloTimeout){
				clearTimeout(helloTimeout);
			}	
		});
		helloAttempts = 0;
		helloTimeout = setInterval(function(){
			_sayHello();
		}, 2000);
		_sayHello();
	}

	var _sayHello = function(){
		var helloMessage = _createMessage(VISH.Constant.Event.onIframeMessengerHello);
		sendMessage(helloMessage,"*");
		helloAttempts++;
		if((helloAttempts>=maxHelloAttempts)&&(helloTimeout)){
			clearTimeout(helloTimeout);
		}
	}

	var registerCallback = function(listenedEvent,callback){
		if(callback){
			listeners[listenedEvent] = callback;
		}
	}

	var unRegisterCallback = function(listenedEvent){
		if((listenedEvent in listeners)){
			listeners[listenedEvent] = null;
		}
	}

	///////////////
	// VE MESSAGE HELPER
	//////////////

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

	var _createMessage = function(VEevent,params,origin,destination){
		var VEMessage = new message(VEevent,params,origin,destination);
		return JSON.stringify(VEMessage);
	}


	var _validateVEMessage = function(VEMessage){
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
		} catch(e){
			return false;
		}
		return true;
	}


	///////////////
	// Communication Methods
	///////////////

	var sendMessage = function(VEMessage,destination){
		if(typeof destination === "string"){
			if(destination==="*"){
				_broadcastMessage(VEMessage);
			} else {
				var iframe = document.getElementById(destination);
				if((iframe)&&(iframe.contentWindow)){
					iframe.contentWindow.postMessage(VEMessage,'*');
				}
			}
		} else if((_isArray(destination))&&(typeof destination[0] == "string")){
			for(var i=0; i<destination.length; i++){
				var iframe = document.getElementById(destination[i]);
				if((iframe)&&(iframe.contentWindow)){
					iframe.contentWindow.postMessage(VEMessage,'*');
				}
			}
		} else {
			_broadcastMessage(VEMessage);
		}
	}

	var _broadcastMessage = function(VEMessage){
		var allVEIframes = document.querySelectorAll(".vishEditorIframe");
		for(var i=0; i<allVEIframes.length; i++){
			allVEIframes[i].contentWindow.postMessage(VEMessage,'*');
		}
	}

	var _onWrapperedVEMessage = function(wrapperedVEMessage){
		// console.log("_onWrapperedVEMessage");
		if(wrapperedVEMessage){
			// console.log(wrapperedVEMessage.data);
			if(_validateVEMessage(wrapperedVEMessage.data)){
				_processVEMessage(wrapperedVEMessage.data);
			}
		}
	}
	
	var _processVEMessage = function(VEMessage){
		var VEMessageObject = JSON.parse(VEMessage);

		//"onMessage" callback
		if(listeners[VISH.Constant.Event.onMessage]){
			listeners[VISH.Constant.Event.onMessage](VEMessage,VEMessageObject.origin);
		}

		var callback = listeners[VEMessageObject.VEevent];
		if(!callback){
			//Nobody listen to this event
			return;
		}

		switch(VEMessageObject.VEevent){
			case VISH.Constant.Event.onGoToSlide:
				if(VEMessageObject.params){
					callback(VEMessageObject.params.slideNumber,VEMessageObject.origin);
				}
				break;
			case VISH.Constant.Event.onPlayVideo:
				if(VEMessageObject.params){
					callback(VEMessageObject.params.type,VEMessageObject.params.videoId,
							 VEMessageObject.params.currentTime,VEMessageObject.params.slideNumber,
							 VEMessageObject.origin);
				}
				break;
			case VISH.Constant.Event.onPauseVideo:
				if(VEMessageObject.params){
					callback(VEMessageObject.params.type,VEMessageObject.params.videoId,
							 VEMessageObject.params.currentTime,VEMessageObject.params.slideNumber,
							 VEMessageObject.origin);
				}
				break;
			case VISH.Constant.Event.onSeekVideo:
				if(VEMessageObject.params){
					callback(VEMessageObject.params.type,VEMessageObject.params.videoId,
							 VEMessageObject.params.currentTime,VEMessageObject.params.slideNumber,
							 VEMessageObject.origin);
				}
				break;
			case VISH.Constant.Event.onIframeMessengerHello:
				callback();
				break;
			default:
				_print("VISH.Messenger.Proceesor Error: Unrecognized event: " + VEMessageObject.VEevent);
				break;
		}
	}

	

	////////////
	//API
	///////////	

	var goToSlide = function(slideNumber,destination){
		var params = {};
		params.slideNumber = slideNumber;
		var VEMessage = _createMessage(VISH.Constant.Event.onGoToSlide,params,null,destination);
		sendMessage(VEMessage,destination);
	}

	var playVideo = function(videoType,videoId,currentTime,videoSlideNumber,destination){
		var params = {};
		params.type = videoType;
		params.videoId = videoId;
		params.currentTime = currentTime;
		params.slideNumber = videoSlideNumber;
		var VEMessage = _createMessage(VISH.Constant.Event.onPlayVideo,params,null,destination);
		sendMessage(VEMessage,destination);
	}

	var pauseVideo = function(videoType,videoId,currentTime,videoSlideNumber,destination){
		var params = {};
		params.type = videoType;
		params.videoId = videoId;
		params.currentTime = currentTime;
		params.slideNumber = videoSlideNumber;
		var VEMessage = _createMessage(VISH.Constant.Event.onPauseVideo,params,null,destination);
		sendMessage(VEMessage,destination);
	}

	var seekVideo = function(videoType,videoId,currentTime,videoSlideNumber,destination){
		var params = {};
		params.type = videoType;
		params.videoId = videoId;
		params.currentTime = currentTime;
		params.slideNumber = videoSlideNumber;
		var VEMessage = _createMessage(VISH.Constant.Event.onSeekVideo,params,null,destination);
		sendMessage(VEMessage,destination);
	}

	var setSlave = function(slave,destination){
		var params = {};
		params.slave = slave;
		var VEMessage = _createMessage(VISH.Constant.Event.onSetSlave,params,null,destination);
		sendMessage(VEMessage,destination);
	}


	///////////
	//SUPPORT
	///////////

	var _print = function(objectToPrint){
		if((console)&&(console.log)){
			console.log(objectToPrint);
		}
	}

	var _isArray = function(object) {
		if (typeof object !== "undefined") {
			return object.constructor === Array;
		}
		return false;
	}

	return {
			init 				: init,
			registerCallback 	: registerCallback,
			unRegisterCallback 	: unRegisterCallback,
			sendMessage			: sendMessage,
			setSlave			: setSlave,
			goToSlide 			: goToSlide,
			playVideo 			: playVideo,
			pauseVideo 			: pauseVideo,
			seekVideo 			: seekVideo
	};

}) (VISH);