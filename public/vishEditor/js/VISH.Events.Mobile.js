/*
 * Events for mobile devices (mobile phones and tablets)
 * Touch and orientation events
 */
VISH.Events.Mobile = (function(V,$,undefined){
	//Touch params
	var PM_TOUCH_SENSITIVITY = 20;
	var PM_TOUCH_DESVIATION = 60;
	var MINIMUM_ZOOM_TO_ENABLE_SCROLL = 1.2;
	var PM_TOUCH_SENSITIVITY_FOR_PAGER_FALLBACK = 15;
	var LONG_TOUCH_DURATION = 1000;

	//Own vars
	var bindedEventListeners = false;


	var init = function() {
		var device = V.Status.getDevice();
		var isIphoneAndSafari = ((device.iPhone)&&(device.browser.name===V.Constant.SAFARI));
		
		////////////////////
		//Configure handlers

		//Iphone fixes
		if(isIphoneAndSafari){
			_simpleClick = _simpleClickForIphoneAndSafari;
		}

		//Tablet handlers
		if(device.tablet){
			_longClick = _longClickForTablets;
		}

		//Remove click handler if not needed
		if((!isIphoneAndSafari)&&(!device.tablet)){
			_checkClickTouches = function(){ return false };
		}
	};

	var bindViewerMobileEventListeners = function(){
		if(bindedEventListeners){
			return;
		} else {
			bindedEventListeners = true;
		}

		$(document).bind('touchstart', handleTouchStart);
		window.addEventListener("load",  function(){ _hideAddressBar(); } );
		$(window).on('orientationchange',function(){
			_hideAddressBar();
			$(window).trigger('resize'); //Will call V.ViewerAdapter.updateInterface();
		});

		document.body.addEventListener('touchmove', handleTouchMove, true);
		document.body.addEventListener('touchend', handleTouchEnd, true);
		document.body.addEventListener('touchcancel', handleTouchCancel, true);
	}

	var unbindViewerMobileEventListeners = function(){
		if(!bindedEventListeners){
			return;
		} else {
			bindedEventListeners = false;
		}

		$(document).unbind('touchstart', handleTouchStart);
		window.removeEventListener("load",  function(){ _hideAddressBar(); } );
		$(window).off('orientationchange',function(){
			_hideAddressBar();
			window.onresize(); //Will call V.ViewerAdapter.updateInterface();
		});

		document.body.removeEventListener('touchmove', handleTouchMove, true);
	  	document.body.removeEventListener('touchend', handleTouchEnd, true);
	}


	////////////////
	// Touch Events
	////////////////

	//Touch vars
	var touchStartX = 0; //starting x coordinate
	var touchStartY = 0; //starting y coordinate
	var touchCX = 0; //current x
	var touchCY = 0; //current y
	var touchesLength = 0; //Fingers quantity
	var touchStartTime = 0;

	var handleTouchStart = function(event) {
		_resetTouchVars();
		var touches = _getTouches(event);
		touchesLength = touches.length;
		if (touchesLength === 1) {
			touchStartX = touches[0].pageX;
			touchStartY = touches[0].pageY;
		}
     	touchStartTime = new Date().getTime();
	};

	var _resetTouchVars = function(){
		touchStartX = -1;
		touchStartY = -1;
		touchCX = -1; //current x
		touchCY = -1; //current y
		touchesLength = -1;
		touchStart = -1;
	}

	var handleTouchMove = function(event) {
		var touches = _getTouches(event);
		if(touches.length===1){
			touchCX = touches[0].pageX;
			touchCY = touches[0].pageY;
			
			//Only allow zoom movement
			var zoom = document.documentElement.clientWidth / window.innerWidth;
			if (zoom <= MINIMUM_ZOOM_TO_ENABLE_SCROLL){
				event.preventDefault();
				return;
			}
		}
	};

	var handleTouchEnd = function(event) {
		if(touchesLength===1){
			if(_checkClickTouches(event)){
				return;
			}

			if(_checkAdvanceSlidesTouches(event)){
				return;
			}

			if(_checkOtherTouches(event)){
				return;
			}
		}
		_resetTouchVars();
	};

	var handleTouchCancel = function(){
		_resetTouchVars();
	}


	var _hideAddressBar = function(){
		//TODO
		/*
		if(document.body.style.height < window.outerHeight) {
			document.body.style.height = (window.outerHeight + 50) + 'px';
			V.Debugging.log("height " + document.body.style.height);
		}

		setTimeout( function(){ 
			V.Debugging.log("scroll");
			window.scrollTo(0, 1); 
		}, 50 );
		*/
	};

	////////////////
	// TOUCH HELPERS
	///////////////

	var _checkClickTouches = function(event){
		var click = (touchCX==-1) && (touchCY==-1);
		if(click){
			//Get click duration
			var duration = new Date().getTime() - touchStartTime;
			if(duration<LONG_TOUCH_DURATION){
				_simpleClick(event);
			} else {
				_longClick(event);
			}
		}
		return click;
	}

	var _simpleClick = function(event){
		return true;
	}

	var _simpleClickForIphoneAndSafari = function(event){
		// Fix for Iphone devices due to Click Delegation bug
		if($(event.target).hasClass("fc_poi")){
			event.preventDefault();
			var poiId = event.target.id;
			V.Events.onFlashcardPoiClicked(poiId);
		} else if($(event.target).hasClass("close_subslide")){
			event.preventDefault();
			V.Events.onFlashcardCloseSlideClicked(event);
		}
		return true;
	}

	var _longClick = function(event){
		return true;
	}

	var _longClickForTablets = function(event){
		if(_checkPaginatorClick(event.target.id)){
			event.preventDefault();
			event.stopPropagation();
			_applyPaginatorClick(event.target.id);
		}
	}

	var _checkAdvanceSlidesTouches = function(event){
		var touchDX = touchCX - touchStartX;
		var touchDY = touchCY - touchStartY;
		var absTouchDX = Math.abs(touchDX);
		var absTouchDY = Math.abs(touchDY);

		var move_slide = ((absTouchDX > PM_TOUCH_SENSITIVITY)&&(absTouchDY < PM_TOUCH_DESVIATION));
		//Prevent no handleTouchMove touchs
		move_slide = move_slide && (touchCX!==-1);

		if(move_slide){
			event.preventDefault();

			//Avoid move slide on zoom
			var zoom = document.documentElement.clientWidth / window.innerWidth;
			if (zoom > MINIMUM_ZOOM_TO_ENABLE_SCROLL){
				return;
			}

			//Close subslide if is open
			var subslide = V.Slides.getCurrentSubSlide();
			if(subslide!==null){
				V.Slides.closeSubslide($(subslide).attr("id"));
			}
			
			if (touchDX > 0) {
				V.Slides.backwardOneSlide();
			} else {
				V.Slides.forwardOneSlide();
			}
		} 
			
		return move_slide;
	}

	var _checkOtherTouches = function(event){
		return false;
	}

	var _checkOtherTouchesForTablets = function(event){
		var id = event.target.id;

		////////////////////////////////////
		//Paginator fallback (treat minor movements as simple clicks)
		if(_checkPaginatorClick(id)){
			if(((absTouchDX)+(absTouchDY))/2<PM_TOUCH_SENSITIVITY_FOR_PAGER_FALLBACK){
				event.preventDefault();
				_applyPaginatorClick(id);
				return true;
			}
		}
	}

	var _checkPaginatorClick = function(targetId){
		return ((targetId==="page-switcher-end")||(targetId==="page-switcher-start"));
	}

	var _applyPaginatorClick = function(targetId){
		if(targetId==="page-switcher-end"){
			$("#page-switcher-end").trigger("click");
		} else if(targetId==="page-switcher-start"){
			$("#page-switcher-start").trigger("click");
		}
	}

	/////////////////
	// UTILS
	/////////////////

	/* 
	 * Get the touches of an event
	 * Jquery does not pass the touches property in the event, and we get them from the event.originalEvent
	 */
	var _getTouches = function (event){
		if(event.touches){
			return event.touches;
		} else if(event.originalEvent.touches){
			return event.originalEvent.touches;
		} else {
			return null;
		}
	};

	return {
			init 								: init,
			bindViewerMobileEventListeners		: bindViewerMobileEventListeners,
			unbindViewerMobileEventListeners	: unbindViewerMobileEventListeners
	};

}) (VISH,jQuery);