VISH.Object = (function(V,$,undefined){
			
	var init = function(){
	};

	///////////////////////////////////////
	/// OBJECT INFO
	///////////////////////////////////////
	
	/*
	 * Wrapper can be: "embed","object, "iframe", "video" or null if the object is a source url without wrapper.
	 * Type is the source type and can be: "swf" , "youtube" , etc.
	 */
	function objectInfo(wrapper,source,sourceType) {
		this.wrapper=wrapper;
		this.source = source;
		this.type=sourceType;
	}; 
	
	/*
	 * Return object type
	 */
	var getObjectInfo = function(object){
		var wrapper = null;
		
		//Determine wrapper
		if(typeof object == "string"){
			var videoPattern = new RegExp("^<video","g");
			if(videoPattern.exec(object) != null){
				wrapper = "VIDEO";
			}

			var audioPattern = new RegExp("^<audio","g");
			if(audioPattern.exec(object) != null){
				wrapper = "AUDIO";
			}
		}

		if((wrapper===null)||(typeof wrapper == "undefined")){
			var element = $(object)[0];
			if(typeof element != 'undefined'){
				wrapper = element.tagName;
			}
		}
		
		//Determine source type
		var source = _getSourceFromObject(object,wrapper);
		
		var type;
		switch (wrapper){
			case "VIDEO":
				type = V.Constant.MEDIA.HTML5_VIDEO;
				break;
			case "AUDIO":
				type = V.Constant.MEDIA.HTML5_AUDIO;
				break;
			case "IFRAME":
				if($(object).attr("objecttype")==V.Constant.MEDIA.SCORM_PACKAGE){
					type = V.Constant.MEDIA.SCORM_PACKAGE;
					break;
				}
			default:
				type = _getTypeFromSource(source);
		};

		return new objectInfo(wrapper,source,type);
	};
	
	var _getSourceFromObject = function(object,wrapper){
		switch (wrapper){
			case null:
				return object;
			case V.Constant.WRAPPER.EMBED:
				return $(object).attr("src");
			case V.Constant.WRAPPER.OBJECT:
				if (typeof $(object).attr("src") != 'undefined'){
				  return $(object).attr("src");
				}
				if (typeof $(object).attr("data") != 'undefined'){
				  return $(object).attr("data");
				}
				return "source not founded";
			case V.Constant.WRAPPER.IFRAME:
				return $(object).attr("src");
			case V.Constant.WRAPPER.VIDEO:
				return V.Video.HTML5.getSources(object);
			case V.Constant.WRAPPER.AUDIO:
				return V.Audio.HTML5.getSources(object);
			default:
				V.Debugging.log("Unrecognized object wrapper: " + wrapper);
				return null;
			break;
		}
	};
	
	
	/**
	 * Patterns
	 */                                                         		
	
	var _getTypeFromSource = function(source){
		if((typeof source == "object")&&(typeof source.length == "number")&&(source.length > 0)){
			source = source[0];
		};

		var http_urls_pattern=/(http(s)?:\/\/)([aA-zZ0-9%=_&+?])+([./-][aA-zZ0-9%=_&+?]+)*[/]?/g
		var www_urls_pattern = /(www[.])([aA-zZ0-9%=_&+?])+([./-][aA-zZ0-9%=_&+?]+)*[/]?/g
		var youtube_video_pattern=/(http(s)?:\/\/)?(((youtu.be\/)([aA-zZ0-9-]+))|((www.youtube.com\/((watch\?v=)|(embed\/)|(v\/)))([aA-z0-9-Z&=.])+))/g
		var html5VideoFormats = ["mp4","webm","ogg"];
		var imageFormats = ["jpg","jpeg","png","gif","bmp","svg"];
		var audioFormats = ["mp3", "wav","ogg"];

		if(typeof source != "string"){
			return null
		}

		if(source.match(youtube_video_pattern)!=null){
			return V.Constant.MEDIA.YOUTUBE_VIDEO;
		}
			
		//Purge options
		source = source.split('?')[0];

		var extension = getExtensionFromSrc(source);

		if(imageFormats.indexOf(extension)!="-1"){
			return V.Constant.MEDIA.IMAGE;
		}

		if(extension=="swf"){
			return V.Constant.MEDIA.FLASH;
		}

		if(extension=="pdf"){
			return V.Constant.MEDIA.PDF;
		}

		if(html5VideoFormats.indexOf(extension)!="-1"){
			return V.Constant.MEDIA.HTML5_VIDEO;
		}

		if(audioFormats.indexOf(extension)!="-1"){
			return V.Constant.MEDIA.HTML5_AUDIO;
		}

		if(extension=="json"){
			return V.Constant.MEDIA.JSON;
		}

		if(extension=="doc"){
			return V.Constant.MEDIA.DOC;
		}

		if((extension=="ppt")||(extension=="pptx")){
			return V.Constant.MEDIA.PPT;
		}

		if(extension=="odp"){
			return V.Constant.MEDIA.PPT;
		}

		if((source.match(http_urls_pattern)!=null)||(source.match(www_urls_pattern)!=null)){
			return V.Constant.MEDIA.WEB;
		}

		return extension;
	};
	
	var getExtensionFromSrc = function(source){
		return (source.split('.').pop().split('&')[0]).toLowerCase();
	};

	return {
		init							: init,
		getExtensionFromSrc 			: getExtensionFromSrc,
		getObjectInfo					: getObjectInfo
	};

}) (VISH, jQuery);
