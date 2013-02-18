VISH.Editor.Events = (function(V,$,undefined){
	
	var bindedEventListeners = false;

	var init = function() {
	  if(V.Editing){
	  	bindEditorEventListeners();
	  }
	};

	/* Event listeners */
	var ctrlDown = false;

	var handleBodyKeyDown = function(event) {
	  switch (event.keyCode) {
	    case 39: // right arrow	    
			if(V.Editor.Slides.isSlideFocused()) {
				V.Slides.forwardOneSlide();
				event.preventDefault();
			}
			break;
	    case 37: // left arrow
	    	if(V.Editor.Slides.isSlideFocused()) {
				V.Slides.backwardOneSlide();
	    		event.preventDefault();    		
	    	}
	    	break;
	    case 17: //ctrl key
	    	ctrlDown = true;
	    	break;	
	    case 67: //cKey
			if(V.Editor.Slides.isSlideFocused()) {
				if(ctrlDown){
					if(V.Slides.getCurrentSlideNumber()){
						V.Editor.Clipboard.copy(V.Slides.getCurrentSlide(),V.Constant.Clipboard.Slide);
					}
				}
			}
	    	break;	
	    case 86: //vKey
		    if(V.Editor.Slides.isSlideFocused()) {
			    if(ctrlDown){
			    	V.Editor.Clipboard.paste();
		    	}
		    }
		    break;
		case 46: //Supr key
			if(V.Editor.Slides.isSlideFocused()) {
				V.Editor.Slides.removeSlide(V.Slides.getCurrentSlideNumber());
			}
			break;	
	  }
	};

	var handleBodyKeyUp = function(event) {
	  switch (event.keyCode) {
	    case 17: //ctrl key
	    	ctrlDown = false;
	    	break;	     
	  }
	};

	/**
	 * function called when a poi is clicked
	 */
	 var _onFlashcardPoiClicked = function(event){
	 	if(V.Editor.getMode()===V.Constant.PRESENTATION){
	 		V.Slides.openSubslide(event.data.slide_id,true);
	 	}
	 };


   var _onFlashcardCloseSlideClicked = function(event){
	    var close_slide = event.target.id.substring(5); //the id is close3
	    V.Slides.closeSubslide(close_slide,true);
   };

   var bindEditorEventListeners = function(){
   		if(!bindedEventListeners){
   			var presentation = V.Editor.getPresentation();

			$(document).bind('keydown', handleBodyKeyDown); 
			$(document).bind('keyup', handleBodyKeyUp);
			$(document).on('click','.close_subslide', _onFlashcardCloseSlideClicked);

			if((V.Editing)&&(presentation)){
				for(index in presentation.slides){
		      		var slide = presentation.slides[index];
	      			switch(slide.type){
	      				case V.Constant.FLASHCARD:
		      				bindEventsForFlashcard(slide);
	      					break;
	      				case V.Constant.VTOUR:
	      					break;
	      			}
	  		    }
			}

			//Allow keyboard events with the first click
			$(window.document).on('click', function(){
				window.focus();
			});

	  		bindedEventListeners = true;
		} 
   };

   var bindEventsForFlashcard = function(slide){
		//Add the points of interest with their click events to show the slides
		for(ind in slide.pois){
			var poi = slide.pois[ind];
			$(document).on('click', "#" + poi.id,  { slide_id: poi.slide_id}, _onFlashcardPoiClicked);
		}
   };

	var unbindEditorEventListeners = function(){
		if(bindedEventListeners){
			var presentation = V.Editor.getPresentation();
			if(presentation.type === "presentation"){
				$(document).unbind('keydown', handleBodyKeyDown);
				$(document).unbind('keyup', handleBodyKeyUp);
	  		}			
	      	for(index in presentation.slides){
				if(presentation.slides[index].type === "flashcard"){
					//and now we add the points of interest with their click events to show the slides
	  				for(ind in presentation.slides[index].pois){
	  					var poi = presentation.slides[index].pois[ind];
	  					$(document).off('click', "#" + poi.id,  { slide_id: poi.slide_id}, _onFlashcardPoiClicked);
	  				}
	      			$(document).off('click','.close_subslide', _onFlashcardCloseSlideClicked);
      			}
  		    }

			$(window.document).off('click', function(){
				window.focus();
			});

	  		bindedEventListeners = false;
		}
	};
	
	return {
			init 		: init,
			bindEditorEventListeners	: bindEditorEventListeners,
			bindEventsForFlashcard		: bindEventsForFlashcard,
			unbindEditorEventListeners	: unbindEditorEventListeners
	};

}) (VISH,jQuery);