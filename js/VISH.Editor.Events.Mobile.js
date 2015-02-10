VISH.Editor.Events.Mobile = (function(V,$,undefined){

	//Touch params
	var PM_TOUCH_SENSITIVITY = 40;
	var MINIMUM_ZOOM_TO_ENABLE_SCROLL = 1.2;
	var LONG_TOUCH_DURATION = 1000;

	//Internal vars
	var _bindedEventListeners = false;

	var init = function(){
	};

	var bindEditorMobileEventListeners = function(){
		if(_bindedEventListeners){
			return;
		} else {
			_bindedEventListeners = true;
		}

		//Touch events
		$(document).bind('touchstart', _handleTouchStart);
		document.body.addEventListener('touchmove', _handleTouchMove, true);
		document.body.addEventListener('touchend', _handleTouchEnd, true);
		document.body.addEventListener('touchcancel', _handleTouchCancel, true);

		//Additional events for mobile devices: Close subslide, ...
		var device = V.Status.getDevice();
		var isIphoneAndSafari = ((device.iPhone)&&(device.browser.name===V.Constant.SAFARI));

		var clickDelegationBug = (isIphoneAndSafari);

		if(!clickDelegationBug){
			$(document).on('click','.close_subslide', V.Slideset.onCloseSubslideClicked);
		} else {
			// Fix for devices that don't support click delegation appropriately
			// Fix Click Delegation bug on Iphone devices with Safari
			V.EventsNotifier.registerCallback(V.Constant.Event.onSimpleClick, function(params){
				var event = params.event;
				var target = event.target;
				if($(target).hasClass("close_subslide")){
					event.preventDefault();
					V.Slideset.onCloseSubslideClicked(event);
				}
			});
		}

		if(device.tablet){
			//In tablets clicks on thumbnails carousel do not work, fix it:
			V.EventsNotifier.registerCallback(V.Constant.Event.onSimpleClick, function(params){
				var event = params.event;
				var target = event.target;
				if($(target).parents("#slides_list").length > 0){
					console.log("click on slides_list");
					var slide_number = $(target).attr("slidenumber");
					V.Slides.goToSlide(slide_number);
				} else if($(target).parents("#subslides_list").length > 0){
					console.log("click on subslides_list");
					var subslide_number = $(target).attr("slidenumber");
					V.Editor.Slideset.openSubslideWithNumber(subslide_number);
				}
			});
			
		};
	};

	var unbindEditorMobileEventListeners = function(){
		if(!_bindedEventListeners){
			return;
		} else {
			_bindedEventListeners = false;
		}

		$(document).unbind('touchstart', _handleTouchStart);
		document.body.removeEventListener('touchmove', _handleTouchMove, true);
	  	document.body.removeEventListener('touchend', _handleTouchEnd, true);
	  	document.body.removeEventListener('touchcancel', _handleTouchCancel, true);
	};

	////////////////
	// Touch Events
	////////////////

	//Touch vars
	var _touchStartX = 0; //starting x coordinate
	var _touchStartY = 0; //starting y coordinate
	var _touchCX = 0; //current x
	var _touchCY = 0; //current y
	var _touchDX = 0; //x movement
	var _touchDY = 0; //y movement
	var _absTouchDX = 0; //x abs movement
	var _absTouchDY = 0; //y abs movement
	var _touchesLength = 0; //Fingers quantity
	var _touchStartTime = 0;
	var _touchDuration = 0;

	var _handleTouchStart = function(event){
		console.log("touchstart");
		_resetTouchVars();
		var touches = _getTouches(event);
		_touchesLength = touches.length;
		if (_touchesLength === 1) {
			_touchStartX = touches[0].pageX;
			_touchStartY = touches[0].pageY;
		}
		_touchStartTime = new Date().getTime();
	};

	var _resetTouchVars = function(){
		_touchStartX = -1;
		_touchStartY = -1;
		_touchCX = -1;
		_touchCY = -1;
		_touchDX = -1;
	 	_touchDY = -1;
	 	_absTouchDX = -1;
		_absTouchDY = -1;
		_touchesLength = -1;
		_touchStartTime = -1;
		_touchDuration = -1;
	};

	var _handleTouchMove = function(event){
		console.log("touchmove");
		var touches = _getTouches(event);
		if(touches.length===1){
			_touchCX = touches[0].pageX;
			_touchCY = touches[0].pageY;
			
			//Only allow zoom movement
			var zoom = document.documentElement.clientWidth / window.innerWidth;
			if (zoom <= MINIMUM_ZOOM_TO_ENABLE_SCROLL){
				event.preventDefault();
				return;
			}
		}
	};

	var _handleTouchEnd = function(event){
		console.log("touchend");
		if(_checkClickTouches(event)){
			return;
		}

		_checkOtherTouches(event);
	};

	var _handleTouchCancel = function(){
		_resetTouchVars();
	};

	
	////////////////
	// TOUCH HELPERS
	///////////////

	var _checkClickTouches = function(event){
		if(_touchesLength!=1){
			return false;
		}

		//var click = (_touchCX==-1) && (_touchCY==-1);
		var click;

		if((_touchCX==-1) && (_touchCY==-1)){
			click = true;
		}else{
			//touchmove event with final x and y
			_touchDX = _touchCX - _touchStartX;
			_touchDY = _touchCY - _touchStartY;
			_absTouchDX = Math.abs(_touchDX);
			_absTouchDY = Math.abs(_touchDY);
			console.log("_absTouchDX: " + _absTouchDX + " and _absTouchDY: " + _absTouchDY);
			if(_absTouchDX < PM_TOUCH_SENSITIVITY && _absTouchDX < PM_TOUCH_SENSITIVITY){
				click = true;
			}	
		}
		if(click){
			//Get click duration
			_touchDuration = new Date().getTime() - _touchStartTime;
			if(_touchDuration<LONG_TOUCH_DURATION){
				_simpleClick(event);
			} else {
				_longClick(event);
			}
		}
		return click;
	};

	var _simpleClick = function(event){
		console.log("_simpleClick");
		V.EventsNotifier.notifyEvent(V.Constant.Event.onSimpleClick,{event: event},true);
		return true;
	};

	var _longClick = function(event){
		console.log("_longClick");
		V.EventsNotifier.notifyEvent(V.Constant.Event.onLongClick,{event: event},true);
		return true;
	};

	

	var _checkOtherTouches = function(event){
		console.log("_checkOtherTouches");
		V.EventsNotifier.notifyEvent(V.Constant.Event.onUnknownTouchMovement,{event: event, touchParams: _getTouchParams()},true);
		return false;
	};

	/////////////////
	// Paginator Utils
	/////////////////

	var _checkPaginatorClick = function(targetId){
		return ((targetId==="page-switcher-end")||(targetId==="page-switcher-start"));
	};

	var _applyPaginatorClick = function(targetId){
		if(targetId==="page-switcher-end"){
			$("#page-switcher-end").trigger("click");
		} else if(targetId==="page-switcher-start"){
			$("#page-switcher-start").trigger("click");
		}
	};

	/////////////////
	// UTILS
	/////////////////

	/* 
	 * Get the touches of an event
	 * Jquery does not pass the touches property in the event, and we get them from the event.originalEvent
	 */
	var _getTouches = function(event){
		if(event.touches){
			return event.touches;
		} else if(event.originalEvent.touches){
			return event.originalEvent.touches;
		} else {
			return null;
		}
	};

	var _getTouchParams = function(){
		return {touchStartX:_touchStartX, touchStartY:_touchStartY, touchCX:_touchCX, touchCY:_touchCY, touchDX:_touchDX, touchDY:_touchDY, absTouchDX:_absTouchDX, absTouchDY:_absTouchDY, touchesLength:_touchesLength};
	};

	return {
			init 								: init,
			bindEditorMobileEventListeners		: bindEditorMobileEventListeners,
			unbindEditorMobileEventListeners	: unbindEditorMobileEventListeners
	};

}) (VISH,jQuery);