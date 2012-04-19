VISH.Editor.Object = (function(V,$,undefined){
		
	var init = function(){
		VISH.Editor.Object.Repository.init();
	    var urlInput = $("#tab_flash_from_url_content").find("input.url");
	    $(urlInput).watermark('Paste SWF file URL');
		var uploadInput = $("#tab_flash_upload_content").find("input.upload");
	    $(uploadInput).watermark('Select SWF file to upload');
	}
	
	var onLoadTab = function(){
	}	
	
	/*
	 * Wrapper can be: "embed","object, "iframe" or null if the object is a source url without wrapper.
	 * Type is the source type and can be: "swf" , "youtube" , etc.
	 * 
	 */
	function objectInfo(wrapper,sourceType) {
		this.wrapper=wrapper;
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

		return new objectInfo(wrapper,type);
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
			console.log("Unrecognized object wrapper: " + wrapper)
            break;
		}
	}
	
	
	/**
	 * Patterns
	 */
	var http_urls_pattern=/(http(s)?:\/\/)([aA-zZ0-9%=_&+?])+([./-][aA-zZ0-9%=_&+?]+)*[/]?/g
	var www_urls_pattern = /(www[.])([aA-zZ0-9%=_&+?])+([./-][aA-zZ0-9%=_&+?]+)*[/]?/g
	var youtube_video_pattern=/(http(s)?:\/\/)?(((youtu.be\/)([aA-zZ0-9]+))|((www.youtube.com\/((watch\?v=)|(embed\/)))([aA-z0-9Z&=.])+))/g 
	                                                                           		
	
	var _getTypeFromSource = function(source){
		if(typeof source != "string"){
			return "Invalid source"
		}
		var extension = source.split('.').pop();
		
		if(source.match(youtube_video_pattern)!=null){
			return "youtube";
		}
		
		if(extension=="swf"){
			return extension;
		}
		
		if((source.match(http_urls_pattern)!=null)||(source.match(www_urls_pattern)!=null)){
			return "web";
		}
		
		return extension;
	}
	
	/*
	 * Resize object and its wrapper automatically
	 */
	var resizeObject = function(id,width){
		var proportion = $("#" + id).height()/$("#" + id).width();
			
		$("#" + id).width(width);
		$("#" + id).height(width*proportion);
		
		var parent = $("#" + id).parent();
		$(parent).width(width);
		$(parent).height(width*proportion);
	}
	
	
	var renderObjectPreview = function(object){
		var objectInfo = getObjectInfo(object.content);
		if(objectInfo.wrapper == null){
			//Put inside a embed
			return "<embed class='objectPreview' src='" + object.content + "'></embed>"
		} else {
			var wrapperPreview = $(object.content);
			$(wrapperPreview).addClass('objectPreview')
			$(wrapperPreview).removeAttr('width')
			$(wrapperPreview).removeAttr('height')
			return wrapperPreview;
		}
	}
	
  /**
   * Returns a object prepared to draw.   * 
   * param area: optional param indicating the area to add the object, used for editing excursions
   */
	var drawObject = function(object, area){
		var current_area;
	  	if(area){
	  		current_area = area;
	  	}
	  	else{
	  		current_area = VISH.Editor.getCurrentArea();
	  	}
		
		var objectInfo = getObjectInfo(object);
		switch (objectInfo.wrapper){
	      case null:
		    //Draw object from source		    
		    switch (objectInfo.type){
		      case "swf":
		        V.Editor.Object.Flash.drawFlashObjectWithSource(object);
			    break;
			  case "youtube":
			    //V.Editor.Video.Youtube.drawVideoObject(object);
			    break;
			  default:
				 console.log("Unrecognized object source type: " + objectInfo.type) 
			     break;
			}
		    break;
		  case "EMBED":
			drawObjectWithWrapper(object, current_area);
		    break;
		  case "OBJECT":
			drawObjectWithWrapper(object, current_area);
		    break;
		  case "IFRAME": 
			drawObjectWithWrapper(object, current_area);
		    break;  
		  default:
			console.log("Unrecognized object wrapper: " + objectInfo.wrapper)
            break;
		}
	}
	
	
	var drawObjectWithWrapper = function(wrapper, current_area){
	  var template = VISH.Editor.getTemplate();

	  var nextWrapperId = VISH.Editor.getId();
	  var idToDrag = "draggable" + nextWrapperId;
	  var idToResize = "resizable" + nextWrapperId;
	  current_area.attr('type','object');
	   
	  var wrapperDiv = document.createElement('div');
	  wrapperDiv.setAttribute('id', idToDrag);
	  $(wrapperDiv).addClass('object_wrapper')
	  $(wrapperDiv).addClass(template + "_object")
	  
	  var wrapperTag = wrapper
	  $(wrapperTag).attr('id', idToResize );
	  $(wrapperTag).attr('class', template + "_object");
	  $(wrapperTag).attr('title', "Click to drag");
	  $(wrapperDiv).append(wrapperTag)
	  
	  $(current_area).html("");
	  $(current_area).append(wrapperDiv)
	  	    
	  VISH.Editor.addDeleteButton($(current_area));
	    	
	  //RESIZE
	  $("#menubar").before("<div id='sliderId"+nextWrapperId+"' class='theslider'><input id='imageSlider"+nextWrapperId+"' type='slider' name='size' value='1' style='display: none; '></div>");
	            
	  $("#imageSlider"+nextWrapperId).slider({
	    from: 1,
	    to: 8,
	    step: 0.5,
	    round: 1,
	    dimension: "x",
	    skin: "blue",
	    onstatechange: function( value ){
	      resizeObject(idToResize,325*value);
	    }
	  });

	  $("#" + idToDrag).draggable({cursor: "move"});
	}
	
	
	return {
		init					: init,
		onLoadTab 				: onLoadTab,
		drawObject				: drawObject,
		renderObjectPreview 	: renderObjectPreview,
		getObjectInfo			: getObjectInfo,
		resizeObject 			: resizeObject
	};

}) (VISH, jQuery);
