VISH.Messenger = (function(V,undefined){
	
	var init = function() {
		//Events notified via VEMessage

		VISH.Events.Notifier.registerCallback(VISH.Constant.Event.onGoToSlide, function(params){ 
			_notifyEventByMessage(VISH.Constant.Event.onGoToSlide,params);
		});

		VISH.Events.Notifier.registerCallback(VISH.Constant.Event.onPlayVideo, function(params){ 
			_notifyEventByMessage(VISH.Constant.Event.onPlayVideo,params);
		});

		VISH.Events.Notifier.registerCallback(VISH.Constant.Event.onPauseVideo, function(params){ 
			_notifyEventByMessage(VISH.Constant.Event.onPauseVideo,params);
		});

		VISH.Events.Notifier.registerCallback(VISH.Constant.Event.onSeekVideo, function(params){ 
			_notifyEventByMessage(VISH.Constant.Event.onSeekVideo,params);
		});
	};

	var _notifyEventByMessage = function(event,params){
		if(params.triggeredByUser===false){
			//Avoid bucles in synchronized comunications.
			return;
		}
		var VEMessage = VISH.Messenger.Helper.createMessage(event,params);

		//Trigger onMessageEvent
		VISH.Events.Notifier.notifyEvent(VISH.Constant.Event.onMessage,VEMessage,true);
	}

	return {
			init : init
	};

}) (VISH);