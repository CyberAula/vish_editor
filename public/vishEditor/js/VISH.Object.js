VISH.Object = (function(V,$,undefined){
			
	var init = function(){
	}
	

	///////////////////////////////////////
	/// OBJECT INFO
	///////////////////////////////////////
	
	/*
	 * Wrapper can be: "embed","object, "iframe" or null if the object is a source url without wrapper.
	 * Type is the source type and can be: "swf" , "youtube" , etc.
	 * 
	 */
	function objectInfo(wrapper,source,sourceType) {
		this.wrapper=wrapper;
		this.source = source;
		this.type=sourceType;
	} 
	
	/*
	 * Return object type
	 */
	var getObjectInfo = function(object){
		var wrapper = null;
		
		//Determine wrapper
		var element = $(object)[0];
		if(typeof element != 'undefined'){
			var wrapper = element.tagName;
		}
		
		//Determine source type
		var source = _getSourceFromObject(object,wrapper);
		var type = _getTypeFromSource(source);

		return new objectInfo(wrapper,source,type);
	}
	
	var _getSourceFromObject = function (object,wrapper){
		switch (wrapper){
			case null:
				return object;
			case "EMBED":
				return $(object).attr("src");
			case "OBJECT":
				if (typeof $(object).attr("src") != 'undefined'){
				  return $(object).attr("src");
				}
				if (typeof $(object).attr("data") != 'undefined'){
				  return $(object).attr("data");
				}
				return "source not founded";
			case "IFRAME": 
				return $(object).attr("src");
			default:
				VISH.Debugging.log("Unrecognized object wrapper: " + wrapper)
				return null;
			break;
		}
	}
	
	
	/**
	 * Patterns
	 */                                                         		
	
	var _getTypeFromSource = function(source){

		var http_urls_pattern=/(http(s)?:\/\/)([aA-zZ0-9%=_&+?])+([./-][aA-zZ0-9%=_&+?]+)*[/]?/g
		var www_urls_pattern = /(www[.])([aA-zZ0-9%=_&+?])+([./-][aA-zZ0-9%=_&+?]+)*[/]?/g
		var youtube_video_pattern=/(http(s)?:\/\/)?(((youtu.be\/)([aA-zZ0-9]+))|((www.youtube.com\/((watch\?v=)|(embed\/)))([aA-z0-9Z&=.])+))/g 
		var html5VideoFormats = ["mp4","webm","ogg"]  
		var imageFormats = ["jpg","jpeg","png","gif","bmp"]

		if(typeof source != "string"){
			return null
		}

		if(source.match(youtube_video_pattern)!=null){
			return "youtube";
		}
			
		//Purge options
		source = source.split('?')[0]

		var extension = (source.split('.').pop()).toLowerCase();

		if(imageFormats.indexOf(extension)!="-1"){
			return "image";
		}

		if(extension=="swf"){
			return "swf";
		}

		if(extension=="pdf"){
			return "pdf";
		}

		if(html5VideoFormats.indexOf(extension)!="-1"){
			return "HTML5";
		}

		if((source.match(http_urls_pattern)!=null)||(source.match(www_urls_pattern)!=null)){
			return "web";
		}

		return extension;
	}
	

	return {
		init							: init,
		getObjectInfo					: getObjectInfo
	};

}) (VISH, jQuery);
