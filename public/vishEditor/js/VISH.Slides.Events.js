VISH.Slides.Events = (function(V,$,undefined){
	var addedEventListeners = false;
	var PM_TOUCH_SENSITIVITY = 200; //initially this was 15
	var MINIMUM_ZOOM_TO_ENABLE_SCROLL = 1.2; 

	/**
	 * method to detect if keys present, if touch screen present or mashme integration
	 * and setup the events and interaction accordingly
	 */
	var init = function() {
	  addEventListeners();
	  /* Swiping */
	  $(document).bind('touchstart', handleTouchStart); 
	};

	var addEventListeners = function() {
		if(!addedEventListeners){
			$(document).bind('keydown', handleBodyKeyDown); 
      		$(document).on('click', '#page-switcher-start', V.Slides.backwardOneSlide);
      		$(document).on('click', '#page-switcher-end', V.Slides.forwardOneSlide);
      		$(document).on('click', '#mobile_back_arrow', function(){
      			console.log("entra back");
      			V.Slides.backwardOneSlide();});
      		$(document).on('click', '#mobile_forward_arrow', function(){
      			console.log("entra back");
      			V.Slides.forwardOneSlide();});		
	    	addedEventListeners = true;
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
	  var touches = getTouches(event);
	  if (touches.length === 1) {
	    touchDX = 0;
	    touchDY = 0;

	    touchStartX = touches[0].pageX;
	    touchStartY = touches[0].pageY;

	    document.body.addEventListener('touchmove', handleTouchMove, true);
	    document.body.addEventListener('touchend', handleTouchEnd, true);
	    var zoom = document.documentElement.clientWidth / window.innerWidth;
	    if(zoom < MINIMUM_ZOOM_TO_ENABLE_SCROLL && event.target.id !== "mobile_forward_arrow" && event.target.id !== "mobile_back_arrow"){    	 
	    	//this is because if not done, the browser can take control of the event and cancels it, 
	    	//because it thinks that the touch is a scroll action, so we prevent default if the zoom is lower than 1.5, 
	    	//and there will be no scroll below that zoom level
	    	event.preventDefault(); 
	    }
	  }
	};

	var handleTouchMove = function(event) {
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
	  
	};

	var handleTouchEnd = function(event) {
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
	};

	var cancelTouch = function() {
	  document.body.removeEventListener('touchmove', handleTouchMove, true);
	  document.body.removeEventListener('touchend', handleTouchEnd, true); 
	};


	var unbindAll = function(){
		$(document).unbind('keydown', handleBodyKeyDown); 
  		$(document).off('click', '#page-switcher-start', V.Slides.backwardOneSlide);
  		$(document).off('click', '#page-switcher-end', V.Slides.forwardOneSlide);
  		$(document).off('click', '#mobile_back_arrow', V.Slides.backwardOneSlide);
  		$(document).off('click', '#mobile_forward_arrow', V.Slides.forwardOneSlide);
  		$(document).unbind('touchstart', handleTouchStart); 
	};

	
	
	return {
			init 		: init,
			unbindAll	: unbindAll
	};

}) (VISH,jQuery);