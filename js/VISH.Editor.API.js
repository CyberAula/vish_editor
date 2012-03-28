VISH.Editor.API = (function(V,$,undefined){
	
	var init = function(){
	}
	
	var requestVideos = function(text,successCallback,failCallback){
		if(typeof successCallback == "function"){
      successCallback(VISH.Debugging.shuffleJson(VISH.Samples.API.videoList['videos']));
    }
	}
	
	var requestRecomendedVideos = function(successCallback,failCallback){
		if(typeof successCallback == "function"){
			successCallback(VISH.Samples.API.videoList['videos']);
		}
  }
	
	
	return {
		init					          : init,
		requestVideos           : requestVideos,
		requestRecomendedVideos : requestRecomendedVideos
	};

}) (VISH, jQuery);
