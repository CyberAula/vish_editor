VISH.Object.GoogleDOC = (function(V,$,undefined){

	var init = function(){
	};

	var generateWrapper = function(url){
		return "<iframe src='http://docs.google.com/viewer?url=" + url + "&embedded=true'></iframe>";
	};
		
	return {
		init					: init,
		generateWrapper 		: generateWrapper
	};

}) (VISH, jQuery);
