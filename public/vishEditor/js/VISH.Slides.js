VISH.Slides = (function(V,$,undefined){

	/* Variables to store slide elements and point to current slide*/
	var slideEls;
	var curSlideIndex;
	var SLIDE_CLASSES = ['far-past', 'past', 'current', 'next', 'far-next'];
	
	var init = function(){
		getcurSlideIndexFromHash();
		$(document).bind('OURDOMContentLoaded', handleDomLoaded);		
	};

	var handleDomLoaded = function () {
	  slideEls = document.querySelectorAll('section.slides > article');
	  addFontStyle();
	  updateSlides(); 
	  $('body').addClass('loaded');
	};


	var getCurrentSlide = function(){
		return slideEls[curSlideIndex];
	}

	var getCurrentSlideNumber = function(){
		return curSlideIndex+1;
	}

	var setCurrentSlideNumber = function(currentSlideNumber){
		curSlideIndex = currentSlideNumber-1;
	}

	var getSlides = function(){
		return slideEls;
	}

	var isCurrentFirstSlide = function(){
		return curSlideIndex===0;
	}

	var isCurrentLastSlide = function(){
		return curSlideIndex===slideEls.length-1;
	}

	var isSlideSelected = function(){
		if(curSlideIndex>-1){
			return true;
		}
	}

	var onDeleteSlide = function(){
		setCurrentSlideNumber(getCurrentSlideNumber()-1);
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

	var _getSlide = function(no) {
	  return getSlideWithNumber(no+1);
	};

	var getSlideWithNumber = function(slideNumber) {
	  var no = slideNumber-1;
	  if ((no < 0) || (no >= slideEls.length)) { 
	    return null;
	  } else {
	    return slideEls[no];
	  }
	};

	var updateSlideClass = function(slideNo, className) {
	  var el = _getSlide(slideNo);
	  
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


	var updateSlides = function(goingRight) {
	 
	  _updateSlideEls();

	  if(goingRight){
	    triggerLeaveEvent(curSlideIndex - 1);
	  } else {
	    triggerLeaveEvent(curSlideIndex + 1);    
	  }
	  triggerEnterEvent(curSlideIndex);
	  updateHash();
	};


	var _updateSlideEls = function() {
		for (var i = 0; i < slideEls.length; i++) {
			switch (i) {
				case curSlideIndex - 2:
					updateSlideClass(i, 'far-past');
					break;
				case curSlideIndex - 1:
					updateSlideClass(i, 'past');
					break;
				case curSlideIndex: 
					updateSlideClass(i, 'current');
					break;
				case curSlideIndex + 1:
					updateSlideClass(i, 'next');      
					break;
				case curSlideIndex + 2:
					updateSlideClass(i, 'far-next');      
					break;
				default:
					updateSlideClass(i);
					break;
			}
		}
	}

	
	var _prevSlide = function() {
	  if (curSlideIndex > 0) {
	    curSlideIndex--;
	    updateSlides(false);
	  }
	};

	var _nextSlide = function() {	  
	  if (curSlideIndex < slideEls.length - 1) {
	    curSlideIndex++;
	    updateSlides(true);
	  }
	};


	/* Slide events */

	var triggerEnterEvent = function (no) {
	  
	  var el = _getSlide(no);
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
	  var el = _getSlide(no);
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

	var getcurSlideIndexFromHash = function() {
	  var slideNo = parseInt(location.hash.substr(1));
	  if (slideNo) {
	    curSlideIndex = slideNo - 1;
	  } else {
	  	if(VISH.Editing){
	  		curSlideIndex = -1; //Start in 0 (no slides)
	  	} else {
	  		curSlideIndex = 0; //Start in 1 (first slide)
	  	}
	  }
	};

	var updateHash = function() {
	  location.replace('#' + (curSlideIndex + 1));
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
  var goToSlide = function(no,triggeredByUser){

  	if(no === getCurrentSlideNumber()){
  		//Do nothing
  		return;
  	};

    if((no > slideEls.length) || (no <= 0)){
  	  return;
    } else if (no > curSlideIndex+1){
  	  while (curSlideIndex+1 < no) {
    	 _nextSlide();
  	  }
    } else if (no < curSlideIndex+1){
  	  while (curSlideIndex+1 > no) {
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

	var params = new Object();
	params.slideNumber = no;
	VISH.Events.Notifier.notifyEvent(VISH.Constant.Event.onGoToSlide,params,triggeredByUser);
  };
  

	/**
	* function to go to previous slide and change the thumbnails and focus 
	*/
	var backwardOneSlide = function(){
		goToSlide(curSlideIndex);
	};

	/**
	* function to go to next slide and change the thumbnails and focus 
	*/
	var forwardOneSlide = function(){
		goToSlide(curSlideIndex+2);
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
		if(slideEls.length >= slide_id-1){
			$(slideEls[slide_id-1]).show();
			triggerEnterEvent(slide_id-1);
		}
	};

	/**
	 * function to close one specific slide in the flashcard
	 */
	var closeSlide = function(slide_id){
		$("#"+slide_id).hide();
		var slideNumber = $.inArray($("#"+slide_id)[0], slideEls);
		triggerLeaveEvent(slideNumber);		
	};

	/**
	 * function to close all slides in the flashcard, in case one remains open (used for mashme tv before receiving a show slide)
	 */
	var closeAllSlides = function(){
		$(".slides > article").hide();	
	};


	/*
	 *	Move slide_to_move after or before reference_slide.
	 *  Movement param posible values: "after", "before"
	 */
	var moveSlideTo = function(slide_to_move, reference_slide, movement){

	 	if((typeof slide_to_move === "undefined")||(typeof reference_slide === "undefined")){
	 		return;
	 	}

	 	if(typeof slide_to_move.length !== undefined){
	 		slide_to_move = $(slide_to_move)[0];
	 		if(typeof slide_to_move === "undefined"){
	 			return;
	 		}
	 	}

	 	if(typeof reference_slide.length !== undefined){
	 		reference_slide = $(reference_slide)[0];
	 		if(typeof reference_slide === "undefined"){
	 			return;
	 		}
	 	}

	 	if((slide_to_move.tagName!="ARTICLE")||(reference_slide.tagName!="ARTICLE")||(slide_to_move==reference_slide)){
	 		return;
	 	}


	 	var article_to_move = slide_to_move;
	 	var article_reference = reference_slide;


	 	var moving_current_slide = false;
	 	if(getCurrentSlide() === article_to_move){
	 		moving_current_slide = true;
	 	}

	 	$(article_to_move).remove();
	 	if(movement=="after"){
	 		$(article_reference).after(article_to_move);
	 	} else if(movement=="before") {
	 		$(article_reference).before(article_to_move);
	 	} else {
	 		VISH.Debugging.log("VISH.Slides: Error. Movement not defined... !");
	 		return;
	 	}

	 	//Update slideEls
	 	slideEls = document.querySelectorAll('section.slides > article');

	 	if(moving_current_slide){
	 		//Update currentSlide
	 		curSlideIndex = getNumberOfSlide(article_to_move);
	 	}

	 	//Update slides classes next and past.
	 	//Current slide needs to be stablished before this call.
	 	_updateSlideEls();
	 	
	 }
	
	return {	
			init          			: init,	
			getCurrentSlide 		: getCurrentSlide,
			getCurrentSlideNumber	: getCurrentSlideNumber,
			setCurrentSlideNumber	: setCurrentSlideNumber,
			isCurrentFirstSlide		: isCurrentFirstSlide,
			isCurrentLastSlide		: isCurrentLastSlide,
			isSlideSelected 		: isSlideSelected,
			onDeleteSlide			: onDeleteSlide,
			getNumberOfSlide		: getNumberOfSlide,
			getSlides 				: getSlides,
			getSlideWithNumber		: getSlideWithNumber,
			backwardOneSlide		: backwardOneSlide,	
			closeSlide				: closeSlide,
			closeAllSlides			: closeAllSlides,
			forwardOneSlide			: forwardOneSlide,
			goToSlide				: goToSlide,
			lastSlide				: lastSlide,
			isSlideFocused			: isSlideFocused,
			moveSlideTo				: moveSlideTo,
			showSlide				: showSlide
	};

}) (VISH,jQuery);