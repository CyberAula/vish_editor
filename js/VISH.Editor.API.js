VISH.Editor.API = (function(V,$,undefined){
	
	var init = function(){
	}
	
	/**
	 * function to call to VISH and request videos in json format
	 * The request is:
	 * GET /videos.json?q=text
	 */
	var requestVideos = function(text, successCallback, failCallback){
		     
     	$.ajax({
                type: "GET",
                url: "/search.json?type=video&q="+text,
                //url: "/tmp.json",
                dataType:"html",
                success:function(response){
                    if(typeof successCallback == "function"){
                    	var resp = JSON.parse(response);
      					successCallback(resp);
    				}
                },
                error:function (xhr, ajaxOptions, thrownError){
                    if(typeof failCallback == "function"){
                    	failCallback();
                    }
                }
       });
		
		/*
			if(typeof successCallback == "function"){
	      		successCallback(VISH.Debugging.shuffleJson(VISH.Samples.API.videoList['videos']));
	    	}
    	*/
	}
	
	/**
	 * function to call to VISH and request recommended videos
	 */
	var requestRecomendedVideos = function(successCallback, failCallback){
		if(typeof successCallback == "function"){
			successCallback(VISH.Samples.API.videoList);
		}
    }
	
	
	/**
	 * function to call to VISH and request flash objects in json format
	 * Actual version is a skeleton, get sample json from local file.
	 */
	var requestFlashes = function(text, successCallback, failCallback){		
		if(typeof successCallback == "function"){
	        successCallback(VISH.Debugging.shuffleJson(VISH.Samples.API.flashList['flashes']));
	    }
	}
	
	
	/**
	 * function to call to VISH and request recommended flash objects
	 */
	var requestRecomendedFlash = function(successCallback, failCallback){
		if(typeof successCallback == "function"){
			successCallback(VISH.Samples.API.flashList['flashes']);
		}
    }
	
	
	return {
		init					: init,
		requestVideos           : requestVideos,
		requestRecomendedVideos : requestRecomendedVideos,
		requestFlashes			: requestFlashes,
		requestRecomendedFlash  : requestRecomendedFlash
	};

}) (VISH, jQuery);
