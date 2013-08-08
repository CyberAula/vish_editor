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
	  updateSlides(true);
	  $('body').addClass('loaded');
	};

	var _getcurSlideIndexFromHash = function() {
		if(V.Editing){
			//Start in 0 (no slides), if there are slides, this param will be updated
			setCurrentSlideNumber(0);
		} else {
			var slideNo = parseInt(location.hash.substr(1));
			if (slideNo) {
				setCurrentSlideNumber(slideNo);
			} else {
				//Start in 1 (first slide)
				setCurrentSlideNumber(1);
			}
		}
	};


	/* API Methods */

	var getSlides = function(){
		return slideEls;
	}

	var setSlides = function(newSlideEls){
		slideEls = newSlideEls;

		//Update slidenumber param
		$.each(slideEls, function(index, value) {
			$(value).attr("slidenumber",index+1);
		});
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
		_setCurrentSlideIndex(currentSlideNumber-1);
	}

	var _setCurrentSlideIndex = function(newCurSlideIndex){
		curSlideIndex = newCurSlideIndex;
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
		  			result = index + 1;
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
				case V.Constant.STANDARD:
					return V.Constant.STANDARD;
					break;
				case V.Constant.FLASHCARD:
					return V.Constant.FLASHCARD;
					break;
				case V.Constant.QUIZ_SIMPLE:
					return V.Constant.QUIZ_SIMPLE;
					break;
				case V.Constant.GAME:
					return V.Constant.GAME;
					break;
				case V.Constant.VTOUR:
					return V.Constant.VTOUR;
					break;
				default:
					return V.Constant.UNKNOWN;
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
		triggerEnterEventById(el.id);
	};

	var triggerLeaveEvent = function(no) {
		var el = _getSlide(no);
		if (!el) {    
			return;
		}
		triggerLeaveEventById(el.id);
	};

	var triggerEnterEventById = function (slide_id) {
		var el = $("#" +slide_id)[0];
		var evt = document.createEvent('Event');
		evt.initEvent('slideenter', true, true);
		el.dispatchEvent(evt);
	};

	var triggerLeaveEventById = function(slide_id) {
		var el = $("#" + slide_id)[0];
		var evt = document.createEvent('Event');
		evt.initEvent('slideleave', true, true);
		el.dispatchEvent(evt);
	};


   /* Slide Movement */

   /**
	* function to go to next slide 
	*/
	var forwardOneSlide = function(event){
		moveSlides(1);
	};

   /**
	* Function to go to previous slide
	*/
	var backwardOneSlide = function(){
		moveSlides(-1);
	};

   /**
	* Function to move n slides and change the thumbnails and focus
	* n > 0 (advance slides)
	* n < 0 (go back)
	*/
	var moveSlides = function(n){
		if((n>0)&&(!V.Editing)&&((isCurrentLastSlide() && V.Status.getDevice().desktop))){
			V.Recommendations.showFancybox();
			return;
		}

		var no = curSlideIndex+n+1;
		no = Math.min(Math.max(1,no),slideEls.length);
		goToSlide(no);
	};


	/**
	* go to the slide when clicking the thumbnail
	*/
	var goToSlide = function(no,triggeredByUser){
		if((no === getCurrentSlideNumber())||(no > slideEls.length)||(no <= 0)){
			//Do nothing
			return;
		};

		triggeredByUser = !(triggeredByUser===false);

		if((triggeredByUser)&&(V.Status.isPreventDefaultMode())&&(V.Messenger)){
			var params = new Object();
			params.slideNumber = no;
			V.Messenger.notifyEventByMessage(V.Constant.Event.onGoToSlide,params);
			return;
		}

		//Close fancybox
		if((!V.Editing)&&($.fancybox)){
			$.fancybox.close();
		}

		_goToSlide(no);

		if(V.Editing){
			V.Editor.Tools.cleanZoneTools();
			//finally add a background color to thumbnail of the selected slide
			V.Editor.Thumbnails.selectThumbnail(no);
		}	else {
			//update slide counter
			V.SlideManager.updateSlideCounter();
		}

		var params = new Object();
		params.slideNumber = no;
		V.EventsNotifier.notifyEvent(V.Constant.Event.onGoToSlide,params,triggeredByUser);
	};

	var _goToSlide = function(no){
		var nextSlideIndex = no - 1;
		if ((nextSlideIndex < slideEls.length)&&(nextSlideIndex >= 0)) {
			_setCurrentSlideIndex(nextSlideIndex);
			updateSlides(true);
		}
	}
  
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

		if((triggeredByUser)&&(V.Status.isPreventDefaultMode())&&(V.Messenger)){
			var params = new Object();
			params.slideNumber = slide_id;
			V.Messenger.notifyEventByMessage(V.Constant.Event.onFlashcardPointClicked,params);
			return;
  		}

  		_onOpenSubslide(slide_id);
		$("#" + slide_id).show();
		triggerEnterEventById(slide_id);

		//Notify
		var params = new Object();
		params.slideNumber = slide_id;
		V.EventsNotifier.notifyEvent(V.Constant.Event.onFlashcardPointClicked,params,triggeredByUser);	
	};


	/**
	 * function to close one specific slide in the flashcard
	 */
	var closeSubslide = function(slide_id,triggeredByUser){
		triggeredByUser = !(triggeredByUser===false);

		if((triggeredByUser)&&(V.Status.isPreventDefaultMode())&&(V.Messenger)){
			var params = new Object();
			params.slideNumber = slide_id;
			V.Messenger.notifyEventByMessage(V.Constant.Event.onFlashcardSlideClosed,params);
			return;
  		}

  		_onCloseSubslide(slide_id);
		$("#"+slide_id).hide();
		triggerLeaveEventById(slide_id);	

		//Notify
		var params = new Object();
		params.slideNumber = slide_id;
		V.EventsNotifier.notifyEvent(V.Constant.Event.onFlashcardSlideClosed,params,triggeredByUser);	
	};

	var _onOpenSubslide = function(subSlideId){
		curSubSlideId = subSlideId;
		$("#closeButton").hide();
		//Open subslide will call V.ViewerAdapter.decideIfPageSwitcher();
	}

	var _onCloseSubslide = function(){
		curSubSlideId = null;
		if(V.Status.getDevice().mobile){
			//Timeout to prevent undesired actions in Mobile Phones
			setTimeout(function(){
				V.ViewerAdapter.decideIfCloseButton();
				V.ViewerAdapter.decideIfPageSwitcher();
			},800);
		} else {
			V.ViewerAdapter.decideIfPageSwitcher();
		}
	}

	/**
	 * Function to close all slides in the flashcard, in case one remains open
	 */
	var closeAllSlides = function(){
		$(".slides > article").hide();	
	};


	var isSlideset = function(type){
		switch(type){
			case V.Constant.FLASHCARD:
			case V.Constant.VTOUR:
				return true;
			default:
				return false;
		}
	}

	return {	
			init          			: init,
			getSlides 				: getSlides,
			setSlides				: setSlides,
			updateSlides			: updateSlides,
			updateSlideEls			: updateSlideEls,
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
			moveSlides				: moveSlides,
			forwardOneSlide			: forwardOneSlide,
			backwardOneSlide		: backwardOneSlide,	
			goToSlide				: goToSlide,
			lastSlide				: lastSlide,
			openSubslide			: openSubslide,
			closeSubslide			: closeSubslide,
			closeAllSlides			: closeAllSlides,
			isSlideset				: isSlideset,
			triggerEnterEvent 		: triggerEnterEvent,
			triggerEnterEventById	: triggerEnterEventById,
			triggerLeaveEvent 		: triggerLeaveEvent,
			triggerLeaveEventById	: triggerLeaveEventById
	};

}) (VISH,jQuery);