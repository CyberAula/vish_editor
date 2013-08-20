VISH.Editor.Preview = (function(V,$,undefined){

	var presentation_preview = null;

	var init = function(){
		//Wait for loading...
		setTimeout(function(){
			_realInit();
		},2000);
	}

	var _realInit = function(){
		$("#preview_action").fancybox({
			'width'				: 910,
			'height'			: 680,
			'padding'			: 0,
			'autoScale'     	: false,
			'transitionIn'		: 'none',
			'transitionOut'		: 'none',
			'type'				: 'iframe',
			'onStart'			: function(){
				if(presentation_preview === null){
					_prepare();
				}
				V.Editor.Utils.Loader.unloadObjectsInEditorSlide(V.Slides.getCurrentSlide());
			},
			'onClosed'			: function() {
				presentation_preview = null;
				V.Editor.Utils.Loader.loadObjectsInEditorSlide(V.Slides.getCurrentSlide());
			},
			'onComplete': function() {
				$("#fancybox-wrap").css('top','45px');
				$("#fancybox-wrap").css('left','135px');
				$("#fancybox-frame").addClass("vishEditorIframe");	
			}
		});
	}

	var preview = function(options){
		_prepare(options);
		$("#preview_action").trigger('click');
	}


	/*
	 * Function to prepare the preview of the presentation as it is now
	 */
	var _prepare = function(options){
		var slideNumberToPreview;

		if((!options)||(!options["slideNumberToPreview"])||(typeof options["slideNumberToPreview"] !== "number")){
			slideNumberToPreview =  V.Slides.getCurrentSlideNumber();
		} else {
			slideNumberToPreview =  options["slideNumberToPreview"];
		}

		if(V.Configuration.getConfiguration()["mode"]=="vish"){
			$("#preview_action").attr("href",  "/excursions/preview#" + slideNumberToPreview);
		} else if(V.Configuration.getConfiguration()["mode"]=="noserver"){
			$("#preview_action").attr("href", "/vishEditor/viewer.html#" + slideNumberToPreview);
		} else if(V.Configuration.getConfiguration()["mode"]=="node"){
			//Code here
		}

		if((!options)||(!options["presentationJSON"])||(typeof options["presentationJSON"] !== "object")){
			presentation_preview = V.Editor.savePresentation({preview: true});
		} else {
			presentation_preview = options["presentationJSON"];
		}

		if((options)&&(options["insertMode"])&&(typeof options["insertMode"] == "boolean")){
			presentation_preview.insertMode = options["insertMode"];
		}
		
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