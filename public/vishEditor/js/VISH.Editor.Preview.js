VISH.Editor.Preview = (function(V,$,undefined){

	/*
	 * function to prepare the preview of the excursion as it is now
	 * <a id="preview_circle" href="/vishEditor/viewer.html"></a>
	 */
	var prepare = function(){
		$("#preview_circle").attr("href", "/vishEditor/viewer.html#" + V.Slides.getCurrentSlideNumber());
		presentation_preview = V.Editor.saveExcursion();		
	};



	return {
		prepare	 				: prepare
	};

}) (VISH, jQuery);