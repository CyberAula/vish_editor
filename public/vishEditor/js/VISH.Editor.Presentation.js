VISH.Editor.Presentation = (function(V,$,undefined){

	var init = function(){
		V.Editor.Presentation.File.init();
		V.EventsNotifier.registerCallback(V.Constant.Event.onSelectedSlides, function(params){ 
			insertPresentation(params.JSON,params.acceptedSlides);
			$.fancybox.close();
		});
	};

	var _onConnect = function(origin){
		// V.Debugging.log("Communication stablished with origin " + origin);
		V.IframeAPI.registerCallback("onMessage",function(VEMessage,origin){
			// V.Debugging.log("onMessage from " + origin);
			// V.Debugging.log(VEMessage);
			var VEMessageObject = JSON.parse(VEMessage);
			if(VEMessageObject.VEevent===V.Constant.Event.onSelectedSlides){
				V.Messenger.Helper.processVEMessage(VEMessage);
			}
		});
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

		//Fix presentation (for old versions)
		presentationJSON = V.Utils.fixPresentation(presentationJSON);
		if(presentationJSON===null){
			V.Utils.showPNotValidDialog();
			$.fancybox.close();
			return;
		}

		var selectedSlides = [];
		var flashcards = [];
		var vts = [];

		for(var i=0; i<snL; i++){
			var slide = presentationJSON.slides[selectedSlideNumbers[i]-1];
			var mySlide = V.Editor.Utils.replaceIdsForSlideJSON(slide);

			if(mySlide===null){
				$.fancybox.close();
				V.Debugging.log("Not valid presentation");
				return null;
			}

			//PRE-renderer actions
			switch(mySlide.type){
				case V.Constant.FLASHCARD:
					flashcards.push(mySlide);
					break;
				case V.Constant.VTOUR:
					vts.push(mySlide);
					break;
				default:
					break;
			}

			selectedSlides.push(mySlide);
		}

		presentationJSON.slides = selectedSlides;
		V.Editor.Renderer.renderPresentation(presentationJSON);

		V.Slides.updateSlides();
		V.Slides.lastSlide();
		V.Editor.Thumbnails.redrawThumbnails(function(){
			V.Editor.Thumbnails.selectThumbnail(V.Slides.getCurrentSlideNumber());
		});

		//Unload all objects
		V.Editor.Utils.Loader.unloadAllObjects();

		//Enter in currentSlide (this will cause that objects will be shown)
		if(V.Slides.getCurrentSlideNumber()>0){
			V.Slides.triggerEnterEventById($(V.Slides.getCurrentSlide()).attr("id"));
		}

		$.fancybox.close();
	}


	return {
		init 				 	: init,
		insertPresentation		: insertPresentation,
		previewPresentation		: previewPresentation
	};

}) (VISH, jQuery);