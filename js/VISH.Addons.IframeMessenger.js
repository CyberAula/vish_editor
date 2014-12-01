VISH.Addons.IframeMessenger = (function(V,undefined){

	var _listenerInitialized = false;

	var init = function(config){
		if((!config)||(!config.enable)){
			return;
		}

		//Add Addon constant
		V.Constant.Event.onIframeMessengerHello = "onIframeMessengerHello";

		if (window.addEventListener){
			window.addEventListener("message", _onWebAppMessage, false);
		} else if (window.attachEvent){
			window.attachEvent("message", _onWebAppMessage);
		}
	};

	var _initListener = function(){
		V.EventsNotifier.registerCallback(V.Constant.Event.onMessage,_onVishEditorMessage);
		_listenerInitialized = true;
	};

	var _onVishEditorMessage = function(VEMessage){
		_sendMessage(VEMessage);
	};

	var _onWebAppMessage = function(webAppMessage){
		// V.Debugging.log("_onWebAppMessage");
		if(webAppMessage){
			// V.Debugging.log(webAppMessage.data);
			var VEMessage = webAppMessage.data;
			//We only process our own messages when default events are disabled.
			var processSelfMessages = V.Status.isPreventDefaultMode();
			if(V.Messenger.Helper.validateVEMessage(VEMessage,{allowSelfMessages: processSelfMessages})){
				if(_isVEHelloMessage(VEMessage)){
					if(!_listenerInitialized){
						_initListener();
					}

					//Reply Hello
					if(V.Status.getIsInIframe()){
						var helloEcho = JSON.parse(VEMessage);
						if(V.Status.getIframe()!=null){
							helloEcho.origin = V.Status.getIframe().id;
						}
						VEMessage = JSON.stringify(helloEcho);
					}
					_sendMessage(VEMessage);

				} else {
					V.Messenger.Helper.processVEMessage(VEMessage);
				}
			}
		}
	};

	var _isVEHelloMessage = function(VEMessage){
		var message = JSON.parse(VEMessage);
		return (message.VEevent===V.Constant.Event.onIframeMessengerHello);
	};

	var _validateWebAppMessage = function(webAppMessage){
		if(!webAppMessage){
			return false;
		}
		return V.Messenger.Helper.validateVEMessage(webAppMessage.data);
	};


	///////////////
	// Core Methods
	///////////////

	var _sendMessage = function(VEMessage){
		window.parent.postMessage(VEMessage,'*');
	}


	return {
			init 	: init
	};

}) (VISH, jQuery);