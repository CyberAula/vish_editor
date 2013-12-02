VISH.Editor.Preview = (function(V,$,undefined){

	var presentationPreview = null;

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
				if(presentationPreview === null){
					_prepare();
				}
				V.Editor.Utils.Loader.unloadObjectsInEditorSlide(V.Slides.getCurrentSlide());
			},
			'onClosed'			: function() {
				presentationPreview = null;
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

		if((!options)||(!options["slideNumberToPreview"])||(typeof options["slideNumberToPreview"] != "number")){
			slideNumberToPreview =  V.Slides.getCurrentSlideNumber();
		} else {
			slideNumberToPreview =  options["slideNumberToPreview"];
		}

		if(V.Configuration.getConfiguration().mode==V.Constant.VISH){
			$("#preview_action").attr("href",  "/excursions/preview#" + slideNumberToPreview);
		} else if(V.Configuration.getConfiguration().mode==V.Constant.NOSERVER){
			$("#preview_action").attr("href", "/vishEditor/viewer.html#" + slideNumberToPreview);
		} else if(V.Configuration.getConfiguration().mode==V.Constant.STANDALONE){
			//Code here
		}

		if((!options)||(!options["presentationJSON"])||(typeof options["presentationJSON"] != "object")){
			presentationPreview = V.Editor.savePresentation();
		} else {
			presentationPreview = options["presentationJSON"];
		}

		if((options)&&(options["insertMode"])&&(typeof options["insertMode"] == "boolean")){
			presentationPreview.insertMode = options["insertMode"];
		}
		
	};

	var getPreview = function(){
		return presentationPreview;
	};


	return {
		init 			: init,
		preview 		: preview,
		getPreview 		: getPreview
	};

}) (VISH, jQuery);