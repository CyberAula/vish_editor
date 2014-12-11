VISH.Editor.Object.GoogleDOC = (function(V,$,undefined){

	var init = function(){
	};

	var generateWrapper = function(url){
		return "<iframe src='http://docs.google.com/viewer?url=" + url + "&embedded=true'></iframe>";
	};
	
	var generatePreviewWrapper = function(url){
		return "<iframe class='objectPreview' src='http://docs.google.com/viewer?url=" + url + "&embedded=true'></iframe>";
	};
		
	return {
		init					: init,
		generatePreviewWrapper 	: generatePreviewWrapper,
		generateWrapper 		: generateWrapper
	};

}) (VISH, jQuery);
