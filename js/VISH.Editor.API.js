VISH.Editor.API = (function(V,$,undefined){
	
	var init = function(){
	}
	
	/**
	 * function to call to VISH and request videos in json format
	 * The request is:
	 * GET /search.json?type=video&q=text
	 */
	var requestVideos = function(text, successCallback, failCallback){
		_requestByType("video", text, successCallback, failCallback);		
		/*
			if(typeof successCallback == "function"){
	      		successCallback(VISH.Debugging.shuffleJson(VISH.Samples.API.videoList['videos']));
	    	}
    	*/
	};
	
	/**
	 * function to call to VISH and request recommended videos
	 */
	var requestRecomendedVideos = function(successCallback, failCallback){
		if(typeof successCallback == "function"){
			successCallback(VISH.Samples.API.videoList);
		}
   };
	
	
	/**
	 * function to call to VISH and request flash objects in json format
	 * The request is:
	 * GET /search.json?type=flash&q=text
	 */
	var requestFlashes = function(text, successCallback, failCallback){		
		_requestByType("swf", text, successCallback, failCallback);	
	};
	
	
	/**
	 * function to call to VISH and request recommended flash objects
	 */
	var requestRecomendedFlash = function(successCallback, failCallback){
		if(typeof successCallback == "function"){
			successCallback(VISH.Samples.API.flashList['flashes']);
		}
   };
    
    /**
	 * function to call to VISH and request videos in json format
	 * The request is:
	 * GET /search.json?type=picture&q=text
	 */
	var requestImages = function(text, successCallback, failCallback){
		if (VISH.Debugging.isDevelopping()) {
      if(typeof successCallback == "function"){
            successCallback(VISH.Samples.API.imageList);
      }
			return;
	  }		     
    _requestByType("picture", text, successCallback, failCallback);		
	};
	
	/**
	 * function to call to VISH and request recommended videos
	 */
	var requestRecomendedImages = function(successCallback, failCallback){
		if(typeof successCallback == "function"){
			if (VISH.Debugging.isDevelopping()) {
	  	  successCallback(VISH.Samples.API.imageList);
	    }
			return
		}
   };
    
    /**
     * generic function to call VISH and request by query and type
     * The request is:
	 * GET /search.json?type=type&q=query
     */    
    var _requestByType = function(type, query, successCallback, failCallback){
    	$.ajax({
                type: "GET",
                url: "/search.json?type="+ type +"&q="+ query,
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
    };
	
	
	return {
		init					: init,
		requestVideos           : requestVideos,
		requestRecomendedVideos : requestRecomendedVideos,
		requestImages           : requestImages,
		requestRecomendedImages : requestRecomendedImages,
		requestFlashes			: requestFlashes,
		requestRecomendedFlash  : requestRecomendedFlash
	};

}) (VISH, jQuery);
