/*
 * Events for mobile devices (mobile phones and tablets)
 * Touch and orientation events
 */
VISH.Events.Mobile = (function(V,$,undefined){
	var isIphoneAndSafari = false;
	var PM_TOUCH_SENSITIVITY = 50;
	var PM_TOUCH_DESVIATION = 50;
	var MINIMUM_ZOOM_TO_ENABLE_SCROLL = 1.2;

	//Own vars
	var bindedEventListeners = false;

	var init = function() {
		isIphoneAndSafari = ((VISH.Status.getDevice().iPhone)&&(VISH.Status.getDevice().browser.name===VISH.Constant.SAFARI));
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
			V.ViewerAdapter.updateInterface();
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
			V.ViewerAdapter.updateInterface();
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

	var handleTouchStart = function(event) {
		_resetTouchVars();
		var touches = _getTouches(event);
		touchesLength = touches.length;
		if (touchesLength === 1) {
			touchStartX = touches[0].pageX;
			touchStartY = touches[0].pageY;
		}
	};

	var _resetTouchVars = function(){
		touchStartX = -1;
		touchStartY = -1;
		touchCX = -1; //current x
		touchCY = -1; //current y
		touchesLength = 0;
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
				
			} else {
				//Simple click

				// Fix for Iphone devices due to Click Delegation bug
				if(isIphoneAndSafari){
					if($(event.target).hasClass("fc_poi")){
						event.preventDefault();
						var poiId = event.target.id;
						_onFlashcardPoiClicked(poiId);
					} else if($(event.target).hasClass("close_subslide")){
						event.preventDefault();
						_onFlashcardCloseSlideClicked(event);
					}
				}

				
				// var id = event.target.id;
				// if(id==="page-switcher-end"){
				// 	event.preventDefault();
				// 	V.Slides.backwardOneSlide();
				// } else if(id==="page-switcher-start"){
				// 	event.preventDefault();
				// 	V.Slides.forwardOneSlide();
				// }
			}
		}

		_resetTouchVars();
	};

	var handleTouchCancel = function(){
	}


	var _hideAddressBar = function(){
		//TODO
		/*
		if(document.body.style.height < window.outerHeight) {
			document.body.style.height = (window.outerHeight + 50) + 'px';
			VISH.Debugging.log("height " + document.body.style.height);
		}

		setTimeout( function(){ 
			VISH.Debugging.log("scroll");
			window.scrollTo(0, 1); 
		}, 50 );
		*/
	};


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