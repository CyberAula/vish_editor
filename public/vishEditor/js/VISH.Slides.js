VISH.Slides = (function(V,$,undefined){

	// Array of slide DOM elements
	var slideEls;
	// Pointer to the current slide. Index of the slideEls array.
	var curSlideIndex;
	//Array of slide classes
	var SLIDE_CLASSES = ['far-past', 'past', 'current', 'next', 'far-next'];

	//Pointer to the id of the current subslide.
	var curSubSlideId = null;
	

	/* Initialization Method */
	var init = function(){
		_getcurSlideIndexFromHash();
	};

	/* 
	 * Slides Management
	 */
	var updateSlides = function() {
		setSlides(document.querySelectorAll('section.slides > article'));
		_updateSlideClasses();
		_updateHash();
	};

	var _updateHash = function() {
		if(!V.Editing){
			location.replace('#' + (curSlideIndex + 1));
		}
	};

	var _updateSlideClasses = function() {
		for (var i = 0; i < slideEls.length; i++) {
			switch (i) {
				case curSlideIndex - 2:
					updateSlideClass(i+1, 'far-past');
					break;
				case curSlideIndex - 1:
					updateSlideClass(i+1, 'past');
					break;
				case curSlideIndex:
					updateSlideClass(i+1, 'current');
					break;
				case curSlideIndex + 1:
					updateSlideClass(i+1, 'next');
					break;
				case curSlideIndex + 2:
					updateSlideClass(i+1, 'far-next');
					break;
				default:
					updateSlideClass(i+1);
					break;
			}
		}
	}

	var updateSlideClass = function(slideNumber, className) {
		var el = getSlideWithNumber(slideNumber);

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

		//update also subslide classes
		if($(el).attr("type")==VISH.Constant.FLASHCARD){
			var arr = $(el).find("article");
			for (var i=0; i< arr.length; i++) {
				$(arr[i]).addClass("hide_in_smartcard");
			}
		}
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

	var getSlideWithNumber = function(slideNumber){
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
		var slides = getSlides();
		if((typeof slides != "undefined")&&(slides.length)){
			return slides.length;
		} else {
			return 0;
		}	
	}

	var getSlideType = function(slideEl){
		if ((slideEl)&&(slideEl.tagName==="ARTICLE")){
			//slide in DOM element
			return $(slideEl).attr("type");
		} else if ((typeof slideEl == "object")&&(slideEl.length === 1)&&(slideEl[0].tagName==="ARTICLE")){
			//slide in DOM element, passed as a jQuery selector
			return $(slideEl).attr("type");
		} else if ((typeof slideEl == "object")&&(typeof slideEl.type == "string")){
			//slide in JSON
			return slideEl.type;
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

	var triggerEnterEvent = function(slideNumber) {
		var el = getSlideWithNumber(slideNumber);
		if (!el) {
			return;
		}
		triggerEnterEventById(el.id);
	};

	var triggerLeaveEvent = function(slideNumber) {
		var el = getSlideWithNumber(slideNumber);
		if (!el) {    
			return;
		}
		triggerLeaveEventById(el.id);
	};

	var triggerEnterEventById = function(slide_id) {
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
	* Function to go to next slide 
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
	* Go to the slide no
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
			V.Viewer.updateSlideCounter();
		}

		var params = new Object();
		params.slideNumber = no;
		V.EventsNotifier.notifyEvent(V.Constant.Event.onGoToSlide,params,triggeredByUser);
	};

	var _goToSlide = function(no){
		var nextSlideIndex = no - 1;
		if ((nextSlideIndex < slideEls.length)&&(nextSlideIndex >= 0)) {
			triggerLeaveEvent(curSlideIndex+1);
			_setCurrentSlideIndex(nextSlideIndex);
			updateSlides();
			triggerEnterEvent(curSlideIndex+1);
		}
	}
  
   /**
	* Go to the last slide
	*/
	var lastSlide = function(){
		goToSlide(slideEls.length);
	};

	/**
	 * Function to open a subslide from a determinate position
	 * used to apply animations
	 */
	var openSubslideFromPosition = function(poi,triggeredByUser){
		triggeredByUser = !(triggeredByUser===false);

		if((triggeredByUser)&&(V.Status.isPreventDefaultMode())&&(V.Messenger)){
			var params = new Object();
			params.slideNumber = poi.slide_id;
			V.Messenger.notifyEventByMessage(V.Constant.Event.onFlashcardPointClicked,params);
			return;
  		}

  		_onOpenSubslide(poi.slide_id);  		
  		//done this way instead of .show() and .hide() to be able to add animations
  		//on show and on hide with these classes
  		$("#" + poi.slide_id).removeClass("hide_in_smartcard");  		
  		$("#" + poi.slide_id).addClass("show_in_smartcard");
  		//$("#" + slide_id).show();
		triggerEnterEventById(poi.slide_id);

		//Notify
		var params = new Object();
		params.slideNumber = poi.slide_id;
		V.EventsNotifier.notifyEvent(V.Constant.Event.onFlashcardPointClicked,params,triggeredByUser);	
	};

	/**
	 * Function to open a subslide
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

  		//done this way instead of .show() and .hide() to be able to add animations
  		//on show and on hide with these classes
  		$("#" + slide_id).removeClass("hide_in_smartcard");
  		$("#" + slide_id).addClass("show_in_smartcard");
		//$("#" + slide_id).show();
		triggerEnterEventById(slide_id);

		//Notify
		var params = new Object();
		params.slideNumber = slide_id;
		V.EventsNotifier.notifyEvent(V.Constant.Event.onFlashcardPointClicked,params,triggeredByUser);	
	};


	/**
	 * Function to close a subslide
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
  		$("#" + slide_id).removeClass("show_in_smartcard");
  		$("#" + slide_id).addClass("hide_in_smartcard");
		//$("#"+slide_id).hide();
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
			updateSlides			: updateSlides,
			getSlides 				: getSlides,
			setSlides				: setSlides,
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
			openSubslideFromPosition : openSubslideFromPosition,
			closeSubslide			: closeSubslide,
			isSlideset				: isSlideset,
			triggerEnterEvent 		: triggerEnterEvent,
			triggerEnterEventById	: triggerEnterEventById,
			triggerLeaveEvent 		: triggerLeaveEvent,
			triggerLeaveEventById	: triggerLeaveEventById
	};

}) (VISH,jQuery);