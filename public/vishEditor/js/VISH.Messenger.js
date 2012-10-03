VISH.Messenger = (function(V,$,undefined){
	
	var init = function(callback) {
		// VISH.Debugging.log("Vish Messenger initialized");
	};

	var sendMessage = function(message){
		if(V.Status.getIsInIframe()){
			window.parent.postMessage(message,'*');
		} else {
			VISH.Debugging.log("No receiver available to receive message");
		}
	}

	var onMessage = function(message){
		//Process message received
	}
	
	return {
			init 		: init,
			sendMessage	: sendMessage,
			onMessage 	: onMessage
	};

}) (VISH,jQuery);