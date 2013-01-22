VISH.Slides = (function(V,$,undefined){

	/* Variables to store slide elements and point to current slide*/
	var slideEls;
	var curSlideIndex;
	var SLIDE_CLASSES = ['far-past', 'past', 'current', 'next', 'far-next'];
	var curSubSlideId = null;
	
	var init = function(){
		_getcurSlideIndexFromHash();
		$(document).bind('OURDOMContentLoaded', handleDomLoaded);		
	};


	/* Initialization Methods */

	var handleDomLoaded = function () {
	  slideEls = document.querySelectorAll('section.slides > article');
	  if(V.SlideManager.getPresentationType() === V.Constant.FLASHCARD){
	  	//this way updateSlides will add the class current and it will be shown
	  	curSlideIndex = 0;
	  }
	  updateSlides(true);
	  $('body').addClass('loaded');
	};

	var _getcurSlideIndexFromHash = function() {
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


	/* API Methods */

	var getSlides = function(){
		return slideEls;
	}

	var setSlides = function(newSlideEls){
		slideEls = newSlideEls;
	}

	var updateSlides = function(goingRight) {
		updateSlideEls();

		if(goingRight){
			triggerLeaveEvent(curSlideIndex - 1);
		} else {
			triggerLeaveEvent(curSlideIndex + 1);    
		}
		triggerEnterEvent(curSlideIndex);
		_updateHash();
	};

	var _updateHash = function() {
		location.replace('#' + (curSlideIndex + 1));
	};

	var updateSlideEls = function() {
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

	var setCurrentSlideIndex = function(newCurSlideIndex){
		curSlideIndex = newCurSlideIndex;
	}

	var getCurrentSlide = function(){
		return slideEls[curSlideIndex];
	}

	var getCurrentSubSlide = function(){
		if (curSubSlideId === null){
			return null;
		} else {
			return $("#"+curSubSlideId);
		}
	}

	var getCurrentSlideNumber = function(){
		return curSlideIndex+1;
	}

	var setCurrentSlideNumber = function(currentSlideNumber){
		curSlideIndex = currentSlideNumber-1;
	}

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

	var getSlidesQuantity = function(){
		return getSlides().length;
	}

	var getSlideType = function(slideEl){
		if ((slideEl)&&(slideEl.tagName==="ARTICLE")){
			switch($(slideEl).attr("type")){
				case undefined:
				case VISH.Constant.STANDARD:
					return VISH.Constant.STANDARD;
					break;
				case VISH.Constant.FLASHCARD:
					return VISH.Constant.FLASHCARD;
					break;
				case VISH.Constant.QUIZ_SIMPLE:
					return VISH.Constant.QUIZ_SIMPLE;
					break;
				case VISH.Constant.GAME:
					return VISH.Constant.GAME;
					break;
				case VISH.Constant.VTOUR:
					return VISH.Constant.VTOUR;
					break;
				default:
					return VISH.Constant.UNKNOWN;
					break;
			}
		} else {
			//slideEl is not a slide
			return null;
		}
	}

	var isCurrentFirstSlide = function(){
		return curSlideIndex===0;
	}

	var isCurrentLastSlide = function(){
		return curSlideIndex===slideEls.length-1;
	}


	/* Slide events */

	var triggerEnterEvent = function (no) {  
		var el = _getSlide(no);
		if (!el) {
			return;
		}
		_triggerEnterEventById(el.id);
	};

	var triggerLeaveEvent = function(no) {
		var el = _getSlide(no);
		if (!el) {    
			return;
		}

		_triggerLeaveEventById(el.id);	  
	};

	var _triggerEnterEventById = function (slide_id) {
		var el = $("#" +slide_id)[0];

		var onEnter = el.getAttribute('onslideenter');
		if (onEnter) {
			new Function(onEnter).call(el);
		}

		var evt = document.createEvent('Event');
		evt.initEvent('slideenter', true, true);
		el.dispatchEvent(evt);
	};

	var _triggerLeaveEventById = function(slide_id) {
		var el = $("#" + slide_id)[0];

		var onLeave = el.getAttribute('onslideleave');
		if (onLeave) {
			new Function(onLeave).call(el);
		}

		var evt = document.createEvent('Event');
		evt.initEvent('slideleave', true, true);

		el.dispatchEvent(evt);
	};


   /* Slide Movement */

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

   /**
	* function to go to next slide and change the thumbnails and focus 
	*/
	var forwardOneSlide = function(event){
		goToSlide(curSlideIndex+2);
	};

   /**
	* function to go to previous slide and change the thumbnails and focus 
	*/
	var backwardOneSlide = function(){
		goToSlide(curSlideIndex);
	};


	/**
	* go to the slide when clicking the thumbnail
	*/
	var goToSlide = function(no,triggeredByUser){
		if(no === getCurrentSlideNumber()){
			//Do nothing
			return;
		};

		triggeredByUser = !(triggeredByUser===false);

		if((triggeredByUser)&&(VISH.Status.isPreventDefaultMode())&&(VISH.Messenger)){
			var params = new Object();
			params.slideNumber = no;
			VISH.Messenger.notifyEventByMessage(VISH.Constant.Event.onGoToSlide,params);
			return;
		}

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
		VISH.EventsNotifier.notifyEvent(VISH.Constant.Event.onGoToSlide,params,triggeredByUser);
	};
  
   /**
	* Go to the last slide
	*/
	var lastSlide = function(){
		goToSlide(slideEls.length);
	};


	/**
	 * function to show one specific slide in the flashcard
	 */
	var openSubslide = function(slide_id,triggeredByUser){
		triggeredByUser = !(triggeredByUser===false);

		if((triggeredByUser)&&(VISH.Status.isPreventDefaultMode())&&(VISH.Messenger)){
			var params = new Object();
			params.slideNumber = slide_id;
			VISH.Messenger.notifyEventByMessage(VISH.Constant.Event.onFlashcardPointClicked,params);
			return;
  		}

  		_onOpenSubslide(slide_id);
		$("#" + slide_id).show();
		_triggerEnterEventById(slide_id);

		//Notify
		var params = new Object();
		params.slideNumber = slide_id;
		VISH.EventsNotifier.notifyEvent(VISH.Constant.Event.onFlashcardPointClicked,params,triggeredByUser);	
	};


	/**
	 * function to close one specific slide in the flashcard
	 */
	var closeSubslide = function(slide_id,triggeredByUser){
		triggeredByUser = !(triggeredByUser===false);

		if((triggeredByUser)&&(VISH.Status.isPreventDefaultMode())&&(VISH.Messenger)){
			var params = new Object();
			params.slideNumber = slide_id;
			VISH.Messenger.notifyEventByMessage(VISH.Constant.Event.onFlashcardSlideClosed,params);
			return;
  		}

  		_onCloseSubslide(slide_id);
		$("#"+slide_id).hide();
		_triggerLeaveEventById(slide_id);	

		//Notify
		var params = new Object();
		params.slideNumber = slide_id;
		VISH.EventsNotifier.notifyEvent(VISH.Constant.Event.onFlashcardSlideClosed,params,triggeredByUser);	
	};

	var _onOpenSubslide = function(subSlideId){
		curSubSlideId = subSlideId;
		$("#closeButton").hide();
		//Open subslide will call VISH.ViewerAdapter.decideIfPageSwitcher();
	}

	var _onCloseSubslide = function(){
		curSubSlideId = null;
		//Timeout to prevent undesired actions in Mobile Phones
		setTimeout(function(){
			$("#closeButton").show();
			VISH.ViewerAdapter.decideIfPageSwitcher();
		},800);
	}

	/**
	 * Function to close all slides in the flashcard, in case one remains open
	 */
	var closeAllSlides = function(){
		$(".slides > article").hide();	
	};


	return {	
			init          			: init,
			getSlides 				: getSlides,
			setSlides				: setSlides,
			updateSlides			: updateSlides,
			updateSlideEls			: updateSlideEls,
	 		setCurrentSlideIndex	: setCurrentSlideIndex,
			getCurrentSlide 		: getCurrentSlide,
			getCurrentSubSlide 		: getCurrentSubSlide,
			getCurrentSlideNumber	: getCurrentSlideNumber,
			setCurrentSlideNumber	: setCurrentSlideNumber,
			getSlideWithNumber		: getSlideWithNumber,
			getNumberOfSlide		: getNumberOfSlide,
			getSlidesQuantity		: getSlidesQuantity,
			getSlideType 			: getSlideType,
			isCurrentFirstSlide		: isCurrentFirstSlide,
			isCurrentLastSlide		: isCurrentLastSlide,
			forwardOneSlide			: forwardOneSlide,
			backwardOneSlide		: backwardOneSlide,	
			goToSlide				: goToSlide,
			lastSlide				: lastSlide,
			openSubslide			: openSubslide,
			closeSubslide			: closeSubslide,
			closeAllSlides			: closeAllSlides
	};

}) (VISH,jQuery);