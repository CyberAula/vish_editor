VISH.Slides.Mashme = (function(V,$,undefined){
	var addedEventListeners = false;
	var MASHME_API_SCRIPT_URL = "https://mashme.tv/static/js/iframe/MashMe.API.iFrame.js";
	//var MASHME_API_SCRIPT_URL = "js/MashMe.API.iFrame.js";
	var MASHME_HELLO = "MASHMETV_HELLO";
	var GO_TO_SLIDE = "GO_TO_SLIDE";


	/**
	 * function that waits for a mashe hello message and if so inits all the events for synchronization
	 */
	var onMashmeHello = function(message){
		V.Debugging.log("Recibiendo:" + message.data + " from:" + message.origin);
		if(message.data === MASHME_HELLO){
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
      		$(document).on('click', '#page-switcher-start', "back", _sendSlideNumber);
      		$(document).on('click', '#page-switcher-end', "forward", _sendSlideNumber);		
	    	addedEventListeners = true;
		}
	};


	/* Event listeners */
	var handleBodyKeyDown = function(event) {
	  switch (event.keyCode) {
	    case 39: // right arrow	    
	    case 40: // down arrow
	      if(V.Slides.isSlideFocused()) {
			    __sendSlideNumber("forward");
			    event.preventDefault();
	      }
	      break;
	    case 37: // left arrow
	    case 38: // up arrow
	    	if(V.Slides.isSlideFocused()) {
				_sendSlideNumber("back");
	    		event.preventDefault();    		
	    	}
	    	break;	     
	  }
	};

	var _onMashmeMessage = function(message){
		V.Debugging.log("Recibiendo:" + message.data + " from:" + message.origin);
		var command = message.data.substring(message.data.indexOf(":")+1, message.data.indexOf("//"));
		var data = message.data.substring(message.data.indexOf("//")+2);
		switch (command) {
			case GO_TO_SLIDE:
				V.Debugging.log("Message GO_TO_SLIDE: " + data);
				V.Slides.goToSlide(data);
				break;
			default: 
				V.Debugging.log("WARNING: Message not known " + message);
		}
	};

	var _sendSlideNumber = function(click){   
		var slideNumber = VISH.Slides.getCurrentSlideNumber();
		if(click === "back"){
			slideNumber -=1;
		} else {
			slideNumber +=1;
		}           
		MASHME.API.iFrame.broadcast("MashMeAPIMessage:" + GO_TO_SLIDE + "//" + slideNumber);     
	};

	return {
			init 			: init,
			onMashmeHello	: onMashmeHello
	};

}) (VISH,jQuery);