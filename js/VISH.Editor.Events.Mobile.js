VISH.Editor.Events.Mobile = (function(V,$,undefined){

	//Internal vars
	var _bindedEditorMobileEventListeners = false;
	var _touchable = false;

	var init = function(){
		_touchable = V.Status.getDevice().features.touchScreen;
		if(_touchable){
			V.Events.Touchable.init();
		}
	};

	var bindEditorMobileEventListeners = function(){
		if(_bindedEditorMobileEventListeners){
			return;
		}
		_bindedEditorMobileEventListeners = true;


		//Events for mobile devices.
		var device = V.Status.getDevice();
		var isIphoneAndSafari = ((device.iPhone)&&(device.browser.name===V.Constant.SAFARI));
		var clickDelegationBug = (isIphoneAndSafari);

		if(_touchable){

			//Enable touch events
			V.Events.Touchable.bindTouchableEventListeners();

			//Thumbnails carrousel
			V.EventsNotifier.registerCallback(V.Constant.Event.Touchable.onSimpleClick, function(params){
				var event = params.event;
				var target = event.target;
				if($(target).parents("#slides_list").length > 0){
					var slide_number = $(target).attr("slidenumber");
					V.Slides.goToSlide(slide_number);
				} else if($(target).parents("#subslides_list").length > 0){
					var subslide_number = $(target).attr("slidenumber");
					V.Editor.Slideset.openSubslideWithNumber(subslide_number);
				}
			});
		}
		
		//Orientation
		$(window).on('orientationchange',function(){
			$(window).trigger('resize'); //It will call V.Editor.ViewerAdapter.updateInterface();
		});
	};

	var unbindEditorMobileEventListeners = function(){
		if(!_bindedEditorMobileEventListeners){
			return;
		}

		if(_touchable){
			V.Events.Touchable.unbindTouchableEventListeners();
		}

		$(window).off('orientationchange',function(){
			window.onresize();
		});

		_bindedEditorMobileEventListeners = false;
	};


	return {
			init 								: init,
			bindEditorMobileEventListeners		: bindEditorMobileEventListeners,
			unbindEditorMobileEventListeners	: unbindEditorMobileEventListeners
	};

}) (VISH,jQuery);