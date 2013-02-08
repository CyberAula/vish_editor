VISH.Events = (function(V,$,undefined){

	//Dependencies
	var eMobile;

	//Own vars
	var bindedEventListeners = false;
	var mobile;


	var init = function() {
		mobile = (!V.Status.getDevice().desktop);
		eMobile = VISH.Events.Mobile;
		if(!V.Editing){
			eMobile.init();
			bindViewerEventListeners();
		}
	};

	var bindViewerEventListeners = function(){
		if(bindedEventListeners){
			return;
		} else {
			bindedEventListeners = true;
		}

		$(document).bind('keydown', handleBodyKeyDown); 

		$(document).on('click', '#page-switcher-start', V.Slides.backwardOneSlide);
		$(document).on('click', '#page-switcher-end', V.Slides.forwardOneSlide);

		$(document).on('click', '#back_arrow', V.Slides.backwardOneSlide);
		$(document).on('click', '#forward_arrow', V.Slides.forwardOneSlide);	

		$(document).on('click', '#closeButton', function(){
			window.top.location.href = V.SlideManager.getOptions()["comeBackUrl"];
		});

		$(document).on('click','.close_subslide', _onFlashcardCloseSlideClicked);

		var presentation = V.SlideManager.getCurrentPresentation();
		for(index in presentation.slides){
			var slide = presentation.slides[index];
			switch(slide.type){
				case VISH.Constant.FLASHCARD:
					//Add the points of interest with their click events to show the slides
					for(ind in slide.pois){
						var poi = slide.pois[ind];
						$(document).on('click', "#" + poi.id,  { poi_id: poi.id}, _onFlashcardPoiClicked);
					}
					break;
				case VISH.Constant.VTOUR:
					break;
			}
		}

		//when page is cached or updated, add presentation to localstorage
		if(typeof applicationCache !== "undefined"){
			applicationCache.addEventListener('cached', function() {
				VISH.LocalStorage.addPresentation(presentation);
			}, false);
			applicationCache.addEventListener('updateready', function() {
				VISH.LocalStorage.addPresentation(presentation);
			}, false);
		}

		if (mobile){
			eMobile.bindViewerMobileEventListeners();
		}
	}

	var unbindViewerEventListeners = function(){
		if(!bindedEventListeners){
			return;
		} else {
			bindedEventListeners = false;
		}

		$(document).unbind('keydown', handleBodyKeyDown); 

		$(document).off('click', '#page-switcher-start', V.Slides.backwardOneSlide);
		$(document).off('click', '#page-switcher-end', V.Slides.forwardOneSlide);

		$(document).off('click', '#back_arrow', V.Slides.backwardOneSlide);
		$(document).off('click', '#forward_arrow', V.Slides.forwardOneSlide);

		$(document).off('click', '#closeButton');

		$(document).off('click','.close_subslide', _onFlashcardCloseSlideClicked);

		var presentation = V.SlideManager.getCurrentPresentation();
		for(index in presentation.slides){
			var slide = presentation.slides[index];
			switch(slide.type){
				case VISH.Constant.FLASHCARD:
					//Add the points of interest with their click events to show the slides
					for(ind in slide.pois){
						var poi = slide.pois[ind];
						$(document).off('click', "#" + poi.id,  { poi_id: poi.id}, _onFlashcardPoiClicked);
					}
					break;
				case VISH.Constant.VTOUR:
					break;
			}
		}

		if(typeof applicationCache !== "undefined"){
			applicationCache.removeEventListener('cached', function() {
				VISH.LocalStorage.addPresentation(presentation);
			}, false);
			applicationCache.removeEventListener('updateready', function() {
				VISH.LocalStorage.addPresentation(presentation);
			}, false);
		}

		if (mobile){
			eMobile.unbindViewerMobileEventListeners();
		}

	};


	/////////////////
	// Keyboard events
	//////////////////

	var handleBodyKeyDown = function(event) {
		switch (event.keyCode) {
			case 38: // up arrow
			case 39: // right arrow	    
				V.Slides.forwardOneSlide();
				event.preventDefault();
				break;
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
	var _onFlashcardPoiClicked = function(event){
		if(typeof event === "string"){
			var poiId = event;
		} else if(typeof event === "object"){
			var poiId = event.data.poi_id;
		} else {
			return;
		}
		var poi = VISH.Flashcard.getPoiData(poiId);
		if(poi!==null){
			V.Slides.openSubslide(poi.slide_id,true);
		}
	};

	var _onFlashcardCloseSlideClicked = function(event){
		var close_slide_id = event.target.id.substring(5); //the id is close3
		V.Slides.closeSubslide(close_slide_id,true);
	};
	
	return {
			init 						: init,
			bindViewerEventListeners	: bindViewerEventListeners,
			unbindViewerEventListeners	: unbindViewerEventListeners
	};

}) (VISH,jQuery);