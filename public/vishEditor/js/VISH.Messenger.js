VISH.Messenger = (function(V,undefined){
	
	var init = function() {
		//Events notified via VEMessage

		V.EventsNotifier.registerCallback(V.Constant.Event.onGoToSlide, function(params){ 
			notifyEventByMessage(V.Constant.Event.onGoToSlide,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onPlayVideo, function(params){ 
			notifyEventByMessage(V.Constant.Event.onPlayVideo,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onPauseVideo, function(params){ 
			notifyEventByMessage(V.Constant.Event.onPauseVideo,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onSeekVideo, function(params){ 
			notifyEventByMessage(V.Constant.Event.onSeekVideo,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onFlashcardPointClicked, function(params){ 
			notifyEventByMessage(V.Constant.Event.onFlashcardPointClicked,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onFlashcardSlideClosed, function(params){ 
			notifyEventByMessage(V.Constant.Event.onFlashcardSlideClosed,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onVEFocusChange, function(params){ 
			notifyEventByMessage(V.Constant.Event.onVEFocusChange,params);
		});
	};

	var notifyEventByMessage = function(event,params){
		if(params.triggeredByUser===false){
			//Avoid bucles in synchronized comunications.
			return;
		}
		var VEMessage = V.Messenger.Helper.createMessage(event,params);
		V.EventsNotifier.notifyEvent(V.Constant.Event.onMessage,VEMessage,true);
	}

	return {
		init 				 : init,
		notifyEventByMessage : notifyEventByMessage
	};

}) (VISH);