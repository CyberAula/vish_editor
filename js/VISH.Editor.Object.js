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

	var drawObject = function(object){
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
		
		  case "EMBED":
		    break;
		  case "OBJECT":
		    break;
		  case "IFRAME": 
		    break;  
		  default:
			console.log("Unrecognized object wrapper: " + objectInfo.wrapper)
            break;
		}
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
	
	var _getTypeFromSource = function(source){
		if(typeof source != "string"){
			return "Invalid source"
		}
		return source.split('.').pop();
	}
	
	/*
	 * Resize object and its wrapper automatically
	 */
	var resizeObject = function(id,width){
		$("#" + id).width(width);
		var height = $("#" + id).height();
		
		var parent = $("#" + id).parent();
		$(parent).width(width);
		$(parent).height(height);
	}
	
	
	return {
		init			: init,
		onLoadTab 		: onLoadTab,
		drawObject		: drawObject,
		getObjectInfo	: getObjectInfo,
		resizeObject 	: resizeObject
	};

}) (VISH, jQuery);
