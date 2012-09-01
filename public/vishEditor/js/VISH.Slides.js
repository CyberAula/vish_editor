VISH.Slides = (function(V,$,undefined){

	/* Variables to store slide elements and point to current slide*/
	var slideEls;
	var curSlide;
	var SLIDE_CLASSES = ['far-past', 'past', 'current', 'next', 'far-next'];
	
	var init = function(){
		getCurSlideFromHash();
		$(document).bind('OURDOMContentLoaded', handleDomLoaded);		
	};

	var handleDomLoaded = function () {
	  slideEls = document.querySelectorAll('section.slides > article');

	  addFontStyle();
	  
	  updateSlides();
	  
	  V.Slides.Events.init();
	  if(!V.Editing){
	  	if(typeof V.Slides.Mashme != "undefined"){
	  		//wait for mashme hello message and if so init events
	  		window.addEventListener("message", V.Slides.Mashme.onMashmeHello, false);  
	  	}
	  }
	  
	  $('body').addClass('loaded');
	};


	var getCurrentSlide = function(){
		return curSlide;
	}

	var getCurrentSlideNumber = function(){
		return curSlide+1;
	}

	var setCurrentSlideNumber = function(currentSlideNumber){
		curSlide = currentSlideNumber-1;
	}

	var setCurrentSlide = function(currentSlide){
		curSlide = currentSlide;
	}

	var getSlides = function(){
		return slideEls;
	}

	var isCurrentFirstSlide = function(){
		return curSlide===0;
	}

	var isCurrentLastSlide = function(){
		return curSlide===slideEls.length-1;
	}

	var isSlideSelected = function(){
		if(curSlide>-1){
			return true;
		}
	}

	var onDeleteSlide = function(){
		setCurrentSlide(getCurrentSlide()-1);
	}

	var getNumberOfSlide = function(slide){
		if(slideEls){
			var result = 0;
			$.each(slideEls, function(index, value) { 
		  		if($(value).attr("id")==$(slide).attr("id")){
		  			result = index;
		  			return;
		  		}
			});
			return result;
		} else {
			return 0;
		}
	}


	/* Slide movement */

	var getSlideEl = function(no) {
	  if ((no < 0) || (no >= slideEls.length)) { 
	    return null;
	  } else {
	    return slideEls[no];
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
	  for (var i = 0; i < slideEls.length; i++) {
	    switch (i) {
	      case curSlide - 2:
	        updateSlideClass(i, 'far-past');
	        break;
	      case curSlide - 1:
	        updateSlideClass(i, 'past');
	        break;
	      case curSlide: 
	        updateSlideClass(i, 'current');
	        break;
	      case curSlide + 1:
	        updateSlideClass(i, 'next');      
	        break;
	      case curSlide + 2:
	        updateSlideClass(i, 'far-next');      
	        break;
	      default:
	        updateSlideClass(i);
	        break;
	    }
	  }
	  
	  if(goingRight){
	    triggerLeaveEvent(curSlide - 1);
	  } else {
	    triggerLeaveEvent(curSlide + 1);    
	  }
	  triggerEnterEvent(curSlide);
	  updateHash();
	};

	
	var _prevSlide = function() {
	  if (curSlide > 0) {
	    curSlide--;
	    updateSlides(false);
	  }
	};

	var _nextSlide = function() {	  
	  if (curSlide < slideEls.length - 1) {
	    curSlide++;
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


	/* Hash functions */

	var getCurSlideFromHash = function() {
	  var slideNo = parseInt(location.hash.substr(1));

	  if (slideNo) {
	    curSlide = slideNo - 1;
	  } else {
	    curSlide = -1;
	  }
	};

	var updateHash = function() {
	  location.replace('#' + (curSlide + 1));
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
   * Go to the last slide when adding a new one
   */
  var lastSlide = function(){
    goToSlide(slideEls.length);
  };

  /**
   * go to the slide when clicking the thumbnail
   */
  var goToSlide = function(no){	
    if((no > slideEls.length) || (no <= 0)){
  	  return;
    } else if (no > curSlide+1){
  	  while (curSlide+1 < no) {
    	 _nextSlide();
  	  }
    } else if (no < curSlide+1){
  	  while (curSlide+1 > no) {
    	 _prevSlide();
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
		goToSlide(curSlide);
	};

	/**
	* function to go to next slide and change the thumbnails and focus 
	*/
	var forwardOneSlide = function(){
		goToSlide(curSlide+2);
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

	/**
	 * function to show one specific slide in the flashcard
	 */
	var showSlide = function(slide_id){
		if(V.slideEls.length >= slide_id-1){
			$(V.slideEls[slide_id-1]).show();
			triggerEnterEvent(slide_id-1);
		}
	};

	/**
	 * function to close one specific slide in the flashcard
	 */
	var closeSlide = function(slide_id){
		if(V.slideEls.length >= slide_id-1){
			$(V.slideEls[slide_id-1]).hide();
			triggerLeaveEvent(slide_id-1);
		}
	};

	
	return {	
			init          			: init,
			getCurrentSlide			: getCurrentSlide,		
			setCurrentSlide			: setCurrentSlide,	
			getCurrentSlideNumber	: getCurrentSlideNumber,
			setCurrentSlideNumber	: setCurrentSlideNumber,
			isCurrentFirstSlide		: isCurrentFirstSlide,
			isCurrentLastSlide		: isCurrentLastSlide,
			isSlideSelected 		: isSlideSelected,
			onDeleteSlide			: onDeleteSlide,
			getNumberOfSlide		: getNumberOfSlide,
			getSlides 				: getSlides,
			backwardOneSlide		: backwardOneSlide,	
			closeSlide				: closeSlide,	
			forwardOneSlide			: forwardOneSlide,
			goToSlide				: goToSlide,
			lastSlide				: lastSlide,
			isSlideFocused			: isSlideFocused,
			showSlide				: showSlide
	};

}) (VISH,jQuery);