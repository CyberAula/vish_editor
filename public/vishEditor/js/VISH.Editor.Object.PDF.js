VISH.Editor.Object.PDF = (function(V,$,undefined){
		
	var init = function(){
	};	
	
	var generateWrapperForPdf = function(url){
		return "<iframe src='http://docs.google.com/viewer?url=" + url + "&embedded=true'></iframe>";
	}
	
	var generatePreviewWrapperForPdf = function(url){
		return "<iframe class='objectPreview' src='http://docs.google.com/viewer?url=" + url + "&embedded=true'></iframe>";
	}
			
	return {
		init: init,
		generatePreviewWrapperForPdf : generatePreviewWrapperForPdf,
		generateWrapperForPdf : generateWrapperForPdf
	};

}) (VISH, jQuery);
