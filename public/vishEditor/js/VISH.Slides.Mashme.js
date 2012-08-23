VISH.Slides.Mashme = (function(V,$,undefined){
	var addedEventListeners = false;
	var MASHME_API_SCRIPT_URL = "https://mashme.tv/static/js/iframe/MashMe.API.iFrame.js";
	//var MASHME_API_SCRIPT_URL = "js/MashMe.API.iFrame.js";
	var mashme_hello = "MASHMETV_HELLO";

	/**
	 * function that waits for a mashe hello message and if so inits all the events for synchronization
	 */
	var onMashmeHello = function(message){
		V.Debugging.log("Recibiendo:" + message.data + " from:" + message.origin);
		if(message.data === mashme_hello){
			V.Slides.Events.unbindAll();
			window.removeEventListener("message", V.Slides.onMashmeHello, false);
			init();
		}
		else{
			V.Debugging.log("WARNING unknown message received from " + message.origin + " with data: " + message.data);
		}
	};

	var init = function() {
	  //dinamically load mashme API
	  $.getScript(MASHME_API_SCRIPT_URL).done(function(script, textStatus) {  		
  			MASHME.API.iFrame.init("myappkey","myappsecret", _onMashmeMessage);
	  });
	  addEventListeners();	  
	};

                   
	var addEventListeners = function() {
		if(!addedEventListeners){
			$(document).bind('keydown', handleBodyKeyDown); 
      		$(document).on('click', '#page-switcher-start', _sendBackward);
      		$(document).on('click', '#page-switcher-end', _sendForward);		
	    	addedEventListeners = true;
		} 
	};


	/* Event listeners */
	var handleBodyKeyDown = function(event) {
	  switch (event.keyCode) {
	    case 39: // right arrow	    
	    case 40: // down arrow
	      if(V.Slides.isSlideFocused()) {
			    _sendForward();
			    event.preventDefault();
	      }
	      break;
	    case 37: // left arrow
	    case 38: // up arrow
	    	if(V.Slides.isSlideFocused()) {
				_sendBackward();
	    		event.preventDefault();    		
	    	}
	    	break;	     
	  }
	};

	var _onMashmeMessage = function(message){
		V.Debugging.log("Recibiendo:" + message.data + " from:" + message.origin);
		var command = message.data.substring(message.data.indexOf(":")+1);
		switch (command) {
			case "backwardOneSlide":
				V.Debugging.log("backwardOneSlide");
				V.Slides.backwardOneSlide();
				break;
			case "forwardOneSlide":
				V.Debugging.log("forwardOneSlide");
				V.Slides.forwardOneSlide();
				break;	
		}
	};

	var _sendForward = function(){
		_sendMessage("forwardOneSlide");
	};

	var _sendBackward = function(){
		_sendMessage("backwardOneSlide");
	};

	var _sendMessage = function(message){                
		MASHME.API.iFrame.broadcast("MashMeAPIMessage:" + message);            
	};

	return {
			init 			: init,
			onMashmeHello	: onMashmeHello
	};

}) (VISH,jQuery);