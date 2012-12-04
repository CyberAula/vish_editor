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
			if(V.Slides.isSlideFocused()) {
				V.Slides.forwardOneSlide();
				event.preventDefault();
			}
			break;
	    case 37: // left arrow
	    	if(V.Slides.isSlideFocused()) {
				V.Slides.backwardOneSlide();
	    		event.preventDefault();    		
	    	}
	    	break;
	    case 17: //ctrl key
	    	ctrlDown = true;
	    	break;	
	    case 67: //cKey
			if(V.Slides.isSlideFocused()) {
				if(ctrlDown){
					if(VISH.Slides.getCurrentSlideNumber()){
						VISH.Editor.Clipboard.copy(VISH.Slides.getCurrentSlide(),VISH.Constant.Clipboard.Slide);
					}
				}
			}
	    	break;	
	    case 86: //vKey
		    if(V.Slides.isSlideFocused()) {
			    if(ctrlDown){
			    	VISH.Editor.Clipboard.paste();
		    	}
		    }
		    break;
		case 46: //Supr key
			if(V.Slides.isSlideFocused()) {
				VISH.Slides.removeSlide(VISH.Slides.getCurrentSlideNumber());
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


   var bindEditorEventListeners = function(){
   		if(!bindedEventListeners){
			if(V.SlideManager.getPresentationType() === "presentation"){
				$(document).bind('keydown', handleBodyKeyDown); 
				$(document).bind('keyup', handleBodyKeyUp);   
	      	}	
		} 
		bindedEventListeners = true;
   }

	var unbindEditorEventListeners = function(){
		if(bindedEventListeners){
			if(V.SlideManager.getPresentationType() === "presentation"){
				$(document).unbind('keydown', handleBodyKeyDown); 
				$(document).unbind('keyup', handleBodyKeyUp);   
	  		}
	  		bindedEventListeners = false;
		}
	};
	
	return {
			init 		: init,
			bindEditorEventListeners	: bindEditorEventListeners,
			unbindEditorEventListeners	: unbindEditorEventListeners
	};

}) (VISH,jQuery);