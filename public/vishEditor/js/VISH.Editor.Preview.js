VISH.Editor.Preview = (function(V,$,undefined){

	var presentation_preview = null;

	var init = function(){
		//Wait for loading...
		setTimeout(function(){
			_realInit();
		},2000);
	}

	var _realInit = function(){
		$("img#preview_circle").fancybox({
			'width'				: 875,
			'height'			: 656,
			'padding'			: 0,
			'autoScale'     	: false,
			'transitionIn'		: 'none',
			'transitionOut'		: 'none',
			'type'				: 'iframe',
			'onStart'			: function(){
				if(presentation_preview === null){
					_prepare();
				}
				VISH.Editor.Utils.Loader.unloadObjectsInEditorSlide(VISH.Slides.getCurrentSlide());
			},
			'onClosed'			: function() {
				presentation_preview = null;
				VISH.Editor.Utils.Loader.loadObjectsInEditorSlide(VISH.Slides.getCurrentSlide());
			},
			'onComplete': function() {
				$("#fancybox-wrap").css('top','60px');
				$("#fancybox-wrap").css('left','-2px');   			
			}
		});
	}

	var preview = function(options){
		_prepare(options);
		$("img#preview_circle").trigger('click');
	}


	/*
	 * Function to prepare the preview of the presentation as it is now
	 * options["forcePresentation"] is a boolean to indicate if we should preview only the slide, 
	   although we might be in flashcard
	 *
	 */
	var _prepare = function(options){
		var slideNumberToPreview;
		var forcePresentation;

		if((!options)||(!options["slideNumberToPreview"])||(typeof options["slideNumberToPreview"] !== "number")){
			slideNumberToPreview =  V.Slides.getCurrentSlideNumber();
		} else {
			slideNumberToPreview =  options["slideNumberToPreview"];
		}

		if((!options)||(!options["forcePresentation"])||(typeof options["forcePresentation"] !== "boolean")){
			forcePresentation =  false;	
		} else {
			forcePresentation =  options["forcePresentation"];
		}

		if(VISH.Configuration.getConfiguration()["mode"]=="vish"){
			$("#preview_circle").attr("href",  "/excursions/preview#" + slideNumberToPreview);
		} else if(VISH.Configuration.getConfiguration()["mode"]=="noserver"){
			$("#preview_circle").attr("href", "/vishEditor/viewer.html#" + slideNumberToPreview);
		} else if(VISH.Configuration.getConfiguration()["mode"]=="node"){
			//Code here
		}
			
		presentation_preview = V.Editor.savePresentation({preview: true, forcePresentation: forcePresentation});
	};

	var getPreview = function(){
		return presentation_preview;
	};


	return {
		init 			: init,
		preview 		: preview,
		getPreview 		: getPreview
	};

}) (VISH, jQuery);