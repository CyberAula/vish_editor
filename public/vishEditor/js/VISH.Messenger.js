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
		if(isInitialized()){
			_sendMessage(_createMessage(action,params,text,origin,destination),destination);
		}
	}

	var _sendMessage = function(message,destination){
		if(!_validateVishEditorMessage(message)){
			return;
		}
		if(external){
			var iframe = document.getElementById(destination).contentWindow;
			iframe.postMessage(message,'*');
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
		// _print(message);

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
	

	////////////
	//Process Actions
	///////////

	var _processVishEditorMessage = function(message){
		switch(message.action){
			case "goToSlide":
				if((message.params)&&(message.params[0])){
					if(external){
						//Callback
						if(typeof onGoToSlide === "function"){
							onGoToSlide(message.params[0],message.origin);
						}
					} else {
						VISH.Slides.goToSlide(message.params[0]);
					}
				}
				break;
			default:
					_print("VISH Messenger Error: Unrecognized action");
				break;
		}
	}

	////////////
	//API
	///////////	

	var goToSlide = function(slideNumber,destination){
		VISH.Messenger.sendMessage("goToSlide",[slideNumber],null,null,destination);
	}


	///////////
	//SUPPORT
	///////////

	var _print = function(objectToPrint){
		if(external){
			if((console)&&(console.log)){
				console.log(objectToPrint);
			}
		} else {
			VISH.Debugging.log(objectToPrint);
		}
	}

	return {
			init 		: init,
			sendMessage	: sendMessage,
			goToSlide 	: goToSlide
	};

}) (VISH);