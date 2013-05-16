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
		VISH.IframeAPI.init({callback: _onConnect});
	}

	/**
	 *
	 */
	var insertPresentation = function(presentationJSON,selectedSlides){
		console.log(presentationJSON);
		console.log(selectedSlides);
	}

	return {
		init 				 	: init,
		insertPresentation		: insertPresentation,
		previewPresentation		: previewPresentation
	};

}) (VISH, jQuery);