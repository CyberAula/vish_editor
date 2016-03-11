VISH.Editor.Object.PDF = (function(V,$,undefined){

	var init = function(){
	};

	var generateWrapper = function(url){
		return V.Object.PDF.generateWrapper(url);
	};
	
	var generatePreviewWrapper = function(url){
		var objectWrapper = V.Object.PDF.generateWrapper(url);
		var previewWrapper = $(objectWrapper);
		$(previewWrapper).addClass("objectPreview");
		return V.Utils.getOuterHTML(previewWrapper);
	};
		
	return {
		init					: init,
		generateWrapper 		: generateWrapper,
		generatePreviewWrapper 	: generatePreviewWrapper
	};

}) (VISH, jQuery);