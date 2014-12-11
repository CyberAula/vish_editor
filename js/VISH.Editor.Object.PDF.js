VISH.Editor.Object.PDF = (function(V,$,undefined){

	var _pdfSupport = false;

	var init = function(){
		_pdfSupport = V.Status.getDevice().features.pdfReader;
	};

	var generateWrapper = function(url){
		if(_pdfSupport){
			return "<iframe src='" + url + "'></iframe>";
		} else {
			return V.Editor.Object.GoogleDOC.generateWrapper(url);
		}
	};
	
	var generatePreviewWrapper = function(url){
		if(_pdfSupport){
			return "<iframe class='objectPreview' src='" + url + "'></iframe>";
		} else {
			return V.Editor.Object.GoogleDOC.generatePreviewWrapper(url);
		}
	};
		
	return {
		init					: init,
		generatePreviewWrapper 	: generatePreviewWrapper,
		generateWrapper 		: generateWrapper
	};

}) (VISH, jQuery);