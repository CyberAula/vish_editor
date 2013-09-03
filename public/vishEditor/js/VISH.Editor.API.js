 /**
  * Provide an API with ViSH (Virtual Science Hub)
  */

VISH.Editor.API = (function(V,$,undefined){
	
	var init = function(){}

  /**
   * function to call to VISH and request excursions in json format
   * The request is:
   * GET /excursions/search.json?type=&q=text
   */
  var requestExcursions = function(text, successCallback, failCallback){
	if(V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER){
	  if(typeof successCallback == "function"){
		var result = V.Samples.API.excursionsList;
		setTimeout(function(){
		  successCallback(result);
		}, 2000);
	  }
	  return;
	}
	   
	_requestByType("excursion", text, successCallback, failCallback);
  };


  /**
   * function to call to VISH and request recommended excursions
   */
  var requestRecomendedExcursions = function(successCallback, failCallback){
	if (V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER) {
	  if(typeof successCallback == "function"){
			var result = V.Samples.API.excursionsList;
			setTimeout(function(){
			  successCallback(result);
			}, 2000);
	  }
	  return;
	}

	_requestByType("excursion", "", successCallback, failCallback);
  };


  /**
   * function to call to VISH and request smartcards (flashcards and virtual tours) in json format
   * The request is:
   * GET /excursions/search.json?type=smartcard&q=text
   */
  var requestSmartcards = function(text, successCallback, failCallback){
	if (V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER) {
	  if(typeof successCallback == "function"){
		var result = V.Samples.API.smartcardList;
		setTimeout(function(){
		  successCallback(result);
		}, 2000);
	  }
	  return;
	}
			 
	_requestByType("smartcard", text, successCallback, failCallback);   
  };

  /**
   * function to call to VISH and request recommended smartcards
   */
  var requestRecomendedSmartcards = function(successCallback, failCallback){
	if (V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER) {
	  if(typeof successCallback == "function"){
			var result = V.Samples.API.smartcardList;
			setTimeout(function(){
			  successCallback(result);
			}, 2000);
	  }
	  return;
	}
	
	_requestByType("smartcard", "", successCallback, failCallback);
  };


	/**
	 * function to call to VISH and request videos in json format
	 * The request is:
	 * GET /search.json?type=video&q=text
	 */
	var requestVideos = function(text, successCallback, failCallback){
		
		if (V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER) {
	  if(typeof successCallback == "function"){
		var result = jQuery.extend({}, V.Samples.API.videoList);

		switch(text){
		  case "dummy":
			result['videos'] = V.Samples.API.videoListDummy['videos'];
			break;
		  case "little":
			result['videos'] = V.Debugging.shuffleJson(V.Samples.API.videoListLittle['videos']);
			break;
		  default:
			result['videos'] = V.Debugging.shuffleJson(V.Samples.API.videoList['videos']);
		}
			
		setTimeout(function(){
		  successCallback(result);
		}, 2000);
	  }
	  return;
	}
		
		_requestByType("video", text, successCallback, failCallback);		
	};
	
	
	/**
	 * function to call to VISH and request recommended videos
	 */
	var requestRecomendedVideos = function(successCallback, failCallback){
		if (V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER) {
		  if(typeof successCallback == "function"){
				var result = V.Samples.API.videoList;
				result['videos'] = V.Debugging.shuffleJson(V.Samples.API.videoList['videos']);
			  setTimeout(function(){
				successCallback(result);
			  }, 2000);
		  }
		return;
	}
		
	_requestByType("video", "", successCallback, failCallback);
  };
	 
		
	/**
	 * function to call to VISH and request videos in json format
	 * The request is:
	 * GET /search.json?type=picture&q=text
	 */
	var requestImages = function(text, successCallback, failCallback){
		if(V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER){
			var result = jQuery.extend({}, V.Samples.API.imageList);
			switch(text){
				case "dummy":
					result['pictures'] = V.Samples.API.imageListDummy['pictures'];
					break;
				case "little":
					result['pictures'] = V.Debugging.shuffleJson(V.Samples.API.imageListLittle['pictures']);
					break;
				case "server error":
					result = undefined;
					break;
				default:
					result['pictures'] = V.Debugging.shuffleJson(V.Samples.API.imageList['pictures']);
			}

			setTimeout(function(){
				if((typeof result == "undefined")&&(typeof failCallback == "function")){
					failCallback();
				} else if(typeof successCallback == "function"){
					successCallback(result);
				}
			}, 2000);

			return;
		}

		_requestByType("picture", text, successCallback, failCallback);		
	};
	
	/**
	* function to call to VISH and request recommended videos
	*/
	var requestRecomendedImages = function(successCallback, failCallback){
		if (V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER){
			if(typeof successCallback == "function"){
				var result = V.Samples.API.imageList;
				result['pictures'] = V.Debugging.shuffleJson(V.Samples.API.imageList['pictures']);
				setTimeout(function(){
					successCallback(result);
				}, 2000);
			}
			return;
		}

		_requestByType("picture", "", successCallback, failCallback);
	};
	
		
		  
  /**
   * function to call to VISH and request live objects in json format
   * The request is:
   * GET /search.json?live=1&q=
   */
  var requestLives = function(text, successCallback, failCallback){
	
	if (V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER) {
	  if(typeof successCallback == "function"){
		var result = jQuery.extend({}, V.Samples.API.liveList);

		switch(text){
		  case "dummy":
			result = V.Samples.API.liveListDummy;
			break;
		  case "little":
			result = V.Debugging.shuffleJson(V.Samples.API.liveListLittle);
			break;
		  default:
			result = V.Debugging.shuffleJson(V.Samples.API.liveList);
		}
		setTimeout(function(){
		  successCallback(result);
		}, 2000);
	  }
	  return;
	}
	
	_requestByType("live", text, successCallback, failCallback);  
  };
  
  
  /**
   * function to call to VISH and request recommended lives objects
   */
  var requestRecomendedLives = function(successCallback, failCallback){
	if (V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER) {
	  if(typeof successCallback == "function"){
		var result = V.Debugging.shuffleJson(V.Samples.API.liveList);
		setTimeout(function(){
		  successCallback(result);
		}, 2000);
	  }
			return;
	}
		
		_requestByType("live", "", successCallback, failCallback);
   };
		
		
			  
  /**
   * function to call to VISH and request objects in json format
   * The request is:
   * GET /search.json?object=1&q=
   */
  var requestObjects = function(text, successCallback, failCallback){
	
	if (V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER) {
	  if(typeof successCallback == "function"){
		var result = jQuery.extend({}, V.Samples.API.objectList);

		switch(text){
		  case "dummy":
			result = V.Samples.API.objectListDummy;
			break;
		  case "little":
			result = V.Debugging.shuffleJson(V.Samples.API.objectListLittle);
			break;
		  default:
			result = V.Debugging.shuffleJson(V.Samples.API.objectList);
		}
		  
		setTimeout(function(){
		  successCallback(result);
		}, 2000);
	  }
	  return;
	}
	
	_requestByType("object", text, successCallback, failCallback);  
  };
  
  
  /**
   * function to call to VISH and request recommended lives objects
   */
  var requestRecomendedObjects = function(successCallback, failCallback){
	if (V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER) {
	  if(typeof successCallback == "function"){
		var result = V.Debugging.shuffleJson(V.Samples.API.objectList);
		setTimeout(function(){
		  successCallback(result);
		}, 2000);
	  }
	  return;
	}
	
	_requestByType("object", "", successCallback, failCallback);
   };
		
		
	/**
	 * generic function to call VISH and request by query and type
	 * The request is:
	 * GET /search.json?type=type&q=query
	 */    
  var _requestByType = function(type, query, successCallback, failCallback){
		
		if((type==="live")||(type==="object")){
			_requestResourceType(type,query, successCallback, failCallback);
			return;
		}else if((type==="excursion")||(type==="smartcard")){
	  _requestExcursionType(type,query, successCallback, failCallback);
	  return;
	}
		
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
   * Specific function to call VISH and request lives
   * The request is:
   * GET /resources/search.json?live=1&q=
   */    
  var _requestResourceType = function(type, query, successCallback, failCallback){
	$.ajax({
			  type: "GET",
			  url: "/resources/search.json?" + type + "=1&q="+ query,
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
   * Specific function to call VISH and request excursions
   * The request is:
   * GET /excursions/search.json?type=&q=query
   */    
  var _requestExcursionType = function(type, query, successCallback, failCallback){
	if(type === "excursion"){
	  type = "";
	}

	$.ajax({
			  type: "GET",
			  url: "/excursions/search.json?type=" + type + "&q="+ query,
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
	var requestTags = function(successCallback, failCallback){
		if (V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER) {
			if(typeof successCallback == "function"){
				setTimeout(function(){
					successCallback(V.Samples.API.tagsList['tags']);
				}, 2000);
			};
			return;
		}

		$.ajax({
			type: "GET",
			url: "/tags.json?mode=popular&limit=100",
			dataType:"html",
			success:function(response){
				if(typeof successCallback == "function"){
					var tagsJSON = JSON.parse(response);
					var tags = [];
					if(tagsJSON.length>0){
						$.each(tagsJSON, function(index, tagJSON) {
							tags.push(tagJSON.value);
						});
					};
					successCallback(tags);
				}
			},
			error:function (xhr, ajaxOptions, thrownError){
				if(typeof failCallback == "function"){
					failCallback();
				};
			}
		});
	};
	
	
	/**
   * Function to get the available avatars from the server, they should be at /excursion_thumbnails.json
   */
	var requestThumbnails = function(successCallback, failCallback){
		if (V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER) {
			if(typeof successCallback == "function"){
				setTimeout(function(){
					successCallback(V.Samples.API.thumbnailsList);
				}, 2000);
			};
			return;
		};

		$.ajax({
			async: false,
			type: 'GET',
			url: '/excursion_thumbnails.json',
			dataType: 'json',
			success: function(data) {
				if(typeof successCallback == "function"){
					successCallback(data);
				}
			},
			error: function(xhr, ajaxOptions, thrownError){
				if(typeof failCallback == "function"){
					failCallback(xhr, ajaxOptions, thrownError);
				}
			}
		});
	}

	var uploadTmpJSON = function(json, successCallback, failCallback){
		if (V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER){
			if(typeof successCallback == "function"){
			setTimeout(function(){
				var iframe = $("#hiddenIframeForAjaxDownloads");
				$(iframe).attr("src",'http://vishub.org/excursions/tmpJson.json?fileId=1');
					successCallback();
				},2000);
			}
			return;
		}

		$.ajax({
			async: false,
			type: 'POST',
			url: '/excursions/tmpJson.json',
			dataType: 'json',
			data: { 
				"authenticity_token" : V.User.getToken(),
				"json": JSON.stringify(json)
			},
			success: function(data) {
				if((data)&&(data.fileId)){
					V.Editor.API.downloadTmpJSON(data.fileId);
					if(typeof successCallback == "function"){
						successCallback();
					}
				} else if(typeof failCallback == "function"){
					failCallback();
				}
			},
			error: function(xhr, ajaxOptions, thrownError){
				if(typeof failCallback == "function"){
					failCallback(xhr, ajaxOptions, thrownError);
				}
			}
		});
	}

	var downloadTmpJSON = function(fileId){
		var filename = fileId
		var iframe = $("#hiddenIframeForAjaxDownloads");
		$(iframe).attr("src",'/excursions/tmpJson.json?fileId='+fileId+'&filename='+filename);
	}

	
	return {
		init						: init,
		requestExcursions           : requestExcursions,
		requestRecomendedExcursions : requestRecomendedExcursions,
		requestSmartcards           : requestSmartcards,
		requestRecomendedSmartcards : requestRecomendedSmartcards,
		requestVideos               : requestVideos,
		requestRecomendedVideos     : requestRecomendedVideos,
		requestImages               : requestImages,
		requestRecomendedImages     : requestRecomendedImages,
		requestObjects              : requestObjects,
		requestRecomendedObjects    : requestRecomendedObjects,
		requestLives                : requestLives,
		requestRecomendedLives      : requestRecomendedLives,
		requestTags                 : requestTags,
		requestThumbnails           : requestThumbnails,
		uploadTmpJSON               : uploadTmpJSON,
		downloadTmpJSON             : downloadTmpJSON
	};

}) (VISH, jQuery);
