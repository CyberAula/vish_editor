VISH.Editor.Events = (function(V,$,undefined){
	
	var bindedEventListeners = false;

	var init = function() {
	  if(V.Editing){
	  	bindEditorEventListeners();
	  }
	};

	/* Event listeners */
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
	  }
	};

   var bindEditorEventListeners = function(){
   		if(!bindedEventListeners){
			if(V.SlideManager.getPresentationType() === "presentation"){
				$(document).bind('keydown', handleBodyKeyDown);  
	      	}	
		} 
		bindedEventListeners = true;
   }

	var unbindEditorEventListeners = function(){
		if(bindedEventListeners){
			if(V.SlideManager.getPresentationType() === "presentation"){
				$(document).unbind('keydown', handleBodyKeyDown); 
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