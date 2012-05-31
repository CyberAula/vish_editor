VISH.Editor.API = (function(V,$,undefined){
	
	var init = function(){}
	
	
	/**
	 * function to call to VISH and request videos in json format
	 * The request is:
	 * GET /search.json?type=video&q=text
	 */
	var requestVideos = function(text, successCallback, failCallback){
		
		if (VISH.Debugging.isDevelopping()) {
      if(typeof successCallback == "function"){
        var result = jQuery.extend({}, VISH.Samples.API.videoList);

        switch(text){
          case "dummy":
            result['videos'] = VISH.Samples.API.videoListDummy['videos'];
            break;
          case "little":
            result['videos'] = VISH.Debugging.shuffleJson(VISH.Samples.API.videoListLittle['videos']);
            break;
          default:
            result['videos'] = VISH.Debugging.shuffleJson(VISH.Samples.API.videoList['videos']);
        }
            
        successCallback(result);
      }
      return;
    }
		
		_requestByType("video", text, successCallback, failCallback);		
	};
	
	
	/**
	 * function to call to VISH and request recommended videos
	 */
	var requestRecomendedVideos = function(successCallback, failCallback){
		if (VISH.Debugging.isDevelopping()) {
	      if(typeof successCallback == "function"){
	            var result = VISH.Samples.API.videoList;
	            result['videos'] = VISH.Debugging.shuffleJson(VISH.Samples.API.videoList['videos']);
	            successCallback(result);
	      }
          return;
        }
        else{
        	_requestByType("video", "", successCallback, failCallback);
        }
  };
	
	
	/**
	 * function to call to VISH and request flash objects in json format
	 * The request is:
	 * GET /search.json?type=flash&q=text
	 */
	var requestFlashes = function(text, successCallback, failCallback){
		
		if (VISH.Debugging.isDevelopping()) {
      if(typeof successCallback == "function"){
        var result = jQuery.extend({}, VISH.Samples.API.flashList);

        switch(text){
          case "dummy":
            result['flashes'] = VISH.Samples.API.flashListDummy['flashes'];
            break;
          case "little":
            result['flashes'] = VISH.Debugging.shuffleJson(VISH.Samples.API.flashListLittle['flashes']);
            break;
          default:
            result['flashes'] = VISH.Debugging.shuffleJson(VISH.Samples.API.flashList['flashes']);
        }
            
        successCallback(result);
      }
      return;
    }
		
		_requestByType("swfs", text, successCallback, failCallback);	
	};
	
	
	/**
	 * function to call to VISH and request recommended flash objects
	 */
	var requestRecomendedFlash = function(successCallback, failCallback){
		if (VISH.Debugging.isDevelopping()) {
			if(typeof successCallback == "function"){
				var result = VISH.Samples.API.flashList;
				result['flashes'] = VISH.Debugging.shuffleJson(VISH.Samples.API.flashList['flashes']);
        successCallback(result);
      }
	  }
	  else{
        	_requestByType("swfs", "", successCallback, failCallback);
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
				var result = jQuery.extend({}, VISH.Samples.API.imageList);

			  switch(text){
					case "dummy":
	          result['pictures'] = VISH.Samples.API.imageListDummy['pictures'];
					  break;
					case "little":
	          result['pictures'] = VISH.Debugging.shuffleJson(VISH.Samples.API.imageListLittle['pictures']);
					  break;
					default:
	          result['pictures'] = VISH.Debugging.shuffleJson(VISH.Samples.API.imageList['pictures']);
				}
            
        successCallback(result);
      }
      return;
    }
		 		     
    _requestByType("picture", text, successCallback, failCallback);		
	};
	
	/**
	 * function to call to VISH and request recommended videos
	 */
	var requestRecomendedImages = function(successCallback, failCallback){
    if (VISH.Debugging.isDevelopping()) {
      if(typeof successCallback == "function"){
            var result = VISH.Samples.API.imageList;
            result['pictures'] = VISH.Debugging.shuffleJson(VISH.Samples.API.imageList['pictures']);
            successCallback(result);
      }
      return;
    }
    else{
        	_requestByType("picture", "", successCallback, failCallback);
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
	
	
	/**
   * function to call to VISH and request tags
   */
	var tags;
	
  var requestTags = function(successCallback, failCallback){
		
		if((tags)&&(typeof successCallback == "function")){
			successCallback(tags);
			return;
		}
		
    if (VISH.Debugging.isDevelopping()) {
      if(typeof successCallback == "function"){
				    tags = VISH.Samples.API.tagsList['tags'];
            successCallback(VISH.Samples.API.tagsList['tags']);
      }
      return;
    }
		
    $.ajax({
        type: "GET",
        url: "/tags.json?tag=",
        dataType:"html",
        success:function(response){
            if(typeof successCallback == "function"){
              tags = JSON.parse(response);
              successCallback(tags);
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
		init					          : init,
		requestVideos           : requestVideos,
		requestRecomendedVideos : requestRecomendedVideos,
		requestImages           : requestImages,
		requestRecomendedImages : requestRecomendedImages,
		requestFlashes			    : requestFlashes,
		requestRecomendedFlash  : requestRecomendedFlash,
		requestTags             : requestTags
	};

}) (VISH, jQuery);
