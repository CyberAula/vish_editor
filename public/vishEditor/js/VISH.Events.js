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
		} else {
			bindedEventListeners = true;
		}

		$(document).bind('keydown', handleBodyKeyDown); 

		$(document).on('click', '#page-switcher-start', function(){
			V.Slides.backwardOneSlide();
		});
		$(document).on('click', '#page-switcher-end', function(){
			V.Slides.forwardOneSlide();
		});

		$(document).on('click', '#closeButton', function(event){
			event.stopPropagation();
			event.preventDefault();
			var comeBackUrl = V.SlideManager.getOptions()["comeBackUrl"];
			if(comeBackUrl){
				window.top.location.href = V.SlideManager.getOptions()["comeBackUrl"];
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

		var presentation = V.SlideManager.getCurrentPresentation();
		for(index in presentation.slides){
			var slide = presentation.slides[index];
			switch(slide.type){
				case V.Constant.FLASHCARD:
					//Add the points of interest with their click events to show the slides
					for(ind in slide.pois){
						var poi = slide.pois[ind];
						$(document).on('click', "#" + poi.id,  { poi_id: poi.id}, onFlashcardPoiClicked);
					}
					break;
				case V.Constant.VTOUR:
					break;
			}
		}

		//when page is cached or updated, add presentation to localstorage
		if(typeof applicationCache !== "undefined"){
			applicationCache.addEventListener('cached', function() {
				V.Storage.addPresentation(presentation);
			}, false);
			applicationCache.addEventListener('updateready', function() {
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
	}

	var unbindViewerEventListeners = function(){
		if(!bindedEventListeners){
			console.log("return unbindViewerEventListeners");
			return;
		} else {
			bindedEventListeners = false;
		}

		$(document).unbind('keydown', handleBodyKeyDown);

		$(document).off('click', '#page-switcher-start');
		$(document).off('click', '#page-switcher-end');

		$(document).off('click', '#back_arrow', V.Slides.backwardOneSlide);
		$(document).off('click', '#forward_arrow', V.Slides.forwardOneSlide);

		$(document).off('click', '#closeButton');

		$(document).off('click','.close_subslide', onFlashcardCloseSlideClicked);

		var presentation = V.SlideManager.getCurrentPresentation();
		for(index in presentation.slides){
			var slide = presentation.slides[index];
			switch(slide.type){
				case V.Constant.FLASHCARD:
					//Add the points of interest with their click events to show the slides
					for(ind in slide.pois){
						var poi = slide.pois[ind];
						$(document).off('click', "#" + poi.id, onFlashcardPoiClicked);
					}
					break;
				case V.Constant.VTOUR:
					break;
			}
		}

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
	var onFlashcardPoiClicked = function(event){
		if(typeof event === "string"){
			var poiId = event;
		} else if(typeof event === "object"){
			var poiId = event.data.poi_id;
		} else {
			return;
		}
		var poi = V.Flashcard.getPoiData(poiId);
		if(poi!==null){
			V.Slides.openSubslide(poi.slide_id,true);
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