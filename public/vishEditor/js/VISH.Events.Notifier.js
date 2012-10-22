VISH.Events.Notifier = (function(V,$,undefined){

	var listeners;
	// listeners['event'] = [callback1,callback2,...,callbackn];

	var init = function() {
		listeners = new Array();		
	};

	var registerCallback = function(listenedEvent,callback){
		if(listenedEvent in listeners){
			listeners[listenedEvent].push(callback);
		} else {
			listeners[listenedEvent] = [];
			listeners[listenedEvent].push(callback);
			if(listenedEvent==VISH.Constant.Event.onMessage){
				VISH.Messenger.init();
			}
		}
	}

	var unRegisterCallback = function(listenedEvent,callback){
		if((listenedEvent in listeners)){
			if(listeners[listenedEvent].indexOf(callback)!==-1){
				listeners[listenedEvent].splice(listeners[listenedEvent].indexOf(callback),1);
			}
		}
	}

	var notifyEvent = function(triggeredEvent,params,triggeredByUser){
		if(!listeners){
			return;
		}
		params = params || {};
		params.triggeredByUser = !(triggeredByUser===false);
		var eventListeners = listeners[triggeredEvent];
		if(eventListeners){
			for(var i=0; i<eventListeners.length; i++){
				eventListeners[i](params);
			}
		}
	}

	return {
			init 				: init,
			notifyEvent			: notifyEvent,
			registerCallback 	: registerCallback,
			unRegisterCallback 	: unRegisterCallback
	};

}) (VISH,jQuery);
