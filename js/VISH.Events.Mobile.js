/*
 * Events for mobile devices (mobile phones and tablets)
 * Touch, orientation events and fixes
 */
VISH.Events.Mobile = (function(V,$,undefined){

	var _bindedMobileEventListeners = false;
	var _touchable = false;

	var init = function(){
		_touchable = V.Status.getDevice().features.touchScreen;
		if(_touchable){
			V.Events.Touchable.init();
		}
	};

	var bindViewerMobileEventListeners = function(){
		if(_bindedMobileEventListeners){
			return;
		}
		_bindedMobileEventListeners = true;
		

		//Events for mobile devices.
		var device = V.Status.getDevice();
		var isIphoneAndSafari = ((device.iPhone)&&(device.browser.name===V.Constant.SAFARI));
		var clickDelegationBug = (isIphoneAndSafari);

		if(_touchable){

			//Enable touch events
			V.Events.Touchable.bindTouchableEventListeners();

			//Advance slides
			V.EventsNotifier.registerCallback(V.Constant.Event.Touchable.onShiftRight, function(params){
				V.Slides.backwardOneSlide();
			});

			V.EventsNotifier.registerCallback(V.Constant.Event.Touchable.onShiftLeft, function(params){
				V.Slides.forwardOneSlide();
			});

			//Close subslide event
			if(!clickDelegationBug){
				$(document).on('click','.close_subslide', V.Slideset.onCloseSubslideClicked);
			} else {
				// Fix for devices that don't support click delegation appropriately
				// Fix Click Delegation bug on Iphone devices with Safari
				V.EventsNotifier.registerCallback(V.Constant.Event.Touchable.onSimpleClick, function(params){
					var event = params.event;
					var target = event.target;
					if($(target).hasClass("close_subslide")){
						event.preventDefault();
						V.Slideset.onCloseSubslideClicked(event);
					}
				});
			}

			//Enhancement for tablets
			if(device.tablet){
				//Paginator
				V.EventsNotifier.registerCallback(V.Constant.Event.Touchable.onLongClick, function(params){
					var event = params.event;
					var target = event.target;
					if(_checkPaginatorClick(event.target.id)){
						event.preventDefault();
						event.stopPropagation();
						_applyPaginatorClick(event.target.id);
					}
				});

				V.EventsNotifier.registerCallback(V.Constant.Event.Touchable.onUnknownTouchMovement, function(params){
					var event = params.event;
					var id = event.target.id;
					var touchParams = params.touchParams;

					//Paginator fallback (treat minor movements as simple clicks)
					if(_checkPaginatorClick(id)){
						var PM_TOUCH_SENSITIVITY_FOR_PAGER_FALLBACK = 15;
						if(((touchParams.absTouchDX)+(touchParams.absTouchDY))/2<PM_TOUCH_SENSITIVITY_FOR_PAGER_FALLBACK){
							event.preventDefault();
							_applyPaginatorClick(id);
						}
					}
				});
			};
		}

		//Orientation
		$(window).on('orientationchange',function(){
			$(window).trigger('resize'); //It will call V.ViewerAdapter.updateInterface();
		});

	};

	var unbindViewerMobileEventListeners = function(){
		if(!_bindedMobileEventListeners){
			return;
		}
		_bindedMobileEventListeners = false;

		if(_touchable){
			V.Events.Touchable.unbindTouchableEventListeners();
		}

	  	$(window).off('orientationchange',function(){
			window.onresize();
		});
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


	return {
			init 								: init,
			bindViewerMobileEventListeners		: bindViewerMobileEventListeners,
			unbindViewerMobileEventListeners	: unbindViewerMobileEventListeners
	};

}) (VISH,jQuery);