VISH.Messenger.WAPP = (function(V,undefined){

	var _createWAPPMessage = function(method,params,destination,destinationId,mode){
		var data = {};
		data.method = method;
		data.params = params;
		return V.IframeMessenger.createMessage("WAPP",data,destination,destinationId,mode);
	};

	var _createWAPPResponseMessage = function(method,params,WAPPMessage){
		return _createWAPPMessage(method,params,WAPPMessage.origin,WAPPMessage.originId,WAPPMessage.mode);
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

		switch(data.method){
			case "getUser":
				var params = {username: V.User.getName(), logged: V.User.isLogged()};
				V.IframeMessenger.sendIframeMessage(_createWAPPResponseMessage(data.method,params,WAPPMessage));
				break;
			case "setScore":
				var score = data.params;
				var iframe = $("iframe[src='" + WAPPMessage.origin + "']");
				V.Object.Webapp.Handler.onSetScore(score,iframe);
				V.IframeMessenger.sendIframeMessage(_createWAPPResponseMessage(data.method,score,WAPPMessage));
				break;
			case "setProgress":
				var progress = data.params;
				var iframe = $("iframe[src='" + WAPPMessage.origin + "']");
				V.Object.Webapp.Handler.onSetProgress(progress,iframe);
				V.IframeMessenger.sendIframeMessage(_createWAPPResponseMessage(data.method,progress,WAPPMessage));
				break;
			case "setSuccessStatus":
				var status = data.params;
				var iframe = $("iframe[src='" + WAPPMessage.origin + "']");
				V.Object.Webapp.Handler.onSetSuccessStatus(status,iframe);
				V.IframeMessenger.sendIframeMessage(_createWAPPResponseMessage(data.method,status,WAPPMessage));
				break;
			case "setCompletionStatus":
				var status = data.params;
				var iframe = $("iframe[src='" + WAPPMessage.origin + "']");
				V.Object.Webapp.Handler.onSetCompletionStatus(status,iframe);
				V.IframeMessenger.sendIframeMessage(_createWAPPResponseMessage(data.method,status,WAPPMessage));
				break;
			default:
				break;
		}
	};


	return {
		processWAPPMessage	: processWAPPMessage
	};

}) (VISH, jQuery);