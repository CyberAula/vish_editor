VISH.Object = (function(V,$,undefined){
			
	var init = function(){
		V.Object.PDF.init();
		V.Object.GoogleDOC.init();
		V.Object.Webapp.init();
	};

	///////////////////////////////////////
	/// OBJECT INFO
	///////////////////////////////////////
	
	/*
	 * Wrapper can be: "embed","object, "iframe", "video" or null if the object is a source url without wrapper.
	 * Type is the source type and can be: "swf" , "youtube" , etc.
	 */
	function objectInfo(wrapper,source,sourceType){
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
				var objectTypeAttr = $(object).attr("objecttype");
				if(typeof objectTypeAttr == "string"){
					if(objectTypeAttr==V.Constant.MEDIA.SCORM_PACKAGE){
						type = V.Constant.MEDIA.SCORM_PACKAGE;
						break;
					} else if(objectTypeAttr==V.Constant.MEDIA.WEB_APP){
						type = V.Constant.MEDIA.WEB_APP;
						break;
					}
				}
			default:
				type = _getTypeFromSource(source);
		};

		return new objectInfo(wrapper,source,type);
	};
	
	var _getSourceFromObject = function(object,wrapper){
		var source = null;

		switch (wrapper){
			case null:
				source = object;
				break;
			case V.Constant.WRAPPER.EMBED:
				source = $(object).attr("src");
				break;
			case V.Constant.WRAPPER.OBJECT:
				if (typeof $(object).attr("src") != 'undefined'){
					source = $(object).attr("src");
				} else if (typeof $(object).attr("data") != 'undefined'){
					source = $(object).attr("data");
				}
				break;
			case V.Constant.WRAPPER.IFRAME:
				source = $(object).attr("src");
				break;
			case V.Constant.WRAPPER.VIDEO:
				return V.Video.HTML5.getSources(object);
			case V.Constant.WRAPPER.AUDIO:
				return V.Audio.HTML5.getSources(object);
			default:
				V.Debugging.log("Unrecognized object wrapper: " + wrapper);
				break;
		}

		if((wrapper==null)||(wrapper==V.Constant.WRAPPER.IFRAME)){
			var googledoc_pattern=/(^http:\/\/docs.google.com\/viewer\?url=)/g
			if(source.match(googledoc_pattern)!=null){
				source = source.replace("http://docs.google.com/viewer?url=","").replace("&embedded=true","");
			}
		}
		
		return source;
	};
	
	
	/**
	 * Patterns
	 */                                                         		
	
	var _getTypeFromSource = function(source){
		if((typeof source == "object")&&(source !== null)&&(typeof source.length == "number")&&(source.length > 0)){
			source = source[0];
		}

		if(typeof source != "string"){
			return null;
		}


		var http_urls_pattern=/(http(s)?:\/\/)([aA-zZ0-9%=_&+?])+([./-][aA-zZ0-9%=_&+?]+)*[/]?/g
		var www_urls_pattern = /(www[.])([aA-zZ0-9%=_&+?])+([./-][aA-zZ0-9%=_&+?]+)*[/]?/g
		var youtube_video_pattern=/(http(s)?:\/\/)?(((youtu.be\/)([aA-zZ0-9-]+))|((www.youtube.com\/((watch\?v=)|(embed\/)|(v\/)))([aA-z0-9-Z&=.])+))/g
		
		var html5VideoFormats = ["mp4","webm","ogg"];
		var imageFormats = ["jpg","jpeg","png","gif","bmp","svg"];
		var audioFormats = ["mp3", "wav","ogg"];


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

		if((extension=="doc")||(extension=="docx")){
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
