VISH.Addons.IframeMessenger = (function(V,undefined){

	var listenerInitialized = false;

	var init = function(config){
		if((!config)||(!config.enable)){
			return;
		}

		if (window.addEventListener){
			window.addEventListener("message", _onWebAppMessage, false);
		} else if (el.attachEvent){
			window.attachEvent("message", _onWebAppMessage);
		}

		//Add Addon constant
		VISH.Constant.Event.onIframeMessengerHello = "onIframeMessengerHello";
	}

	var _initListener = function(){
		VISH.Events.Notifier.registerCallback(VISH.Constant.Event.onMessage,_onVishEditorMessage);
		listenerInitialized = true;
	}

	var _onVishEditorMessage = function(VEMessage){
		_sendMessage(VEMessage);
	}

	var _onWebAppMessage = function(webAppMessage){
		// VISH.Debugging.log("_onWebAppMessage");
		if(webAppMessage){
			// VISH.Debugging.log(webAppMessage.data);
			var VEMessage = webAppMessage.data;
			//We only process our own messages when default events are disabled.
			var processSelfMessages = VISH.Status.isPreventDefaultMode();
			if(VISH.Messenger.Helper.validateVEMessage(VEMessage,{allowSelfMessages: processSelfMessages})){
				if(_isVEHelloMessage(VEMessage)){
					if(!listenerInitialized){
						_initListener();
						if(VISH.Status.getIsInIframe()){
							var helloEcho = JSON.parse(VEMessage);
							helloEcho.origin = VISH.Status.getIframe().id;
							VEMessage = JSON.stringify(helloEcho);
						}
						_sendMessage(VEMessage);
					}
				} else {
					VISH.Messenger.Helper.processVEMessage(VEMessage);
				}
			}
		}
	}

	var _isVEHelloMessage = function(VEMessage){
		var message = JSON.parse(VEMessage);
		return (message.VEevent===VISH.Constant.Event.onIframeMessengerHello);
	}

	var _validateWebAppMessage = function(webAppMessage){
		if(!webAppMessage){
			return false;
		}
		return VISH.Messenger.Helper.validateVEMessage(webAppMessage.data);
	}


	///////////////
	// Core Methods
	///////////////

	var _sendMessage = function(VEMessage){
		window.parent.postMessage(VEMessage,'*');
	}


	return {
			init 			: init
	};

}) (VISH, jQuery);