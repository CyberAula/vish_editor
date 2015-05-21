/*
 * VISH Iframe Messenger API
 * Provides an API that allows web applications to communicate with ViSH Editor
 * @author GING
 * @version 1.1
 */

var VISH = VISH || {};


VISH.IframeAPI = (function(V,undefined){

	var _initialized = false;
	var _connected = false;
	var _options;
	var _type = "VE";
	var _listeners;
	// _listeners['event'] = callback;

	//Constants
	var VALID_TYPES = ["PROTOCOL","VE","WAPP"];


	///////////////
	// CORE
	//////////////

	var init = function(initOptions){
		if(_initialized) {
			return;
		}

		if (window.addEventListener){
			window.addEventListener("message", _onIframeMessageReceived, false);
		} else if (window.attachEvent){
			window.attachEvent("message", _onIframeMessageReceived);
		}

		_options = initOptions || {};

		if(VALID_TYPES.indexOf(_options.type)!=-1){
			_type = _options.type;
		}

		if(_type === "VE"){
			_defineVEConstants();
		}

		_listeners = new Array();

		registerCallback("onConnect", function(origin){
			//Communication stablished
			_connected = true;

			_print("Communication stablished with: " + origin);

			if(_type==="VE"){
				_afterConnectVE(origin);
			}

			if((_options)&&(typeof _options.callback === "function")){
				_options.callback(origin);
			}
		});

		_initHelloExchange();

		_initialized = true;
	};


	// Messages

	function IframeMessage(type,data,origin,destination){
		this.IframeMessage = true;
		this.type = type || _type;
		this.data = data || {};
		this.origin = origin || "?";
		this.destination = destination || "*";
	};

	var _createMessage = function(type,data,origin,destination){
		var iframeMessage = new IframeMessage(type,data,origin,destination);
		return JSON.stringify(iframeMessage);
	};

	var _validateWrapperedIframeMessage = function(wrapperedIframeMessage){
		if((typeof wrapperedIframeMessage != "object")||(typeof wrapperedIframeMessage.data != "string")){
			return false;
		}
		return _validateIframeMessage(wrapperedIframeMessage.data);
	};

	var _validateIframeMessage = function(iframeMessage){
		try {
			var iframeMessage = JSON.parse(iframeMessage);
			if((iframeMessage.IframeMessage!==true)||(VALID_TYPES.indexOf(iframeMessage.type)==-1)){
				return false;
			}
		} catch (e){
			return false;
		}

		return true;
	};


	// Events and callbacks

	var registerCallback = function(listenedEvent,callback){
		if(callback){
			_listeners[listenedEvent] = callback;
		}
	};

	var unRegisterCallback = function(listenedEvent){
		if((listenedEvent in _listeners)){
			_listeners[listenedEvent] = null;
		}
	};


	// Iframe communication methods

	var sendMessage = function(iframeMessage,destination){
		if(!_connected){
			return "Not connected";
		}

		return _sendMessage(iframeMessage,destination);
	};

	var _sendMessage = function(iframeMessage,destination){

		if(!_validateIframeMessage(iframeMessage)){
			return "Invalid message";
		}
		
		if(typeof destination == "undefined"){
			if(typeof iframeMessage.destination != "undefined"){
				destination = iframeMessage.destination;
			} else {
				destination = "*";
			}
		}

		if(typeof destination === "string"){
			if(destination==="*"){
				_broadcastMessage(iframeMessage);
			} else {
				var iframe = document.getElementById(destination);
				_sendMessageToIframe(iframeMessage,iframe);
			}
		} else if((destination instanceof Array)&&(destination.length > 0)){
			for(var i=0; i<destination.length; i++){
				if(typeof destination[i] == "string"){
					var iframe = document.getElementById(destination[i]);
					_sendMessageToIframe(iframeMessage,iframe);
				}
			}
		} else {
			_broadcastMessage(iframeMessage);
		}
	};

	var _broadcastMessage = function(iframeMessage){
		var allVEIframes = document.querySelectorAll(".vishEditorIframe");
		for(var i=0; i<allVEIframes.length; i++){
			_sendMessageToIframe(iframeMessage,allVEIframes[i]);
		}
	};

	var _sendMessageToIframe = function(iframeMessage,iframe){
		if((iframe)&&(iframe.contentWindow)){
			iframe.contentWindow.postMessage(iframeMessage,'*');
		}
	};

	var _onIframeMessageReceived = function(wrapperedIframeMessage){
		if(_validateWrapperedIframeMessage(wrapperedIframeMessage)){
			
			var iframeMessage = JSON.parse(wrapperedIframeMessage.data);

			switch(iframeMessage.type) {
				case "PROTOCOL":
					return _processProtocolMessage(iframeMessage);
				case "VE":
					return _processVEMessage(iframeMessage);
				case "WAPP":
					//TODO
				default:
					return;
			}
		}
	};


	///////////////
	// PROTOCOL
	//////////////

	var _helloAttempts;
	var MAX_HELLO_ATTEMPTS = 40;
	var _helloTimeout;

	var _initHelloExchange = function(){
		registerCallback("onIframeMessengerHello", function(origin){
			//Communication stablished

			if(_helloTimeout){
				clearTimeout(_helloTimeout);
			}

			if(typeof _listeners["onConnect"] == "function"){
				_listeners["onConnect"](origin);
			}
		});

		_helloAttempts = 0;
		_helloTimeout = setInterval(function(){
			_sayHello();
		},1250);

		_sayHello();
	};

	var _sayHello = function(){
		var helloMessage = _createProtocolMessage("onIframeMessengerHello");
		_sendMessage(helloMessage,"*");
		_helloAttempts++;
		if((_helloAttempts>=MAX_HELLO_ATTEMPTS)&&(_helloTimeout)){
			clearTimeout(_helloTimeout);
		}
	};

	var _createProtocolMessage = function(protocolMessage,origin,destination){
		var data = {};
		data.message = protocolMessage;
		return _createMessage("PROTOCOL",data,origin,destination);
	};

	var _processProtocolMessage = function(protocolMessage){
		if((protocolMessage.data)&&(protocolMessage.data.message === "onIframeMessengerHello")){
			if(typeof _listeners["onIframeMessengerHello"] == "function"){
				_listeners["onIframeMessengerHello"](protocolMessage.origin);
			}
		}
	};

	///////////////
	// VE Messages
	//////////////

	var _createVEMessage = function(VEevent,params,origin,destination){
		var data = {};
		data.VEevent = VEevent;
		data.params = params;
		return _createMessage("VE",data,origin,destination);
	};

	var _defineVEConstants = function(){
		VISH.Constant = VISH.Constant || {};
		VISH.Constant.Event = VISH.Constant.Event || {};
		VISH.Constant.Event.onSendIframeMessage = "onMessage";
		VISH.Constant.Event.onGoToSlide = "onGoToSlide";
		VISH.Constant.Event.onEnterSlide = "onEnterSlide";
		VISH.Constant.Event.onPlayVideo = "onPlayVideo";
		VISH.Constant.Event.onPauseVideo = "onPauseVideo";
		VISH.Constant.Event.onSeekVideo = "onSeekVideo";
		VISH.Constant.Event.onPlayAudio = "onPlayAudio";
		VISH.Constant.Event.onPauseAudio = "onPauseAudio";
		VISH.Constant.Event.onSeekAudio = "onSeekAudio";
		VISH.Constant.Event.onSubslideOpen = "onSubslideOpen";
		VISH.Constant.Event.onSubslideClosed = "onSubslideClosed";
		VISH.Constant.Event.onAnswerQuiz = "onAnswerQuiz";
		VISH.Constant.Event.onSetSlave = "onSetSlave";
		VISH.Constant.Event.onPreventDefault = "onPreventDefault";
		VISH.Constant.Event.allowExitWithoutConfirmation = "allowExitWithoutConfirmation";
		VISH.Constant.Event.exit = "exit";
		VISH.Constant.Event.onSelectedSlides = "onSelectedSlides";
		VISH.Constant.Event.onVEFocusChange = "onVEFocusChange";
	};

	var _afterConnectVE = function(origin){
		if(_options){
			if(_options.preventDefault===true){
				_sendPreventDefaults(true,origin);
			}
		}
	};

	var _sendPreventDefaults = function(preventDefaults,destination){
		var params = {};
		params.preventDefaults = preventDefaults;
		var VEMessage = _createVEMessage(VISH.Constant.Event.onPreventDefault,params,undefined,destination);
		sendMessage(VEMessage,destination);
	};

	var _processVEMessage = function(VEMessage){

		var data = VEMessage.data;

		//"onMessage" callback
		if(_listeners[VISH.Constant.Event.onSendIframeMessage]){
			_listeners[VISH.Constant.Event.onSendIframeMessage](JSON.stringify(VEMessage),VEMessage.origin);
		}

		var callback = _listeners[data.VEevent];
		if(!callback){
			//Nobody listen to this event
			return;
		}

		switch(data.VEevent){
			case VISH.Constant.Event.onGoToSlide:
				if(data.params){
					callback(data.params.slideNumber,VEMessage.origin);
				}
				break;
			case VISH.Constant.Event.onPlayVideo:
				if(data.params){
					callback(data.params.videoId,
							 data.params.currentTime,data.params.slideNumber,
							 VEMessage.origin);
				}
				break;
			case VISH.Constant.Event.onPauseVideo:
				if(data.params){
					callback(data.params.videoId,
							 data.params.currentTime,data.params.slideNumber,
							 VEMessage.origin);
				}
				break;
			case VISH.Constant.Event.onSeekVideo:
				if(data.params){
					callback(data.params.videoId,
							 data.params.currentTime,data.params.slideNumber,
							 VEMessage.origin);
				}
				break;
			case VISH.Constant.Event.onSubslideOpen:
				if(data.params){
					callback(data.params.slideId,
							 VEMessage.origin);
				}
				break;
			case VISH.Constant.Event.onSubslideClosed:
				if(data.params){
					callback(data.params.slideId,
							 VEMessage.origin);
				}
				break;
			case VISH.Constant.Event.onVEFocusChange:
				if(data.params){
					callback(data.params.focus,VEMessage.origin);
				}
				break;
			case "onIframeMessengerHello":
				callback(VEMessage.origin);
				break;
			default:
				_print("VISH.Messenger.Proceesor Error: Unrecognized event: " + data.VEevent);
				break;
		}
	};

	
	////////////
	// VE API
	///////////	

	var goToSlide = function(slideNumber,destination){
		var params = {};
		params.slideNumber = slideNumber;
		var VEMessage = _createVEMessage(VISH.Constant.Event.onGoToSlide,params,null,destination);
		sendMessage(VEMessage,destination);
	};

	var playVideo = function(videoId,currentTime,videoSlideNumber,destination){
		var params = {};
		params.videoId = videoId;
		params.currentTime = currentTime;
		params.slideNumber = videoSlideNumber;
		var VEMessage = _createVEMessage(VISH.Constant.Event.onPlayVideo,params,null,destination);
		sendMessage(VEMessage,destination);
	};

	var pauseVideo = function(videoId,currentTime,videoSlideNumber,destination){
		var params = {};
		params.videoId = videoId;
		params.currentTime = currentTime;
		params.slideNumber = videoSlideNumber;
		var VEMessage = _createVEMessage(VISH.Constant.Event.onPauseVideo,params,null,destination);
		sendMessage(VEMessage,destination);
	};

	var seekVideo = function(videoId,currentTime,videoSlideNumber,destination){
		var params = {};
		params.videoId = videoId;
		params.currentTime = currentTime;
		params.slideNumber = videoSlideNumber;
		var VEMessage = _createVEMessage(VISH.Constant.Event.onSeekVideo,params,null,destination);
		sendMessage(VEMessage,destination);
	};

	var openSubslide = function(slideId,destination){
		var params = {};
		params.slideId = slideId;
		var VEMessage = _createVEMessage(VISH.Constant.Event.onSubslideOpen,params,null,destination);
		sendMessage(VEMessage,destination);
	};

	var closeSubslide = function(slideId,destination){
		var params = {};
		params.slideId = slideId;
		var VEMessage = _createVEMessage(VISH.Constant.Event.onSubslideClosed,params,null,destination);
		sendMessage(VEMessage,destination);
	};

	var setSlave = function(slave,destination){
		var params = {};
		params.slave = slave;
		var VEMessage = _createVEMessage(VISH.Constant.Event.onSetSlave,params,null,destination);
		sendMessage(VEMessage,destination);
	};

	var setMaster = function(master){
		var params = {};
		var allVEIframes = document.querySelectorAll(".vishEditorIframe");
		for(var i=0; i<allVEIframes.length; i++){
			if(allVEIframes[i].id!==master){
				params.slave = true;
			} else {
				params.slave = false;
			}
			var destination = allVEIframes[i].id;
			var VEMessage = _createVEMessage(VISH.Constant.Event.onSetSlave,params,null,destination);
			sendMessage(VEMessage,destination);
		}
	};

	var allowExitWithoutConfirmation = function(destination){
		var params = {};
		var VEMessage = _createVEMessage(VISH.Constant.Event.allowExitWithoutConfirmation,params,null,destination);
		sendMessage(VEMessage,destination);
	};


	///////////
	// Utils
	///////////

	var _print = function(objectToPrint){
		if((console)&&(console.log)){
			console.log(objectToPrint);
		}
	};


	return {
			init 							: init,
			registerCallback 				: registerCallback,
			unRegisterCallback 				: unRegisterCallback,
			sendMessage						: sendMessage,
			setSlave						: setSlave,
			setMaster						: setMaster,
			allowExitWithoutConfirmation 	: allowExitWithoutConfirmation,
			goToSlide 						: goToSlide,
			playVideo 						: playVideo,
			pauseVideo 						: pauseVideo,
			seekVideo 						: seekVideo,
			openSubslide					: openSubslide,
			closeSubslide					: closeSubslide
	};

}) (VISH);