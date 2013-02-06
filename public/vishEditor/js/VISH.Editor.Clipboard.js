VISH.Editor.Clipboard = (function(V,$,undefined){

	var stack;
	var _lastTimestamp;

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
							//Store WYSIWYG values
							params.textAreas = {};
							$(element).find("div[type='text']").each(function(index,textArea){
								var areaId = $(textArea).attr("areaid");
								var ckEditor = VISH.Editor.Text.getCKEditorFromZone(textArea);
								if((areaId)&&(ckEditor!==null)){
									params.textAreas[areaId] = ckEditor.getData();
								}
							});
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
		//Prevent massive copy
		if(_lastTimestamp){
			var elapsed = new Date().getTime() - _lastTimestamp;
			if(elapsed < 500){
				return;
			}
		}
		_lastTimestamp = new Date().getTime();

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
			    //Clean text areas
			    var slideToCopy = $(myStack[0]).clone()[0];
			    slideToCopy = VISH.Editor.Utils.cleanTextAreas(slideToCopy);
				slideToCopy = VISH.Editor.Utils.replaceIdsForSlide(slideToCopy);
				var newId = $(slideToCopy).attr("id");

				if(typeof slideToCopy == "undefined"){
					return;
				}

				var slideToCopyType = VISH.Slides.getSlideType(slideToCopy);

				//Pre-copy actions
				if(slideToCopyType === VISH.Constant.FLASHCARD){
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
				
				//Copy Slide
				VISH.Editor.Slides.copySlide(slideToCopy);

				//Post-copy actions
				if(slideToCopyType === VISH.Constant.STANDARD){
					if((myStack[2])&&(myStack[2].textAreas)){
						//Restore text areas
						var slideCopied = $("#"+newId);
						$(slideCopied).find("div[type='text']").each(function(index,textArea){
							var areaId = $(textArea).attr("areaid");
							if((areaId)&&(myStack[2].textAreas[areaId])){
								var data = myStack[2].textAreas[areaId];
								V.Editor.Text.launchTextEditor({}, $(textArea), data);
							}
						});
					}
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