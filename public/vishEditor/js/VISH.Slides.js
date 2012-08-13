VISH.Slides = (function(V,$,undefined){
	/*
	 * 
	 */
	var SLIDE_CLASSES = ['far-past', 'past', 'current', 'next', 'far-next'];
	var PM_TOUCH_SENSITIVITY = 200; //initially this was 15


	var init = function(){
		getCurSlideFromHash();

		$(document).bind('OURDOMContentLoaded', handleDomLoaded);		
	};

	var handleDomLoaded = function () {
	  V.slideEls = document.querySelectorAll('section.slides > article');

	  addFontStyle();
	  
	  updateSlides();

	  setupInteraction();

	  addEventListeners();

	  $('body').addClass('loaded');
	};


	/* Slide movement */

	var getSlideEl = function(no) {
	  if ((no < 0) || (no >= V.slideEls.length)) { 
	    return null;
	  } else {
	    return V.slideEls[no];
	  }
	};

	var updateSlideClass = function(slideNo, className) {
	  var el = getSlideEl(slideNo);
	  
	  if (!el) {
	    return;
	  }
	  
	  if (className) {
	    $(el).addClass(className);
	  }
	    
	  for (var i in SLIDE_CLASSES) {
	    if (className != SLIDE_CLASSES[i]) {
	      $(el).removeClass(SLIDE_CLASSES[i]);
	    }
	  }
	};


	//MODIFIED BY KIKE TO DETERMINE IF GOING RIGHT OR LEFT
	var updateSlides = function(goingRight) {
	  for (var i = 0; i < V.slideEls.length; i++) {
	    switch (i) {
	      case V.curSlide - 2:
	        updateSlideClass(i, 'far-past');
	        break;
	      case V.curSlide - 1:
	        updateSlideClass(i, 'past');
	        break;
	      case V.curSlide: 
	        updateSlideClass(i, 'current');
	        break;
	      case V.curSlide + 1:
	        updateSlideClass(i, 'next');      
	        break;
	      case V.curSlide + 2:
	        updateSlideClass(i, 'far-next');      
	        break;
	      default:
	        updateSlideClass(i);
	        break;
	    }
	  }
	  
	  if(goingRight){
	    triggerLeaveEvent(V.curSlide - 1);
	  }
	  else{
	    triggerLeaveEvent(V.curSlide + 1);    
	  }
	  triggerEnterEvent(V.curSlide);
	  updateHash();
	};

	
	var prevSlide = function() {
	  if (V.curSlide > 0) {
	    V.curSlide--;

	    updateSlides(false);
	  }
	};

	var nextSlide = function() {	  
	  if (V.curSlide < V.slideEls.length - 1) {
	    V.curSlide++;

	    updateSlides(true);
	  }
	};


	/* Slide events */

	var triggerEnterEvent = function (no) {
	  
	  var el = getSlideEl(no);
	  if (!el) {
	    return;
	  }

	  var onEnter = el.getAttribute('onslideenter');
	  if (onEnter) {
	    new Function(onEnter).call(el);
	  }

	  var evt = document.createEvent('Event');
	  evt.initEvent('slideenter', true, true);
	  evt.slideNumber = no + 1; // Make it readable

	  el.dispatchEvent(evt);
	};

	var triggerLeaveEvent = function(no) {
	  var el = getSlideEl(no);
	  if (!el) {    
	    return;
	  }

	  var onLeave = el.getAttribute('onslideleave');
	  if (onLeave) {
	    new Function(onLeave).call(el);
	  }

	  var evt = document.createEvent('Event');
	  evt.initEvent('slideleave', true, true);
	  evt.slideNumber = no + 1; // Make it readable
	  
	  el.dispatchEvent(evt);
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
	    if(zoom < 1.5){    	 
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
	  	//if you are zooming don´t pass the slide, you will move the full slide as it is zoomed
	  	if(zoom < 1.5){
	    	event.preventDefault();  //this is because if not done, the browser can take control of the event and cancels it, because it thinks that the touch is a scroll action
	  	}
	  }
	  
	};

	var handleTouchEnd = function(event) {
	  var dx = Math.abs(touchDX);
	  var dy = Math.abs(touchDY);

	  if ((dx > PM_TOUCH_SENSITIVITY) && (dy < (dx * 2 / 3))) {
	    if (touchDX > 0) {
	      backwardOneSlide();
	    } else {
	      forwardOneSlide();
	    }
	  }
	  
	  cancelTouch();
	};

	var cancelTouch = function() {
	  document.body.removeEventListener('touchmove', handleTouchMove, true);
	  document.body.removeEventListener('touchend', handleTouchEnd, true); 
	};

	var setupInteraction = function() {
	  /* Swiping */
	  
	  //document.body.addEventListener('touchstart', handleTouchStart, false);
	  $(document).bind('touchstart', handleTouchStart); 
	}

	
	/* Hash functions */

	var getCurSlideFromHash = function() {
	  var slideNo = parseInt(location.hash.substr(1));

	  if (slideNo) {
	    V.curSlide = slideNo - 1;
	  } else {
	    V.curSlide = 0;
	  }
	};

	var updateHash = function() {
	  location.replace('#' + (V.curSlide + 1));
	};

	/**
	 * function to know if the slides have the focus or not
	 * @return false if other element (right now only wysiwyg instances are checked) has the focus
	 */
	var isSlideFocused = function() {
		if($(".wysiwygInstance").is(":focus")){
			return false;
		}
		return true;
	};

	/* Event listeners */

	var handleBodyKeyDown = function(event) {
	  switch (event.keyCode) {
	    case 39: // right arrow
	    case 34: // PgDn	
	      if(isSlideFocused()) {
			    forwardOneSlide();
			    event.preventDefault();
	      }
	      break;
	    case 37: // left arrow
	    	if(isSlideFocused()) {
				backwardOneSlide();
	    		event.preventDefault();    		
	    	}
	    	break;
	    case 33: // PgUp
	      backwardOneSlide();
	      event.preventDefault();
	      break;

	    case 40: // down arrow
	      if(isSlideFocused()) {
	      		forwardOneSlide();
	      		event.preventDefault();	
	      	}	      
	      break;

	    case 38: // up arrow
	     if(isSlideFocused()) {
				    backwardOneSlide();
				    event.preventDefault();     		
	      }	      
	      break;
	  }
	};

	var addedEventListeners = false;

	var addEventListeners = function() {
		if(!addedEventListeners){
			$(document).bind('keydown', handleBodyKeyDown);  
	    	addedEventListeners = true;
		} 
	};

	/* Initialization */

	var addFontStyle = function (){
	  var el = document.createElement('link');
	  el.rel = 'stylesheet';
	  el.type = 'text/css';
	  el.href = 'http://fonts.googleapis.com/css?family=' +
	            'Open+Sans:regular,semibold,italic,italicsemibold|Droid+Sans+Mono';

	  document.body.appendChild(el);
	};

	var addGeneralStyle = function() {
	 
	  var el = document.createElement('meta');
	  el.name = 'viewport';
	  el.content = 'width=900,height=750';
	  document.querySelector('head').appendChild(el);
	  
	  var el = document.createElement('meta');
	  el.name = 'apple-mobile-web-app-capable';
	  el.content = 'yes';
	  document.querySelector('head').appendChild(el);
	};

  /* slide movement */

  /**
   * go to the last slide when adding a new one
   */
  var lastSlide = function(){
    goToSlide(V.slideEls.length);
  };

  /**
   * go to the slide when clicking the thumbnail
   * curSlide is set by slides.js and it is between 0 and the number of slides, so we add 1 in the if conditions
   */
  var goToSlide = function(no){
  	
    if((no > V.slideEls.length) || (no <= 0)){
  	  return;
    } else if (no > V.curSlide+1){
  	  while (V.curSlide+1 < no) {
    	 nextSlide();
  	  }
    } else if (no < V.curSlide+1){
  	  while (V.curSlide+1 > no) {
    	 prevSlide();
  	  }
    }
    
    if(VISH.Editing){
  		//first deselect zone if anyone was selected
  		$(".selectable").css("border-style", "none");
			
			VISH.Editor.Tools.cleanZoneTools();
  		
  		//finally add a background color to thumbnail of the selected slide
    	V.Editor.Thumbnails.selectThumbnail(no);    	
  	}	else {
  		//update slide counter
  		V.SlideManager.updateSlideCounter();
  	}
  };
  
  /**
   * function to go to previous slide and change the thumbnails and focus 
   */
  var backwardOneSlide = function(){
  	goToSlide(V.curSlide);
  };
  
  /**
   * function to go to next slide and change the thumbnails and focus 
   */
  var forwardOneSlide = function(){
  	goToSlide(V.curSlide+2);
  };
	

	
	return {
			addEventListeners 		: addEventListeners,	
			backwardOneSlide		: backwardOneSlide,		
			forwardOneSlide			: forwardOneSlide,
			goToSlide				: goToSlide,
			init          			: init,
			nextSlide				: nextSlide,
			prevSlide				: prevSlide,
			lastSlide				: lastSlide
	};

}) (VISH,jQuery);