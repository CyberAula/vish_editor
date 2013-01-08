VISH.Editor.Clipboard = (function(V,$,undefined){

	var stack;

	var init = function() {
		stack = [null,null,null];
		// stack = [ElementToCopy,typeOfElement,Params];
	};

	var copy = function(element,type) {
		if(element){
			var params = {};

			switch(type){
				case VISH.Constant.Clipboard.Slide:
					var slideType = VISH.Slides.getSlideType(element);
					switch(slideType){
						case VISH.Constant.STANDARD:
							break;
						case VISH.Constant.FLASHCARD:
							params.flashcardExcursionJSON = jQuery.extend(true, {}, VISH.Editor.Flashcard.getFlashcard(element.id));
							break;
						default:
							break;
					}
					break;
				default:
					return;
			}

			stack[0] = VISH.Utils.getOuterHTML($(element).clone()[0]);
			stack[1] = type;
			stack[2] = params;
			
			if(VISH.Status.getDevice().features.localStorage){
				localStorage.setItem(VISH.Constant.Clipboard.LocalStorageStack,JSON.stringify(stack));
			}
		}
	};

	var paste = function() {
		//Select the stack
		if(VISH.Status.getDevice().features.localStorage){
			var storedStack = localStorage.getItem(VISH.Constant.Clipboard.LocalStorageStack);
			if(storedStack!==null){
				var myStack = JSON.parse(storedStack);
			}
		}

		if(!myStack){
			myStack = stack;
		}


		//Check selected stack and parse object to be copied
		if(!myStack[0]){
			return;
		} else {
			myStack[0] = $(myStack[0])[0];
		}


		switch(myStack[1]){
			case VISH.Constant.Clipboard.Slide:
				var slideToCopy = VISH.Editor.Utils.replaceIdsForSlide($(myStack[0]).clone()[0]);
				if(typeof slideToCopy != "undefined"){
					if(VISH.Slides.getSlideType(slideToCopy) === VISH.Constant.FLASHCARD){
						var flashcardId = $(slideToCopy).attr("id");

						if((!myStack[2])||(!myStack[2].flashcardExcursionJSON)){
							//We need flashcard excursion JSON to copy a flashcard!
							return;
						}

						var the_flashcard_excursion = myStack[2].flashcardExcursionJSON;
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