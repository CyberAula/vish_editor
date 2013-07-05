VISH.Editor.LRE =  (function(V,$,undefined){

	var VISH_LRE_URL = "";
	var DEFAULT_LIMIT = 40; //number of items to search
	var DEFAULT_MAXAGE = 20;
	var DEFAULT_MINAGE = 4;
	var DEFAULT_LANGUAGE = "en";

	var init = function(lang){
		VISH_LRE_URL = V.SearchLREPath;
		if(lang!="en"){
			DEFAULT_LANGUAGE = "x-mt-" + lang;
		}
		else{
			DEFAULT_LANGUAGE = lang;
		}
		
	};

	/**
   	 * function to call to LRE and request images
   	 */
  	var requestImages = function(text, successCallback, failCallback){
  	// 	if (V.Utils.getOptions().configuration.mode==V.Constant.NOSERVER) {
	  //     if(typeof successCallback == "function"){
			// var result = jQuery.extend({}, V.Samples.API.imageList);
		 //    result['pictures'] = V.Debugging.shuffleJson(V.Samples.API.imageList['pictures']);
			// setTimeout(function(){
	  //         successCallback(result);
	  //       }, 2000);
	  //     }
	  //     return;
	  //   }

		var query = _composeLREQuery(text.split(" "), "image");		     
	    _requestLRE(query, DEFAULT_LIMIT, successCallback, failCallback);
  	};



	/**
     * Generic function to call LRE and request for content with some params
     * VISH acts as a proxy, so this method sends it the query and the number of objects to receive
     * VISH will call the LRE server and will take the returned ids and will ask for them
     *      returning the array with the metadata for the results, so this client do not need to do two requests
     *
     * The request is:
	 * GET /lre/search?q=query&limit=10
     */    
  	var _requestLRE = function(query, limit, successCallback, failCallback){
  		$.ajax({
	          type: "GET",
	          url: VISH_LRE_URL + "?q="+ query +"&limit="+ limit,
	          dataType: "json",
	          success:function(response){
	              if(typeof successCallback == "function"){
	              	var formatedResponse = formatLREImagesResponse(response);
				    successCallback(formatedResponse);
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
     * generic function to compose a valid query to send to the LRE
     * explanations of params:
     *
	 * terms: array of terms to be searched. Example ["biology", "nature"] -> search in LRE content containing "biology" AND "nature"
	 * lrt: learning resource type. See the LRE Metadata Application Profile at page 35 of http://lreforschools.eun.org/c/document_library/get_file?
	 *		p_l_id=10970&folderId=12073&name=DLFE-1.pdf (i.e: audio, data, image, text, video)
	 * language: language of the learning object searched as ISO639-1 code -> example: en, es, pt
	 * NOT USED MAXAGE AND MINAGE BECAUSE LRE RETURNED NO RESULTS:
	 * limit: number of items to return
	 * successCallback: function to pass the results if everything goes well. Format: 
	 *                 {}
	 * failCallback: function to pass the error if something fails. Format: {"error":"cnf cannot be null!"}
	 *
	 */    
	var _composeLREQuery = function(terms, lrt){
		var query = "";
		if(terms.length==0){
			failCallback("Search terms can´t be blank");
		}
		
		for(var i=0;i<terms.length;i++){
     		query += "((content["+terms[i]+"]))";			
     	}
     	if(lrt){
     		query+="((lrt["+lrt+"]))";
     	}     	     	
     	return query;	
	};

	/**
	 * function to change the metadata returned by the 
	 * LRE to a simple format similar to the one that we use in VISH repository
	 * This method is public so I can call it from command line to test it with 
	 * V.Editor.LRE.formatLREImagesResponse(VISH.Samples.API.LREImageList)
	 */
	 var formatLREImagesResponse = function(lre_response){
	 	if(lre_response && lre_response["results"]){
	 		var imageList = {};
	 		imageList.pictures = new Array();
	 		var results_array = lre_response["results"];
	 		for(var i=0;i<results_array.length;i++){
     			var img_elem = _formatLREImageElem(results_array[i]);	
				if(img_elem){
					//it can be null if it can't be represented as an image, 
					//because sometimes it is a website or other thing
					imageList.pictures.push(img_elem);
				}
     		}
	 	}
	 	return imageList;
	 };

	 /**
	  * Function to format one image element from LRE to our format
	  * Returns null if not a raw image (sometimes it is a website or other thing)
	  * The final format is: 
	  	{
	  		"id":54,
			"title":"ClintEastwood.jpg",
			"description":null,
			"author":"Demo",
			"src":"http://www.dan-dare.org/dan%20simpsons/TheSimpsonsEveryoneEver800.jpg"
		}
	  *
	  */
	 var _formatLREImageElem = function(img_element){
	 	if(_checkValidImgElem(img_element)){
	 		var tmp_img_elem = {};
	 		tmp_img_elem.id = img_element.meta.id;
	 		tmp_img_elem.author = img_element.meta.provider;
	 		var title_and_desc = _getTitleAndDescInMyLang(img_element.meta.langBlocks);
	 		tmp_img_elem.title = title_and_desc.title;
	 		tmp_img_elem.description = title_and_desc.description;
	 		tmp_img_elem.src = _getValidImgSRC(img_element);
	 		return tmp_img_elem;
	 	};
	 };

	var _isValidImageUrl = function (url, callback) {
	    var img = new Image();
	    img.onerror = function() { 
	    	V.Debugger("This is not an image: " + url );
	    	callback(url, false); };
	    img.onload =  function() { callback(url, true); };
	    img.src = url;
	}

	 /**
	  * function to get the SRC from the img_element
	  */
	  var _getValidImgSRC = function(img_element){
		if(!img_element){
	 		return "";
	 	}
	 	if(img_element.meta && img_element.meta.expressions){
	 		//expressions is an array
	 		for(var i=0;i<img_element.meta.expressions.length;i++){
	 			var exp = img_element.meta.expressions[i];
	 			//manifestations inside expessions is also an array
	 			for(var j=0;j<exp.manifestations.length;j++){ 		
		 			if(exp.manifestations[j].player == "webBrowser"){
		 				return exp.manifestations[j].urls[0];
		 			}
		 		}
	 		}
	 		
	 	}
	 	return "";
	  }

	 /**
	  * function to check if a returned image element has any manifestation as webBrowser
	  */
	 var _checkValidImgElem = function(img_element){
	 	if(!img_element){
	 		return false;
	 	}
	 	if(img_element.meta && img_element.meta.expressions){
	 		//expressions is an array
	 		for(var i=0;i<img_element.meta.expressions.length;i++){
	 			var exp = img_element.meta.expressions[i];
	 			//manifestations inside expessions is also an array
	 			for(var j=0;j<exp.manifestations.length;j++){ 		
		 			if(exp.manifestations[j].player == "webBrowser"){
		 				return true;
		 			}
		 		}
	 		}	 		
	 	}
	 	return false;
	 };

	 /**
	  * function to get title and description in your lang or in english if not your lang present
	  */
	 var _getTitleAndDescInMyLang = function(langBlocks){
	 	var filled_lang = false;
	 	var title_and_desc = {};
	 	var english_title_and_desc = {};
 		for(var i=0;i<langBlocks.length;i++){ 			
			if(langBlocks[i].language==DEFAULT_LANGUAGE){
				title_and_desc.title = langBlocks[i].title;
				title_and_desc.description = langBlocks[i].description;
				filled_lang = true;
			}
			if(langBlocks[i].language=="en"){
				english_title_and_desc.title = langBlocks[i].title;
				english_title_and_desc.description = langBlocks[i].description;				
			} 			
 		}
 		if(filled_lang){
 			return title_and_desc;
 		}
 		else{
 			return english_title_and_desc;
 		}
	 };

	return {
		init						: init,
		requestImages  				: requestImages,
		formatLREImagesResponse   	: formatLREImagesResponse
	};

}) (VISH, jQuery);