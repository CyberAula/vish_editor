VISH.Editor.Object.GoogleDOC = (function(V,$,undefined){

	var init = function(){
	};

	var generateWrapper = function(url){
		return V.Object.GoogleDOC.generateWrapper(url);
	};
	
	var generatePreviewWrapper = function(url){
		var objectWrapper = V.Object.GoogleDOC.generateWrapper(url);
		previewWrapper = $(objectWrapper);
		$(previewWrapper).addClass("objectPreview");
		return V.Utils.getOuterHTML(previewWrapper);
	};
		
	return {
		init					: init,
		generatePreviewWrapper 	: generatePreviewWrapper,
		generateWrapper 		: generateWrapper
	};

}) (VISH, jQuery);
