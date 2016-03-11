VISH.Object.GoogleDOC = (function(V,$,undefined){

	var init = function(){
	};

	var generateWrapper = function(url){
		url = V.Utils.checkUrlProtocol(url);
		return "<iframe src='https://docs.google.com/viewer?url=" + url + "&embedded=true'></iframe>";
	};
		
	return {
		init					: init,
		generateWrapper 		: generateWrapper
	};

}) (VISH, jQuery);
