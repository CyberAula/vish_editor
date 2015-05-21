VISH.IframeMessenger = (function(V,undefined){

	//Constants
	var VALID_TYPES = ["PROTOCOL","VE","WAPP"];

	//Status
	var _initialized = false;
	var _connected = false;
	var _origin = "?";

	var init = function(config){
		if(_initialized){
			return;
		}

		if((V.Status.getIsInIframe())&&(V.Status.getIframe()!=null)){
			_origin = V.Status.getIframe().id;
		}

		if (window.addEventListener){
			window.addEventListener("message", _onIframeMessageReceived, false);
		} else if (window.attachEvent){
			window.attachEvent("message", _onIframeMessageReceived);
		}

		V.EventsNotifier.registerCallback(V.Constant.Event.onSendIframeMessage,_onSendIframeMessage);

		_initialized = true;
	};

	var _onSendIframeMessage = function(iframeMessage){
		if((_initialized)&&(_connected)&&(validateIframeMessage(iframeMessage))){
			_sendMessage(iframeMessage);
		}
	};

	var _sendMessage = function(VEMessage){
		window.parent.postMessage(VEMessage,'*');
	};

	var _onIframeMessageReceived = function(wrapperedIframeMessage){
		if(_validateWrapperedIframeMessage(wrapperedIframeMessage)){

			var iframeMessage = JSON.parse(wrapperedIframeMessage.data);

			switch(iframeMessage.type) {
				case "PROTOCOL":
					return _onProtocolMessage(iframeMessage);
				case "VE":
					//Process own messages only when default events are disabled.
					var processSelfMessages = V.Status.isPreventDefaultMode();
					if((processSelfMessages===false)&&(iframeMessage.origin===_origin)){
						return false;
					}

					//Avoid messages from subiframes
					if((typeof iframeMessage.origin != "undefined")&&(iframeMessage.origin!="?")){
						if($.contains(document, $("#"+iframeMessage.origin)[0])){
							return false;
						}
					}

					return V.Messenger.VE.processVEMessage(iframeMessage);
				case "WAPP":
					return V.Messenger.WAPP.processVEMessage(iframeMessage);
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



	//////////////
	// Protocol
	//////////////

	var _onProtocolMessage = function(protocolMessage){
		if((protocolMessage.data)&&(protocolMessage.data.message === "onIframeMessengerHello")){
			// Reply Hello message
			if(V.Status.getIsInIframe()){
				_connected = true;

				var helloMessage = protocolMessage;
				helloMessage.origin = _origin;
				_sendMessage(JSON.stringify(helloMessage));
			}
		}
	};
	

	return {
		init 						: 	init,
		createMessage				: 	createMessage,
		validateIframeMessage 		: 	validateIframeMessage
	};

}) (VISH, jQuery);