VISH.Editor.Preview = (function(V,$,undefined){

	var presentation_preview;

	/*
	 * function to prepare the preview of the excursion as it is now
	 * <a id="preview_circle" href="/vishEditor/viewer.html"></a>
	 */
	var prepare = function(){
		$("#preview_circle").attr("href", "/vishEditor/viewer.html#" + V.Slides.getCurrentSlideNumber());
		presentation_preview = V.Editor.saveExcursion();		
	};

	var getPreview = function(){
		return presentation_preview;
	}

	return {
		prepare	 				: prepare,
		getPreview 				: getPreview
	};

}) (VISH, jQuery);