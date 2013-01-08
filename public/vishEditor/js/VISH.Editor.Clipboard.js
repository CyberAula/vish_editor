VISH.Editor.Clipboard = (function(V,$,undefined){

	var stack;

	var init = function() {
		stack = [null,null];
	};

	var copy = function(element,type) {
		if(element){
			stack[0] = $(element).clone()[0];
			stack[1] = type;
		}
	};

	var paste = function() {
	  if(!stack[0]){
	  	return;
	  }

	  switch(stack[1]){
	  	case VISH.Constant.Clipboard.Slide:
	  		var slideToCopy = VISH.Editor.Utils.replaceIdsForSlide($(stack[0]).clone()[0]);

	  		if(typeof slideToCopy != "undefined"){
	  			if(VISH.Slides.getSlideType(slideToCopy) === VISH.Constant.FLASHCARD){
	  				var flashcardId = $(slideToCopy).attr("id");
		  			var the_flashcard_excursion = jQuery.extend(true, {}, VISH.Editor.Flashcard.getFlashcard(stack[0].id));
					var selectedFc = VISH.Editor.Utils.replaceIdsForFlashcardJSON(the_flashcard_excursion,flashcardId);
					VISH.Editor.Flashcard.addFlashcard(selectedFc);
					//And now we add the points of interest with their click events to show the slides
			  		for(index in selectedFc.pois){
			  			var poi = selectedFc.pois[index];
			        	V.Flashcard.addArrow(selectedFc.id, poi, true);
			  		}
			  		VISH.Editor.Events.bindEventsForFlashcard(selectedFc);
	  			}
	  			VISH.Slides.copySlide(slideToCopy);
	  		}
	  		break;
	  	default:
	  		break;
	  }
	};

	return {
			init 		: init,
			copy		: copy,
			paste		: paste
	};

}) (VISH,jQuery);