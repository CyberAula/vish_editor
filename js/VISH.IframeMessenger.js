VISH.IframeMessenger = (function(V,undefined){

	//Constants
	var VALID_TYPES = ["PROTOCOL","VE","WAPP"];

	//Status
	var _initialized = false;
	var _connected = false;
	var _origin = "?";
	var _originId = "?";


	var init = function(config){
		if(_initialized){
			return;
		}

		try {
			_origin = window.location.href;
		} catch (e){}
		_originId = _generateOriginId();

		if (window.addEventListener){
			window.addEventListener("message", _onIframeMessageReceived, false);
		} else if (window.attachEvent){
			window.attachEvent("message", _onIframeMessageReceived);
		}

		V.EventsNotifier.registerCallback(V.Constant.Event.onSendIframeMessage,sendIframeMessage);

		_initialized = true;
	};

	var sendIframeMessage = function(iframeMessage){
		if((_initialized)&&(_connected)&&(validateIframeMessage(iframeMessage))){
			_sendMessage(iframeMessage);
		}
	};

	var _sendMessage = function(iframeMessage){
		var parsedIframeMessage = JSON.parse(iframeMessage);

		switch(parsedIframeMessage.mode){
			case "EXTERNAL":
				window.parent.postMessage(iframeMessage,'*');
				break;
			case "INTERNAL":
				$("iframe[src='" + parsedIframeMessage.destination + "']").each(function(index,iframe){
					_sendMessageToIframe(iframeMessage,iframe);
				});
				break;
			default:
				return;
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

			if((iframeMessage.destination!=_origin)&&(iframeMessage.destination!=="*")){
				return;
			}

			if((typeof iframeMessage.destinationId != "undefined")&&(iframeMessage.destinationId != _originId)){
				return;
			}

			if(iframeMessage.type!=="VE"){
				//Do not process own messages
				if((iframeMessage.origin===_origin)&&(iframeMessage.originId===_originId)){
					return false;
				}
			}

			switch(iframeMessage.type) {
				case "PROTOCOL":
					return _onProtocolMessage(iframeMessage);
				case "VE":
					//Process own messages only when default events are disabled.
					var processSelfMessages = V.Status.isPreventDefaultMode();
					if((processSelfMessages===false)&&(iframeMessage.origin===_origin)&&(iframeMessage.originId===_originId)){
						return false;
					}
					return V.Messenger.VE.processVEMessage(iframeMessage);
				case "WAPP":
					return V.Messenger.WAPP.processWAPPMessage(iframeMessage);
				default:
					return;
			}
		}
	};

	///////////////
	// Messages
	///////////////

	function IframeMessage(type,data,destination,destinationId,mode){
		this.IframeMessage = true;
		this.mode = mode || "EXTERNAL";
		this.type = type || _type;
		this.data = data || {};
		this.origin = _origin;
		this.originId = _originId;
		this.destination = destination || "*";
		if(destinationId){
			this.destinationId = destinationId;
		}
	};

	var createMessage = function(type,data,destination,destinationId,mode){
		var iframeMessage = new IframeMessage(type,data,destination,destinationId,mode);
		return JSON.stringify(iframeMessage);
	};

	var _validateWrapperedIframeMessage = function(wrapperedIframeMessage){
		if((typeof wrapperedIframeMessage != "object")||(typeof wrapperedIframeMessage.data != "string")){
			return false;
		}
		return validateIframeMessage(wrapperedIframeMessage.data);
	};

	var validateIframeMessage = function(iframeMessage){
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

	var _generateOriginId = function(){
		var timestamp = ((new Date()).getTime()).toString();
		var random = (parseInt(Math.random()*1000000)).toString();
		return parseInt(timestamp.substr(timestamp.length-7,timestamp.length-1) + random);
	};


	//////////////
	// Protocol
	//////////////

	var _onProtocolMessage = function(protocolMessage){
		if((protocolMessage.data)&&(protocolMessage.data.message === "onIframeMessengerHello")){
			var helloMessage = protocolMessage;

			// Reply Hello message
			if(V.Status.getIsInIframe()){
				if(helloMessage.origin != "?"){
					_connected = true;
					V.Object.Webapp.Handler.onWAPPConnected(helloMessage.origin,helloMessage.originId);

					helloMessage.destination = helloMessage.origin;
					helloMessage.destinationId = helloMessage.originId;
					helloMessage.origin = _origin;
					helloMessage.originId = _originId;
					_sendMessage(JSON.stringify(helloMessage));
				}
			}
		}
	};
	

	return {
		init 						: 	init,
		createMessage				: 	createMessage,
		validateIframeMessage 		: 	validateIframeMessage,
		sendIframeMessage 			: 	sendIframeMessage
	};

}) (VISH, jQuery);