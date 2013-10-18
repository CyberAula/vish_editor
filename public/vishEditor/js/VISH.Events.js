VISH.Events = (function(V,$,undefined){

	//Dependencies
	var eMobile;

	//Own vars
	var bindedEventListeners = false;
	var mobile;


	var init = function() {
		mobile = (!V.Status.getDevice().desktop);
		eMobile = V.Events.Mobile;
		if(!V.Editing){
			eMobile.init();
			bindViewerEventListeners();
		}
	};

	var bindViewerEventListeners = function(){
		if(bindedEventListeners){
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
			if(e.which == 13) { //pressed enter in the goToSlide input field
				V.Slides.goToSlide($("#slide-counter-input").val());
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

		$(document).on('click','.close_subslide', onFlashcardCloseSlideClicked);

		//when page is cached or updated, add presentation to localstorage
		if(typeof applicationCache !== "undefined"){
			applicationCache.addEventListener('cached', function(){
				V.Storage.addPresentation(presentation);
			}, false);
			applicationCache.addEventListener('updateready', function(){
				V.Storage.addPresentation(presentation);
			}, false);
		}

		//Load onresize event
		//Prevent multiple consecutively calls
		var multipleOnResize = undefined;
		window.onresize = function(){
			if(typeof multipleOnResize === "undefined"){
				multipleOnResize = false;
				setTimeout(function(){
					if(!multipleOnResize){
						multipleOnResize = undefined;
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

		if (mobile){
			eMobile.bindViewerMobileEventListeners();
		}

		bindedEventListeners = true;
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
		if(!bindedEventListeners){
			return;
		}

		$(document).unbind('keydown', handleBodyKeyDown);

		$(document).off('click', '#page-switcher-start');
		$(document).off('click', '#page-switcher-end');

		$(document).off('click', '#back_arrow', V.Slides.backwardOneSlide);
		$(document).off('click', '#forward_arrow', V.Slides.forwardOneSlide);

		$(document).off('click', '#closeButton');

		$(document).off('click','.close_subslide', onFlashcardCloseSlideClicked);

		if(typeof applicationCache !== "undefined"){
			applicationCache.removeEventListener('cached', function() {
				V.Storage.addPresentation(presentation);
			}, false);
			applicationCache.removeEventListener('updateready', function() {
				V.Storage.addPresentation(presentation);
			}, false);
		}

		if (mobile){
			eMobile.unbindViewerMobileEventListeners();
		}

		bindedEventListeners = false;
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
	};


	/////////////////
	// Flashcard events
	//////////////////

	/**
	 * Function called when a poi is clicked
	 * 'event' can be a delegate click event or a number
	 */
	var onFlashcardPoiClicked = function(poiId){
		var poi = V.Flashcard.getPoiData(poiId);
		if(poi!==null){
			V.Slides.openSubslideFromPosition(poi,true);
		}
	};

	var onFlashcardCloseSlideClicked = function(event){
		var close_slide_id = event.target.id.substring(5); //the id is close3
		V.Slides.closeSubslide(close_slide_id,true);
	};
	
	return {
			init 							: init,
			bindViewerEventListeners		: bindViewerEventListeners,
			unbindViewerEventListeners		: unbindViewerEventListeners,
			onFlashcardPoiClicked 			: onFlashcardPoiClicked,
			onFlashcardCloseSlideClicked 	: onFlashcardCloseSlideClicked
	};

}) (VISH,jQuery);