VISH.IframeMessenger = (function(V,undefined){

	//Constants
	var VALID_TYPES = ["PROTOCOL","VE","WAPP"];

	//Status
	var _initialized = false;
	var _connected = false;
	var _origin = "?";
	var _originId = "?";

	var _iframeConections = {};
	// _iframeConections["origin"] = iframeDOM

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
		window.parent.postMessage(iframeMessage,'*');
	};

	var _onIframeMessageReceived = function(wrapperedIframeMessage){
		if(_validateWrapperedIframeMessage(wrapperedIframeMessage)){

			var iframeMessage = JSON.parse(wrapperedIframeMessage.data);

			if((iframeMessage.destination!=_origin)&&(iframeMessage.destination!=="*")){
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

	function IframeMessage(type,data,origin,destination){
		this.IframeMessage = true;
		this.type = type || _type;
		this.data = data || {};
		this.origin = _origin;
		this.originId = _originId;
		this.destination = destination || "*";
	};

	var createMessage = function(type,data,origin,destination){
		var iframeMessage = new IframeMessage(type,data,origin,destination);
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

	var getIframeConnections = function(){
		return _iframeConections;
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

					var connectedIframe = $("iframe[src='" + helloMessage.origin + "']");
					if($(connectedIframe).length > 0){
						_iframeConections[helloMessage.origin] = $(connectedIframe)[0];
					}

					_connected = true;

					helloMessage.destination = helloMessage.origin;
					helloMessage.origin = _origin;
					_sendMessage(JSON.stringify(helloMessage));
				}
			}
		}
	};
	

	return {
		init 						: 	init,
		createMessage				: 	createMessage,
		validateIframeMessage 		: 	validateIframeMessage,
		getIframeConnections		: 	getIframeConnections,
		sendIframeMessage 			: 	sendIframeMessage
	};

}) (VISH, jQuery);