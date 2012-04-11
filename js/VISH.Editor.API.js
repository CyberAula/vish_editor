VISH.Editor.API = (function(V,$,undefined){
	
	var init = function(){
	}
	
	/**
	 * function to call to VISH and request videos in json format
	 * The request is:
	 * GET /videos.json?q=text
	 */
	var requestVideos = function(text, successCallback, failCallback){
		/*
		    //POST to http://server/excursions/
		    var params = {
		      "excursion[json]": jsonexcursion,
		      "authenticity_token" : initOptions["token"]
		    }
		    
		    $.post(initOptions["postPath"], params, function(data) {
		          document.open();
		      document.write(data);
		      document.close();
		      });
      	*/
     
     	$.ajax({
                type: "GET",
                //url: "/videos.json?q="+text,
                url: "/tmp.json",
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
			successCallback(VISH.Samples.API.videoList['videos']);
		}
  }
	
	
	return {
		init					: init,
		requestVideos           : requestVideos,
		requestRecomendedVideos : requestRecomendedVideos
	};

}) (VISH, jQuery);
