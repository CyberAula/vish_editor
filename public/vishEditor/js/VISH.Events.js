VISH.Events = (function(V,$,undefined){
	var bindedEventListeners = false;
	var PM_TOUCH_SENSITIVITY = 200; //initially this was 15
	var MINIMUM_ZOOM_TO_ENABLE_SCROLL = 1.2; 
	var registeredEvents = [];
	var isSlaveMode;

	/**
	 * method to detect if keys present, if touch screen present or mashme integration
	 * and setup the events and interaction accordingly
	 */
	var init = function() {
	  bindAllEventListeners();
	  
	  if(!V.Editing){
	  		if(typeof V.Events.Mashme != "undefined"){
	  			//wait for mashme hello message and if so init events
	  			window.addEventListener("message", V.Events.Mashme.onMashmeHello, false);  
	  		}
	  	}
	};


	/* Register events */
	var _registerEvent = function(eventTargetId){
		if(registeredEvents.indexOf(eventTargetId)==-1){
			registeredEvents.push(eventTargetId);
		}
	};

	var _unregisterEvent = function(eventTargetId){
		if(registeredEvents.indexOf(eventTargetId)!=-1){
			registeredEvents.splice(registeredEvents.indexOf(eventTargetId), 1);
		}
	};

	/* Event listeners */
	var handleBodyKeyDown = function(event) {
	  switch (event.keyCode) {
	    case 39: // right arrow	    
	    case 40: // down arrow
	      if(V.Slides.isSlideFocused()) {
			    V.Slides.forwardOneSlide();
			    event.preventDefault();
	      }
	      break;
	    case 37: // left arrow
	    case 38: // up arrow
	    	if(V.Slides.isSlideFocused()) {
				V.Slides.backwardOneSlide();
	    		event.preventDefault();    		
	    	}
	    	break;	     
	  }
	};

	/* Touch events */

	/* method by KIKE to get the touches of an event
	 * jquery does not pass the touches property in the event, and we get them from the event.originalEvent
	 */
	var getTouches = function (event){
		if(event.touches){
			return event.touches;
		}
		else if(event.originalEvent.touches){
			return event.originalEvent.touches;
		}
		else{
			return null;
		}
	};


	var handleTouchStart = function(event) {
	  if(V.SlideManager.getPresentationType() === "presentation"){
			  var touches = getTouches(event);
			  if (touches.length === 1) {
			    touchDX = 0;
			    touchDY = 0;

			    touchStartX = touches[0].pageX;
			    touchStartY = touches[0].pageY;

			    document.body.addEventListener('touchmove', handleTouchMove, true);
			    document.body.addEventListener('touchend', handleTouchEnd, true);
			    var zoom = document.documentElement.clientWidth / window.innerWidth;

			    var eventNotRegister = (registeredEvents.indexOf(event.target.id)==-1);
			    if(zoom < MINIMUM_ZOOM_TO_ENABLE_SCROLL && eventNotRegister){    	 
			    	//this is because if not done, the browser can take control of the event and cancels it, 
			    	//because it thinks that the touch is a scroll action, so we prevent default if the zoom is lower than 1.5, 
			    	//and there will be no scroll below that zoom level
			    	event.preventDefault(); 
			    }
			  }
		}
	};

	var handleTouchMove = function(event) {
		if(V.SlideManager.getPresentationType() === "presentation"){
		  var touches = getTouches(event);
		  if (touches.length > 1) {
		    cancelTouch();
		  } else {
		    touchDX = touches[0].pageX - touchStartX;
		    touchDY = touches[0].pageY - touchStartY;
		    var zoom = document.documentElement.clientWidth / window.innerWidth;	  	
		  	if(zoom < MINIMUM_ZOOM_TO_ENABLE_SCROLL){
		    	event.preventDefault();  //this is because if not done, the browser can take control of the event and cancels it, because it thinks that the touch is a scroll action
		  	}
		  }
	    }
	};

	var handleTouchEnd = function(event) {
		if(V.SlideManager.getPresentationType() === "presentation"){
		  var dx = Math.abs(touchDX);
		  var dy = Math.abs(touchDY);

		  if ((dx > PM_TOUCH_SENSITIVITY) && (dy < (dx * 2 / 3))) {
		    if (touchDX > 0) {
		      V.Slides.backwardOneSlide();
		    } else {
		      V.Slides.forwardOneSlide();
		    }
		  }
		  
		  cancelTouch();
		}
	};

	var cancelTouch = function() {
	  document.body.removeEventListener('touchmove', handleTouchMove, true);
	  document.body.removeEventListener('touchend', handleTouchEnd, true); 
	};

	/**
	 * function called when a poi is clicked
	 */
	 var _onFlashcardPoiClicked = function(event){
	 	V.Debugging.log("Show slide " + event.data.slide_id);
    	V.Slides.showSlide(event.data.slide_id);
	 };


   var _onFlashcardCloseSlideClicked = function(event){
	    var close_slide = event.target.id.substring(5); //the id is close3
	    V.Debugging.log("Close slide " + close_slide);
	    V.Slides.closeSlide(close_slide);
   };


   var bindAllEventListeners = function(){
   		if(!bindedEventListeners){
			if(V.SlideManager.getPresentationType() === "presentation"){
				$(document).bind('keydown', handleBodyKeyDown); 
	      		$(document).on('click', '#page-switcher-start', V.Slides.backwardOneSlide);
	      		$(document).on('click', '#page-switcher-end', V.Slides.forwardOneSlide);
	      		_registerEvent("mobile_back_arrow");
	      		$(document).on('click', '#mobile_back_arrow', V.Slides.backwardOneSlide);
	      		_registerEvent("mobile_forward_arrow");
	      		$(document).on('click', '#mobile_forward_arrow', V.Slides.forwardOneSlide);	
	      		_registerEvent("closeButton");
	      		_registerEvent("closeButtonImg");
	      		$(document).on('click', '#closeButton', function(){
	      			window.top.location.href = V.SlideManager.getOptions()["comeBackUrl"];
	      		});
	 			 $(document).bind('touchstart', handleTouchStart); 
	      	} else if(V.SlideManager.getPresentationType() === "flashcard"){
				var presentation = V.SlideManager.getCurrentPresentation();
				//and now we add the points of interest with their click events to show the slides
  				for(index in presentation.background.pois){
  					var poi = presentation.background.pois[index];
  					$(document).on('click', "#" + poi.id,  { slide_id: poi.slide_id}, _onFlashcardPoiClicked);
  				}
      			$(document).on('click','.close_slide', _onFlashcardCloseSlideClicked);
  		   	} 	
		} 
		bindedEventListeners = true;
   }

	var unbindAllEventListeners = function(){
		if(bindedEventListeners){
			if(V.SlideManager.getPresentationType() === "presentation"){
				$(document).unbind('keydown', handleBodyKeyDown); 
		  		$(document).off('click', '#page-switcher-start', V.Slides.backwardOneSlide);
		  		$(document).off('click', '#page-switcher-end', V.Slides.forwardOneSlide);
		  		_unregisterEvent("mobile_back_arrow");
		  		$(document).off('click', '#mobile_back_arrow', V.Slides.backwardOneSlide);
		  		_unregisterEvent("mobile_forward_arrow");
		  		$(document).off('click', '#mobile_forward_arrow', V.Slides.forwardOneSlide);
		  		_unregisterEvent("closeButton");
		  		_unregisterEvent("closeButtonImg");
		  		$(document).off('click', '#closeButton');
		  		$(document).unbind('touchstart', handleTouchStart); 
	  		} else if(V.SlideManager.getPresentationType() === "flashcard"){
				var presentation = V.SlideManager.getCurrentPresentation();
				//and now we add the points of interest with their click events to show the slides
				for(index in presentation.background.pois){
					var poi = presentation.background.pois[index];
					$(document).off('click', "#" + poi.id,  { slide_id: poi.slide_id}, _onFlashcardPoiClicked);
				}
				$(document).off('click','.close_slide', _onFlashcardCloseSlideClicked);
	  		}
	  		bindedEventListeners = false;
		}
	};

	var setSlaveMode = function(slaveMode){
		console.log("setSlaveMode " + slaveMode);
		if(slaveMode!==isSlaveMode){
			if(slaveMode){
				unbindAllEventListeners();
				VISH.VideoPlayer.HTML5.showControls(false);
				VISH.VideoPlayer.Youtube.setSlaveMode(true);
				isSlaveMode=true;
			} else {
				bindAllEventListeners();
				VISH.VideoPlayer.HTML5.showControls(true);
				VISH.VideoPlayer.Youtube.setSlaveMode(false);
				isSlaveMode=false;
			}
		}
	}

	var isSlaveMode = function(){
		return isSlaveMode;
	}
	
	
	return {
			init 		: init,
			bindAllEventListeners	: bindAllEventListeners,
			unbindAllEventListeners	: unbindAllEventListeners,
			setSlaveMode			: setSlaveMode,
			isSlaveMode 			: isSlaveMode
	};

}) (VISH,jQuery);