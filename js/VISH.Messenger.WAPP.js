VISH.Messenger.WAPP = (function(V,undefined){

	var _createWAPPMessage = function(method,params,origin,destination){
		var data = {};
		data.method = method;
		data.params = params;
		return V.IframeMessenger.createMessage("WAPP",data,origin,destination);
	};


	var _validateWAPPMessage = function(VEMessage,params){
		if(!V.IframeMessenger.validateIframeMessage(VEMessage)){
			return false;
		}
		if(typeof VEMessage.data != "object"){
			return false;
		}
		if(typeof VEMessage.data.method != "string"){
			return false;
		}
		return true;
	};


	/////////////////////
	// WAPP Message Processor
	/////////////////////

	var processWAPPMessage = function(WAPPMessage){
		data = WAPPMessage.data;
		//TODO...
	};


	return {
		processWAPPMessage	: processWAPPMessage
	};

}) (VISH, jQuery);