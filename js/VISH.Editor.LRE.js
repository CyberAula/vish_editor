VISH.Editor.LRE =  (function(V,$,undefined){

	var VISH_LRE_URL = "";
	//the thumbnails url is http://lrethumbnails.eun.org/995/445995.png where 445995 is the object id
	//and 995 are the last three digits
	var LRE_THUMBNAILS_URL = "http://lrethumbnails.eun.org/";
	var DEFAULT_LIMIT = 40; //number of items to search
	var DEFAULT_MAXAGE = 20;
	var DEFAULT_MINAGE = 4;
	var DEFAULT_LANGUAGE = "en";

	//These providers have 'X-Frame-Options' to 'SAMEORIGIN', we remove them from the list of results
	//The othe possibility to detect x-frame-options is with timeouts. See http://siderite.blogspot.com/2013/04/detecting-if-url-can-be-loaded-in-iframe.html
	var PROVIDERS_TO_REMOVE = ["KHAN", "OPENLEARN"];

	var init = function(lang){
		VISH_LRE_URL = V.LREPath;
		if(lang!="en"){
			DEFAULT_LANGUAGE = "x-mt-" + lang;
		} else {
			DEFAULT_LANGUAGE = lang;
		}
	};

	/**
	 * function to call to LRE and request images
	 * successCallback: function to pass the results if everything goes well.
	 * failCallback: function to pass the error if something fails. Format: {"error":"cnf cannot be null!"}
	 */
	var requestImages = function(text, successCallback, failCallback){
		var query = _composeLREQuery(text.split(" "), ["image"]);		     
		_requestLRE(query, DEFAULT_LIMIT, "image", successCallback, failCallback);
	};

	/**
	 * function to call to LRE and request objects (webs, etc.)
	 * successCallback: function to pass the results if everything goes well.
	 * failCallback: function to pass the error if something fails. Format: {"error":"cnf cannot be null!"}
	 */
	var requestObjects = function(text, successCallback, failCallback){
		var query = _composeLREQuery(text.split(" "), ["audio", "video", "data", "text"]);		     
		_requestLRE(query, DEFAULT_LIMIT, "object", successCallback, failCallback);
	};

	/**
	 * Generic function to call LRE and request for content with some params
	 * VISH acts as a proxy, so this method sends it the query and the number of objects to receive
	 * VISH will call the LRE server and will take the returned ids and will ask for them
	 *      returning the array with the metadata for the results, so this client do not need to do two requests
	 * limit: number of items to return
	 * response_type: the type of array that we want as response (it can be "image" or "object")
	 * successCallback: function to pass the results if everything goes well
	 * failCallback: function to pass the error if something fails. Format: {"error":"cnf cannot be null!"}
	 * The request is:
	 * GET /lre/search?q=query&limit=10
	 */
	var _requestLRE = function(query, limit, response_type, successCallback, failCallback){
		$.ajax({
			type: "GET",
			url: VISH_LRE_URL + "?q="+ query +"&limit="+ limit,
			dataType: "json",
			success:function(response){
				if(typeof successCallback == "function"){
					var formatedResponse = formatLREResponse(response, response_type);
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
	 * lrt: array of learning resource types. See the LRE Metadata Application Profile at page 35 of http://lreforschools.eun.org/c/document_library/get_file?
	 *		p_l_id=10970&folderId=12073&name=DLFE-1.pdf (i.e: audio, data, image, text, video)
	 *      if not specified we request for all lrt
	 * language: language of the learning object searched as ISO639-1 code -> example: en, es, pt
	 * NOT USED MAXAGE AND MINAGE BECAUSE LRE RETURNED NO RESULTS:
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
		if(lrt && lrt.length>0){
			//this is an or clause, we search for lrt "image" or "video" or ...
			query += "(";
			for(var j=0;j<lrt.length;j++){
				query += "(lrt["+lrt[j]+"])";			
			}
			query += ")";
		}     	     	
		return query;	
	};

	/**
	 * function to change the metadata returned by the 
	 * LRE to a simple format similar to the one that we use in VISH repository
	 * IMPORTANT: THIS METHOD REMOVES FROM THE ARRAY THE "PROVIDERS_TO_REMOVE" PROVIDERS
	 */
	 var formatLREResponse = function(lre_response, type){
		var the_array = new Array();;
		var the_return_list = {};
		if(lre_response && lre_response["results"]){	 		 
			var results_array = lre_response["results"];
			for(var i=0;i<results_array.length;i++){
				var the_elem = _formatLREElem(results_array[i], type);	
				if(the_elem){
					//it can be null if it can't be represented as an image, because sometimes it is a website or other thing
					//also will be null if the provider is in "PROVIDERS_TO_REMOVE" array
					the_array.push(the_elem);
				}
			}
			switch (type){
				case "image":
				  the_return_list.pictures = the_array;
				  break;
				case "object":
				  the_return_list = the_array;
				  break;				
			}
		}
		return the_return_list;
	 };

	 /**
	  * Function to format one element from LRE to our format
	  * if type is "image" returns null if not a raw image (sometimes it is a website or other thing)
	  * The final format is for "image": 
		{
			"id":54,
			"title":"ClintEastwood.jpg",
			"description":null,
			"author":"Demo",
			"src":"http://www.dan-dare.org/dan%20simpsons/TheSimpsonsEveryoneEver800.jpg"
		}
		and for "object":
		{
		  'id'     : '1534',
		  'title'         :  'Game Strauss',
		  'description'   :  'Fichero PDF',
		  'author'        :  'Conspirazzi',
		  'object'        :  'http://www.conspirazzi.com/e-books/game-strauss.pdf',
		  'thumbnail'	  : 'http://lrethumbnails.eun.org/995/445995.png'
		}
	  *
	  */
	 var _formatLREElem = function(the_element, type){
		if(type==="object" || (type==="image" && _checkValidImgElem(the_element))){
			var tmp_elem = {};
			tmp_elem.id = the_element.meta.id;
			if($.inArray(the_element.meta.provider, PROVIDERS_TO_REMOVE)>=0){
				//This element is in the black list, return null
				return null;
			}
			tmp_elem.author = the_element.meta.provider;
			var title_and_desc = _getTitleAndDescInMyLang(the_element.meta.langBlocks);
			tmp_elem.title = title_and_desc.title;
			tmp_elem.description = title_and_desc.description;
			switch (type){
				case "image":
				  tmp_elem.src = _getValidSRC(the_element, type);
				  if(!tmp_elem.src){
					return null;
				}
				break;
				case "object":
				tmp_elem.object = _getValidSRC(the_element, type);
				if(!tmp_elem.object){
					return null;
				}
				break;
			}
			tmp_elem.thumbnail = LRE_THUMBNAILS_URL + tmp_elem.id.toString().slice(-3) + "/" + tmp_elem.id.toString() + ".png";
			return tmp_elem;
		};
	 };

	var _isValidImageUrl = function (url, callback) {
		var img = new Image();
		img.onerror = function() { 
			V.Debugger("This is not an image: " + url );
			callback(url, false); };
		img.onload =  function() { callback(url, true); };
		img.src = url;
	};

	 /**
	  * function to get the SRC from the my_element
	  */
	var _getValidSRC = function(my_element, type){
		if(!my_element){
			return "";
		}

		if(my_element.meta && my_element.meta.expressions){
			//expressions is an array
			for(var i=0;i<my_element.meta.expressions.length;i++){
				var exp = my_element.meta.expressions[i];
				//manifestations inside expessions is also an array
				for(var j=0;j<exp.manifestations.length;j++){ 		
					if(type==="image" && exp.manifestations[j].player == "webBrowser"){
						return exp.manifestations[j].urls[0];
					}
					else if(type==="object" && (exp.manifestations[j].player == "webBrowser" || exp.manifestations[j].player == "landingPage" || exp.manifestations[j].player == "printable") ){
						return exp.manifestations[j].urls[0];
					}
				}
			}
			
		}
		return "";
	};

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
		var default_title_and_desc = {};
		if(langBlocks.length==1){
			default_title_and_desc.title = langBlocks[0].title;
			default_title_and_desc.description = langBlocks[0].description;
			return default_title_and_desc;	
		}
		for(var i=0;i<langBlocks.length;i++){ 			
			if(langBlocks[i].language==DEFAULT_LANGUAGE){
				title_and_desc.title = langBlocks[i].title;
				title_and_desc.description = langBlocks[i].description;
				filled_lang = true;
			}
			if(langBlocks[i].language=="en" || langBlocks[i].language=="en-GB"){
				default_title_and_desc.title = langBlocks[i].title;
				default_title_and_desc.description = langBlocks[i].description;				
			} 			
		}
		if(filled_lang){
			return title_and_desc;
		}
		else{
			return default_title_and_desc;
		}
	};

	return {
		init						: init,
		requestImages				: requestImages,
		requestObjects				: requestObjects,
		formatLREResponse			: formatLREResponse
	};

}) (VISH, jQuery);