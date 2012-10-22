VISH.Events.Mashme = (function(V,$,undefined){
	var addedEventListeners = false;
	var MASHME_API_SCRIPT_URL = "https://mashme.tv/static/js/iframe/MashMe.API.iFrame.js";
	//var MASHME_API_SCRIPT_URL = "js/MashMe.API.iFrame.js";
	var MASHME_HELLO = "MASHMETV_HELLO";
	var GO_TO_SLIDE = "GO_TO_SLIDE";
	var FC_POI_CLICK = "FC_POI_CLICK";
	var FC_CLOSE_SLIDE = "FC_CLOSE_SLIDE";


	/**
	 * function that waits for a mashe hello message and if so inits all the events for synchronization
	 */
	var onMashmeHello = function(message){
		// V.Debugging.log("Recibiendo:" + message.data + " from:" + message.origin);
		if(message.data === MASHME_HELLO){
			window.removeEventListener("message", V.Slides.onMashmeHello, false);
			V.Events.unbindAllEventListeners();
			init();
		} else {
			// V.Debugging.log("WARNING unknown message received from " + message.origin + " with data: " + message.data);
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
			if(V.SlideManager.getPresentationType() === "presentation"){
				$(document).bind('keydown', handleBodyKeyDown); 
	      		$(document).on('click', '#page-switcher-start', "back", _sendSlideNumber);
	      		$(document).on('click', '#page-switcher-end', "forward", _sendSlideNumber);
      		} else if(V.SlideManager.getPresentationType() === "flashcard"){
      			//flashcard mode      			
      			var presentation = V.SlideManager.getCurrentPresentation();
				//and now we add the points of interest with their click events to show the slides
  				for(index in presentation.background.pois){
  					var poi = presentation.background.pois[index];
  					$(document).on('click', "#" + poi.id,  { slide_id: poi.slide_id}, _sendFlashcardPoiClicked);
  				}

      			$(document).on('click','.close_slide', _sendFlashcardCloseSlideClicked);
      			

      		}
	    	addedEventListeners = true;
		}
	};


	/* Event listeners */
	var handleBodyKeyDown = function(event) {
	  var click = {};
	  switch (event.keyCode) {
	    case 39: // right arrow	    
	    case 40: // down arrow
	      if(V.Slides.isSlideFocused()) {
	      		click.data = "forward";
			    _sendSlideNumber(click);
			    event.preventDefault();
	      }
	      break;
	    case 37: // left arrow
	    case 38: // up arrow
	    	if(V.Slides.isSlideFocused()) {
	    		click.data = "back";
				_sendSlideNumber(click);
	    		event.preventDefault();    		
	    	}
	    	break;	     
	  }
	};

	

	var _sendSlideNumber = function(click){   
		var slideNumber = VISH.Slides.getCurrentSlideNumber();
		if(click && click.data === "back"){
			slideNumber -=1;
		} else {
			slideNumber +=1;
		}       
		_sendMessage(GO_TO_SLIDE, slideNumber);
	};

	/**
	 * function called when a poi is clicked
	 */
	 var _sendFlashcardPoiClicked = function(event){
	 	V.Debugging.log("Show slide " + event.data.slide_id);
    	_sendMessage(FC_POI_CLICK, event.data.slide_id);
	 };


   var _sendFlashcardCloseSlideClicked = function(event){
	    var close_slide = event.target.id.substring(5); //the id is close3
	    V.Debugging.log("Close slide " + close_slide);
	    _sendMessage(FC_CLOSE_SLIDE, close_slide);
   };


	var _sendMessage = function(message, params){
		V.Debugging.log("Enviando:" + message + " params:" + params);
		MASHME.API.iFrame.broadcast("MashMeAPIMessage:" + message + "//" + params);
	};


	var _onMashmeMessage = function(message){
		// V.Debugging.log("Recibiendo:" + message.data + " from:" + message.origin);
		var command = message.data.substring(message.data.indexOf(":")+1, message.data.indexOf("//"));
		var data = message.data.substring(message.data.indexOf("//")+2);
		switch (command) {
			case GO_TO_SLIDE:
				V.Debugging.log("Message GO_TO_SLIDE: " + data);
				V.Slides.goToSlide(data);
				break;
			case FC_POI_CLICK:
				V.Debugging.log("Message FC_POI_CLICK: " + data);
				V.Slides.closeAllSlides();
				V.Slides.showSlide(data);
				break;
			case FC_CLOSE_SLIDE:
				V.Debugging.log("Message FC_CLOSE_SLIDE: " + data);
				V.Slides.closeSlide(data);
				break;
			default: 
				V.Debugging.log("WARNING: Message not known " + message);
		}
	};

	return {
			init 			: init,
			onMashmeHello	: onMashmeHello
	};

}) (VISH,jQuery);