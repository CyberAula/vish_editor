VISH.Messenger = (function(V,undefined){
	
	var init = function() {
		//Events notified via VEMessage

		VISH.EventsNotifier.registerCallback(VISH.Constant.Event.onGoToSlide, function(params){ 
			notifyEventByMessage(VISH.Constant.Event.onGoToSlide,params);
		});

		VISH.EventsNotifier.registerCallback(VISH.Constant.Event.onPlayVideo, function(params){ 
			notifyEventByMessage(VISH.Constant.Event.onPlayVideo,params);
		});

		VISH.EventsNotifier.registerCallback(VISH.Constant.Event.onPauseVideo, function(params){ 
			notifyEventByMessage(VISH.Constant.Event.onPauseVideo,params);
		});

		VISH.EventsNotifier.registerCallback(VISH.Constant.Event.onSeekVideo, function(params){ 
			notifyEventByMessage(VISH.Constant.Event.onSeekVideo,params);
		});

		VISH.EventsNotifier.registerCallback(VISH.Constant.Event.onFlashcardPointClicked, function(params){ 
			notifyEventByMessage(VISH.Constant.Event.onFlashcardPointClicked,params);
		});

		VISH.EventsNotifier.registerCallback(VISH.Constant.Event.onFlashcardSlideClosed, function(params){ 
			notifyEventByMessage(VISH.Constant.Event.onFlashcardSlideClosed,params);
		});
	};

	var notifyEventByMessage = function(event,params){
		if(params.triggeredByUser===false){
			//Avoid bucles in synchronized comunications.
			return;
		}
		var VEMessage = VISH.Messenger.Helper.createMessage(event,params);
		VISH.EventsNotifier.notifyEvent(VISH.Constant.Event.onMessage,VEMessage,true);
	}

	return {
		init 				 : init,
		notifyEventByMessage : notifyEventByMessage
	};

}) (VISH);