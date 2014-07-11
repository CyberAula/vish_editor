VISH.Events = (function(V,$,undefined){

	//Dependencies
	var _eMobile;

	//Internal vars
	var _bindedEventListeners = false;
	var _mobile;


	var init = function(){
		_mobile = (!V.Status.getDevice().desktop);
		if(_mobile){
			_eMobile = V.Events.Mobile;
			_eMobile.init();
		}
		bindViewerEventListeners();
	};

	var bindViewerEventListeners = function(){
		if(_bindedEventListeners){
			return;
		}

		//Enter and leave events
		$('article').live('slideenter', V.Viewer.onSlideEnterViewer);
		$('article').live('slideleave', V.Viewer.onSlideLeaveViewer);

		//Add tutorial events
		_addTutorialEvents();

		$(document).bind('keydown', handleBodyKeyDown);

		$(document).on('click', '#page-switcher-start', function(){
			V.Slides.backwardOneSlide();
		});
		$(document).on('click', '#page-switcher-end', function(){
			V.Slides.forwardOneSlide();
		});
		$(document).on('keypress', '#slide-counter-input', function(e){
			if(e.which == 13) {
				//pressed enter in the goToSlide input field
				V.Slides.goToSlide($("#slide-counter-input").val());
				$("#slide-counter-input").blur();
			}
		});

		$(document).on('click', '#closeButton', function(event){
			event.stopPropagation();
			event.preventDefault();
			var comeBackUrl = V.Viewer.getOptions()["comeBackUrl"];
			if(comeBackUrl){
				window.top.location.href = V.Viewer.getOptions()["comeBackUrl"];
			} else if((V.Status.getIsEmbed())&&(V.Status.getDevice().features.history)){
				//Go back
				history.back();
			}
		});

		$(document).on('click', '#back_arrow', function(event){
			V.Slides.backwardOneSlide();
		});
		$(document).on('click', '#forward_arrow', function(event){
			V.Slides.forwardOneSlide();
		});

		if(!_mobile){
			$(document).on('click','.close_subslide', V.Slideset.onCloseSubslideClicked);
		}

		//Slide internal links listener
		$(document).on('click',"section.slides article > div a[href^='#slide']:not(.ui-slider-handle)", V.Slides.onClickSlideLink);

		//when page is cached or updated, add presentation to localstorage
		if(typeof applicationCache !== "undefined"){
			applicationCache.addEventListener('cached', function(){
				V.Storage.addPresentation(presentation);
			}, false);
			applicationCache.addEventListener('updateready', function(){
				V.Storage.addPresentation(presentation);
			}, false);
		}

		//Accept recommendations (when are target blank links)
		$(document).on('click','a.recommendedItemLinkBlank', function(event){
			V.EventsNotifier.notifyEvent(V.Constant.Event.onAcceptRecommendation,{"id": $(this).attr("ex_id")},true);
		});

		//Evaluate button in recommendations panel
		$(document).on('click', '#evaluate_excursion', function(event){
			V.Recommendations.onClickEvaluateButton(event);
		});

		//Focus
		$(window).focus(function(){
			V.Status.setWindowFocus(true);
		}).blur(function(){
			V.Status.setWindowFocus(false);
		});

		//Load onresize event
		//Prevent multiple consecutively calls
		var multipleOnResize = undefined;
		window.onresize = function(){
			if(typeof multipleOnResize == "undefined"){
				multipleOnResize = false;
				setTimeout(function(){
					if(!multipleOnResize){
						multipleOnResize = undefined;

						//After Resize actions
						V.Status.refreshDeviceAfterResize();

						var currentDevice = V.Status.getDevice();
						V.EventsNotifier.notifyEvent(V.Constant.Event.onViewportResize,{screen: currentDevice.screen, viewport: currentDevice.viewport});
						
						V.ViewerAdapter.updateInterface();
					} else {
						multipleOnResize = undefined;
						window.onresize();
					}
				},600);
			} else {
				multipleOnResize = true;
			}
		};

		window.onbeforeunload = function(){
			V.EventsNotifier.notifyEvent(V.Constant.Event.exit);
		};

		if(_mobile){
			_eMobile.bindViewerMobileEventListeners();
		}

		_bindedEventListeners = true;
	}

	/**
	* function to add the events to the help buttons to launch joy ride bubbles
	*/
	var _addTutorialEvents = function(){
		$(document).on('click','#tab_quiz_session_help', function(){
			V.Tour.startTourWithId('quiz_session_help', 'bottom');
		});

		$(document).on('click','#tab_quiz_stats_help', function(){
			V.Tour.startTourWithId('quiz_session_help', 'bottom');
		});

		$(document).on('click','#help_addslides_selection', function(){
			V.Tour.startTourWithId('addslides_help', 'bottom');
		});
	};

	var unbindViewerEventListeners = function(){
		if(!_bindedEventListeners){
			return;
		}

		$(document).unbind('keydown', handleBodyKeyDown);

		$(document).off('click', '#page-switcher-start');
		$(document).off('click', '#page-switcher-end');

		$(document).off('click', '#back_arrow', V.Slides.backwardOneSlide);
		$(document).off('click', '#forward_arrow', V.Slides.forwardOneSlide);

		$(document).off('click', '#closeButton');

		$(document).off('click','.close_subslide', V.Slideset.onCloseSubslideClicked);

		if(typeof applicationCache !== "undefined"){
			applicationCache.removeEventListener('cached', function() {
				V.Storage.addPresentation(presentation);
			}, false);
			applicationCache.removeEventListener('updateready', function() {
				V.Storage.addPresentation(presentation);
			}, false);
		}

		if (_mobile){
			_eMobile.unbindViewerMobileEventListeners();
		}

		_bindedEventListeners = false;
	};


	/////////////////
	// Keyboard events
	//////////////////

	var handleBodyKeyDown = function(event) {
		switch (event.keyCode) {
			case 34: // av pag
			case 38: // up arrow
			case 39: // right arrow	    
				V.Slides.forwardOneSlide();
				event.preventDefault();
				break;
			case 33: //re pag
			case 37: // left arrow
			case 40: // down arrow
				V.Slides.backwardOneSlide();
				event.preventDefault();    		
				break;
		}
		V.TrackingSystem.registerAction("keydown",{"keyCode":event.keyCode});
	};
	
	return {
			init 							: init,
			bindViewerEventListeners		: bindViewerEventListeners,
			unbindViewerEventListeners		: unbindViewerEventListeners
	};

}) (VISH,jQuery);