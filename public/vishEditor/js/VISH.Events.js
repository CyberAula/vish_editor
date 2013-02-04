VISH.Events = (function(V,$,undefined){
	var bindedEventListeners = false;
	var PM_TOUCH_SENSITIVITY = 200; //initially this was 15
	var MINIMUM_ZOOM_TO_ENABLE_SCROLL = 1.2; 
	var registeredEvents = [];

	var init = function() {
	  if(!V.Editing){
	  	bindViewerEventListeners();
	  }
	};

	/* Register events */
	var _registerEvent = function(eventTargetId){
		if(registeredEvents.indexOf(eventTargetId)==-1){
			registeredEvents.push(eventTargetId);
		}
	};

	var _unregisterEvent = function(eventTargetId){
		if(registeredEvents.indexOf(eventTargetId)!=-1){
			registeredEvents.splice(registeredEvents.indexOf(eventTargetId), 1);
		}
	};

	/* Event listeners */
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


	/* Touch events */

	/* Get the touches of an event
	 * Jquery does not pass the touches property in the event, and we get them from the event.originalEvent
	 */
	var getTouches = function (event){
		if(event.touches){
			return event.touches;
		} else if(event.originalEvent.touches){
			return event.originalEvent.touches;
		} else{
			return null;
		}
	};


	var handleTouchStart = function(event) {
		var touches = getTouches(event);
		if (touches.length === 1) {
			touchDX = 0;
			touchDY = 0;

			touchStartX = touches[0].pageX;
			touchStartY = touches[0].pageY;

			document.body.addEventListener('touchmove', handleTouchMove, true);
			document.body.addEventListener('touchend', handleTouchEnd, true);
			var zoom = document.documentElement.clientWidth / window.innerWidth;

			//TODO: Consider all of the event.target classes
			var firstClass = $(event.target).attr("class").split(" ")[0];
			var eventNotRegister = ((registeredEvents.indexOf(event.target.id)==-1)&&((registeredEvents.indexOf(firstClass)==-1)));

			if(zoom < MINIMUM_ZOOM_TO_ENABLE_SCROLL && eventNotRegister){
				// alert("Prevent default")
				// alert(firstClass);
				//this is because if not done, the browser can take control of the event and cancels it, 
				//because it thinks that the touch is a scroll action, so we prevent default if the zoom is lower than 1.5, 
				//and there will be no scroll below that zoom level
				event.preventDefault();
			} else {
				//Fix for Iphone devices due to Click Delegation bug
				if((VISH.Status.getDevice().iPhone)&&(VISH.Status.getDevice().browser.name===VISH.Constant.SAFARI)){
					if($(event.target).hasClass("fc_poi")){
						var poiId = event.target.id;
						_onFlashcardPoiClicked(poiId);
					} else if($(event.target).hasClass("close_subslide")){
						_onFlashcardCloseSlideClicked(event);
					}
				}
			}
		}
	};

	var handleTouchMove = function(event) {
		var touches = getTouches(event);
		if (touches.length > 1) {
			cancelTouch();
		} else {
			touchDX = touches[0].pageX - touchStartX;
			touchDY = touches[0].pageY - touchStartY;
			var zoom = document.documentElement.clientWidth / window.innerWidth;	  	
			if(zoom < MINIMUM_ZOOM_TO_ENABLE_SCROLL){
				//this is because if not done, the browser can take control of the event and cancels it, because it thinks that the touch is a scroll action
				event.preventDefault();
			}
		}
	};

	var handleTouchEnd = function(event) {	
		var dx = Math.abs(touchDX);
		var dy = Math.abs(touchDY);

		if ((dx > PM_TOUCH_SENSITIVITY) && (dy < (dx * 2 / 3))) {

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
		cancelTouch();
	};

	var cancelTouch = function() {
	  document.body.removeEventListener('touchmove', handleTouchMove, true);
	  document.body.removeEventListener('touchend', handleTouchEnd, true); 
	};

	/**
	 * function called when a poi is clicked
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


   var bindViewerEventListeners = function(){
   		if(!bindedEventListeners){
			$(document).bind('keydown', handleBodyKeyDown); 
      		$(document).on('click', '#page-switcher-start', V.Slides.backwardOneSlide);
      		$(document).on('click', '#page-switcher-end', V.Slides.forwardOneSlide);
      		$(document).on('click', '#back_arrow', V.Slides.backwardOneSlide);
      		_registerEvent("back_arrow");
      		$(document).on('click', '#forward_arrow', V.Slides.forwardOneSlide);	
      		_registerEvent("forward_arrow");
      		_registerEvent("closeButton");
      		_registerEvent("closeButtonImg");
      		$(document).on('click', '#closeButton', function(){
      			window.top.location.href = V.SlideManager.getOptions()["comeBackUrl"];
      		});
 			$(document).bind('touchstart', handleTouchStart); 
 			$(document).on('click','.close_subslide', _onFlashcardCloseSlideClicked);
 			_registerEvent("close_subslide");

 			//Register events for custom video player
 			_registerEvent("customPlayerButton");
 			_registerEvent("customPlayerControls");
	      	
	      	var presentation = V.SlideManager.getCurrentPresentation();
	      	for(index in presentation.slides){
	      		var slide = presentation.slides[index];
      			switch(slide.type){
      				case VISH.Constant.FLASHCARD:
	      				//Add the points of interest with their click events to show the slides
		  				for(ind in slide.pois){
		  					var poi = slide.pois[ind];
		  					$(document).on('click', "#" + poi.id,  { poi_id: poi.id}, _onFlashcardPoiClicked);
		  					_registerEvent(poi.id);
		  				}
      					break;
      				case VISH.Constant.VTOUR:
      					break;
      			}
  		    }

  		    //when page is cached or updated, add presentation to localstorage
  		    //if(applicationCache){
  		    //	applicationCache.addEventListener('cached', function() {VISH.LocalStorage.addPresentation(presentation);}, false);
			///	applicationCache.addEventListener('updateready', function() {VISH.LocalStorage.addPresentation(presentation);}, false);
  		    //}

    		if (!V.Status.getDevice().desktop){
				bindMobileViewerEventListeners();
			}
		} 
		bindedEventListeners = true;
   }

	var bindMobileViewerEventListeners = function(){
		window.addEventListener("load", 				function(){ _hideAddressBar(); } );
		window.addEventListener("orientationchange", 	function(){ _hideAddressBar(); } );
		$(window).on('orientationchange',function(){
			V.ViewerAdapter.setupSize();      
		});
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

	var unbindViewerEventListeners = function(){
		if(bindedEventListeners){
			$(document).unbind('keydown', handleBodyKeyDown); 
			$(document).off('click', '#page-switcher-start', V.Slides.backwardOneSlide);
	  		$(document).off('click', '#page-switcher-end', V.Slides.forwardOneSlide);
	  		_unregisterEvent("back_arrow");
	  		$(document).off('click', '#back_arrow', V.Slides.backwardOneSlide);
	  		_unregisterEvent("forward_arrow");
	  		$(document).off('click', '#forward_arrow', V.Slides.forwardOneSlide);
	  		_unregisterEvent("closeButton");
	  		_unregisterEvent("closeButtonImg");
	  		$(document).off('click', '#closeButton');
	  		$(document).unbind('touchstart', handleTouchStart); 
  		
  			var presentation = V.SlideManager.getCurrentPresentation();
	      	for(index in presentation.slides){
				if(presentation.slides[index].type === "flashcard"){
	  				for(ind in presentation.slides[index].pois){
	  					var poi = presentation.slides[index].pois[ind];
	  					$(document).off('click', "#" + poi.id,  { poi_id: poi.id}, _onFlashcardPoiClicked);
	  				}
	      			$(document).off('click','.close_subslide', _onFlashcardCloseSlideClicked);
      			}
  		    }
	  		bindedEventListeners = false;
		}
	};
	
	return {
			init 		: init,
			bindViewerEventListeners	: bindViewerEventListeners,
			unbindViewerEventListeners	: unbindViewerEventListeners
	};

}) (VISH,jQuery);