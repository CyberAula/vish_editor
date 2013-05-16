VISH.Editor.Presentation = (function(V,$,undefined){

	var init = function(){
		V.EventsNotifier.registerCallback(V.Constant.Event.onSelectedSlides, function(params){ 
			insertPresentation(params.JSON,params.acceptedSlides);
			$.fancybox.close();
		});
	};

	var _onConnect = function(origin){
		// V.Debugging.log("Communication stablished with origin " + origin);
	}

	/*
	 * Preview a presentation to insert its slides into the current presentation
	 */
	var previewPresentation = function(presentation){
		V.Editor.Preview.preview({insertMode: true, slideNumberToPreview: 1, presentationJSON: presentation});
		V.IframeAPI.init({callback: _onConnect});
	}

	/**
	 * Insert the selected slides of a slide presentation in JSON
	 */
	var insertPresentation = function(presentationJSON,selectedSlideNumbers){
		var snL = selectedSlideNumbers.length;

		if(snL<1){
			$.fancybox.close();
			return;
		}

		var selectedSlides = [];
		var flashcards = [];
		for(var i=0; i<snL; i++){
			var slide = presentationJSON.slides[selectedSlideNumbers[i]-1];
			var mySlide = V.Editor.Utils.replaceIdsForSlideJSON(slide);

			//PRE-renderer actions
			switch(mySlide.type){
				case V.Constant.FLASHCARD:
					flashcards.push(mySlide);
					break;
				default:
					break;
			}

			selectedSlides.push(mySlide);
		}

		presentationJSON.slides = selectedSlides;

		V.Editor.Renderer.renderPresentation(presentationJSON);

		V.Editor.Slides.redrawSlides();
		V.Editor.Thumbnails.redrawThumbnails();

		//POST-renderer actions
		for(var j=0; j<flashcards.length; j++){
			V.Editor.Events.bindEventsForFlashcard(flashcards[j]);
			V.Editor.Tools.Menu.updateMenuAfterAddSlide(V.Constant.FLASHCARD);
		}
		
		V.Slides.lastSlide(); 

		$.fancybox.close();
	}


	return {
		init 				 	: init,
		insertPresentation		: insertPresentation,
		previewPresentation		: previewPresentation
	};

}) (VISH, jQuery);