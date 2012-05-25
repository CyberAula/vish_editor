VISH.Editor.Object = (function(V,$,undefined){
		
	var contentToAdd = null;	
		
	var init = function(){
		VISH.Editor.Object.Repository.init();
		
	  var urlInput = $("#tab_flash_from_url_content").find("input");
	  $(urlInput).watermark('Paste SWF file URL');
		var uploadInput = $("#tab_flash_upload_content").find("input");
	  $(uploadInput).watermark('Select SWF file to upload');
		
		$("#tab_flash_from_url_content .previewButton").click(function(event) {
      if(VISH.Police.validateObject($(urlInput).val())[0]){
        contentToAdd = $(urlInput).val();
        drawPreview("tab_flash_from_url_content", contentToAdd)
      } else {
        contentToAdd = null;
      }
    });
		
		
		//Upload content
    var options = VISH.Editor.getOptions();
    var bar = $('.upload_progress_bar');
    var percent = $('.upload_progress_bar_percent');
    
    $("input[name='document[file]']").change(function () {
      $("input[name='document[title]']").val($("input:file").val());
    });
      
    $("#tab_flash_upload_content #upload_document_submit").click(function(event) {
      if(!VISH.Police.validateFileUpload($("input[name='document[file]']").val()[0])){
        event.preventDefault();
      } else {
        if (options) {
          var description = "Uploaded by " + options["ownerName"] + " via Vish Editor"
          $("input[name='document[description]']").val(description);
          $("input[name='document[owner_id]']").val(options["ownerId"]);
          $("input[name='authenticity_token']").val(options["token"]);
          $(".documentsForm").attr("action", options["documentsPath"]);
        }
      }
    });
  
    $('form').ajaxForm({
      beforeSend: function() {
          var percentVal = '0%';
          bar.width(percentVal);
          percent.html(percentVal);
      },
      uploadProgress: function(event, position, total, percentComplete) {
          var percentVal = percentComplete + '%';
          bar.width(percentVal)
          percent.html(percentVal);
      },
      complete: function(xhr) {
          processResponse(xhr.responseText);
          var percentVal = '100%';
          bar.width(percentVal)
          percent.html(percentVal);
      }
    });
	}
	
	 var processResponse = function(response){
    try  {
      var jsonResponse = JSON.parse(response)
      if(jsonResponse.src){
        if (VISH.Police.validateObject(jsonResponse.src)[0]) {
          VISH.Editor.Object.drawPreview("tab_flash_upload_content",jsonResponse.src)
          contentToAdd = jsonResponse.src
        }
      }
    } catch(e) {
      //No JSON response
    }
  }
	
	var onLoadTab = function(tab){
    if(tab=="upload"){
      _onLoadUploadTab();
    }
    if(tab=="url"){
      _onLoadURLTab();
    }
	}	

	var _onLoadURLTab = function() {
		$("#tab_flash_from_url_content").find("input").val("");
		resetPreview("tab_flash_from_url_content");
		contentToAdd = null;
	}
	
	var _onLoadUploadTab = function() {
		var bar = $('.upload_progress_bar');
    var percent = $('.upload_progress_bar_percent');
    
    //Reset fields
    bar.width('0%');
    percent.html('0%');
    resetPreview("tab_flash_upload_content")
    $("input[name='document[file]']").val("");
		contentToAdd = null;
  }
	
	//Preview generation for load and upload tabs
	var previewBackground;
	
	var drawPreview = function(divId,src){
    previewBackground = $("#" + divId + " .previewimgbox").css("background-image");
    $("#" + divId + " .previewimgbox").css("background-image","none");
    $("#" + divId + " .previewimgbox img.imagePreview").remove();
		var wrapper = renderObjectPreview(src)
		if($("#" + divId + " .previewimgbox .objectPreview").length>0){
			$("#" + divId + " .previewimgbox .objectPreview").remove();
		}
		$("#" + divId + " .previewimgbox").append(wrapper);
    $("#" + divId + " .previewimgbox button").show();
    $("#" + divId + " .documentblank").addClass("documentblank_extraMargin")
    $("#" + divId + " .buttonaddfancy").addClass("buttonaddfancy_extraMargin")
  }
	
	var resetPreview = function(divId){
    $("#" + divId + " .previewimgbox button").hide()
		$("#" + divId + " .previewimgbox img.imagePreview").remove();
    $("#" + divId + " .previewimgbox .objectPreview").remove();
    if (previewBackground) {
      $("#" + divId + " .previewimgbox").css("background-image", previewBackground);
    }
    $("#" + divId + " .documentblank").removeClass("documentblank_extraMargin")
    $("#" + divId + " .buttonaddfancy").removeClass("buttonaddfancy_extraMargin")
  }
	
	var drawPreviewElement = function(){
		drawPreviewObject(contentToAdd);
	}
	
	var drawPreviewObject = function(content){
		if(content){
		  drawObject(content);
      $.fancybox.close();
		}
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
	var http_urls_pattern=/(http(s)?:\/\/)([aA-zZ0-9%=_&+?])+([./-][aA-zZ0-9%=_&+?]+)*[/]?/g
	var www_urls_pattern = /(www[.])([aA-zZ0-9%=_&+?])+([./-][aA-zZ0-9%=_&+?]+)*[/]?/g
	var youtube_video_pattern=/(http(s)?:\/\/)?(((youtu.be\/)([aA-zZ0-9]+))|((www.youtube.com\/((watch\?v=)|(embed\/)))([aA-z0-9Z&=.])+))/g 
	var html5VideoFormats = ["mp4","webm","ogg"]        
	var imageFormats = ["jpg","png","gif","bmp"]                                                         		
	
	var _getTypeFromSource = function(source){
		
		if(typeof source != "string"){
			return null
		}
		
		//Purge options
		source = source.split('?')[0]
		
		var extension = (source.split('.').pop()).toLowerCase();
		
		if(source.match(youtube_video_pattern)!=null){
			return "youtube";
		}
		
		if(imageFormats.indexOf(extension)!="-1"){
      return "image";
    }
		
		if(extension=="swf"){
			return "swf";
		}
		
		if(html5VideoFormats.indexOf(extension)!="-1"){
			return "HTML5";
		}
		
		if((source.match(http_urls_pattern)!=null)||(source.match(www_urls_pattern)!=null)){
			return "web";
		}
		
		return extension;
	}
	
	
	
	///////////////////////////////////////
  /// OBJECT RESIZING
  ///////////////////////////////////////
	
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
	
	
	/*
	 * Resize object and its wrapper automatically
	 */
	var _adjustWrapperOfObject = function(objectID, current_area){
		var proportion = $("#"+objectID).height()/$("#"+objectID).width();
		
		var maxWidth = current_area.width();
		var maxHeight = current_area.height();
		
		var width = $("#"+objectID).width();
		var height = $("#"+objectID).height();
		
		if(width > maxWidth){
			$("#"+objectID).width(maxWidth);
			$("#"+objectID).height(width*proportion);
			width = maxWidth;
			height = $("#"+objectID).height();
		}
		
		if(height > maxHeight){
			$("#"+objectID).height(maxHeight);
			$("#"+objectID).width(height/proportion);
			width = $("#"+objectID).width();
			height = maxHeight;
		}
		
		var wrapper = $("#"+objectID).parent();
		if($(wrapper).hasClass("object_wrapper")){
			$(wrapper).height($("#"+objectID).height());
			$(wrapper).width($("#"+objectID).width());
		}
	}
	
	
	///////////////////////////////////////
  /// OBJECT DRAW: PREVIEWS
  ///////////////////////////////////////
	
	var renderObjectPreview = function(object){
		var objectInfo = getObjectInfo(object);
		
		switch (objectInfo.wrapper) {
      case null:
        //Draw object preview from source
        switch (objectInfo.type) {
					
					case "image":
					  return "<img class='imagePreview' src='" + object + "'></img>"
					  break;
					
          case "swf":
            return "<embed class='objectPreview' src='" + object + "' wmode='transparent' ></embed>"
            break;
            
          case "youtube":
            return "<embed class='objectPreview' src='" + object + "' wmode='transparent' ></embed>"
            break;
            
          case "HTML5":
            return VISH.Editor.Video.HTML5.renderVideoFromSources([object])
            break;
            
          default:
            VISH.Debugging.log("Unrecognized object source type")
            break;
        }
        break;
        
      case "EMBED":
        return _genericWrapperPreview(object)
        break;
        
      case "OBJECT":
        return _genericWrapperPreview(object)
        break;

      case "IFRAME":
        return _genericWrapperPreview(object)
        break;
        
      default:
        VISH.Debugging.log("Unrecognized object wrapper: " + objectInfo.wrapper)
        break;
    }
	}
	
	var _genericWrapperPreview = function(object){
		var wrapperPreview = $(object);
    $(wrapperPreview).addClass('objectPreview')
    $(wrapperPreview).attr('wmode','transparent')
    $(wrapperPreview).removeAttr('width')
    $(wrapperPreview).removeAttr('height')
    return wrapperPreview;
	}
	
	
	
	///////////////////////////////////////
  /// OBJECT DRAW: Draw objects in slides
  ///////////////////////////////////////
	
  /**
   * Returns a object prepared to draw.   * 
   * param area: optional param indicating the area to add the object, used for editing excursions
   * param style: optional param with the style, used in editing excursion
   */
	var drawObject = function(object, area, style){
			
		if(!VISH.Police.validateObject(object)[0]){
			return;
		}
		
		var current_area;
		var object_style = "";
	  if(area){
	  	current_area = area;
	  } else {
	  	current_area = VISH.Editor.getCurrentArea();
	 	}
		if(style){
	  		object_style = style;	  		
	 	}
		
		var objectInfo = getObjectInfo(object);
		
		switch (objectInfo.wrapper) {
			case null:
				//Draw object from source
				switch (objectInfo.type) {
					
					case "image":
					  V.Editor.Image.drawImage(object)
					  break;
					
					case "swf":
						V.Editor.Object.Flash.drawFlashObjectWithSource(object, object_style);
						break;
						
					case "youtube":
						VISH.Editor.Object.drawObject(VISH.Editor.Video.Youtube.generateWrapperForYoutubeVideoUrl(object));
						break;
						
					case "HTML5":
					  V.Editor.Video.HTML5.drawVideoWithUrl(object)
					  break;
						
					default:
						VISH.Debugging.log("Unrecognized object source type: " + objectInfo.type)
						break;
				}
				break;
				
			case "EMBED":
				drawObjectWithWrapper(object, current_area, object_style);
				break;
				
			case "OBJECT":
				drawObjectWithWrapper(object, current_area, object_style);
				break;

			case "IFRAME":
				drawObjectWithWrapper(object, current_area, object_style);
				break;
				
			default:
				VISH.Debugging.log("Unrecognized object wrapper: " + objectInfo.wrapper)
				break;
		}

	}
	
	/**
	 * param style: optional param with the style, used in editing excursion
	 */
	var drawObjectWithWrapper = function(wrapper, current_area, style){
	 
		var template = V.Editor.getTemplate(current_area);
		var nextWrapperId = V.Editor.getId();
		var idToDrag = "draggable" + nextWrapperId;
		var idToResize = "resizable" + nextWrapperId;
		current_area.attr('type', 'object');
		var wrapperDiv = document.createElement('div');
		wrapperDiv.setAttribute('id', idToDrag);
		if(style){
			wrapperDiv.setAttribute('style', style);
		}
		$(wrapperDiv).addClass('object_wrapper');
		$(wrapperDiv).addClass(template + "_object");

		var wrapperTag = $(wrapper);
		$(wrapperTag).attr('id', idToResize);
		$(wrapperTag).attr('class', template + "_object");
		$(wrapperTag).attr('wmode', "transparent");

		$(current_area).html("");
		$(current_area).append(wrapperDiv);

		VISH.Editor.addDeleteButton($(current_area));
			
		$(wrapperDiv).append(wrapperTag);
		
		//RESIZE
		var width, value;
		if(style){
		   width = V.SlidesUtilities.getWidthFromStyle(style);
		   value = 10*width/$(current_area).width();
		}	else {			
			value = 10; //we set it to the maximum value
		}
		var mystep = $(current_area).width()/10; //the step to multiply the value
		$("#menubar").before("<div id='sliderId" + nextWrapperId + "' class='theslider'><input id='imageSlider" + nextWrapperId + "' type='slider' name='size' value='"+value+"' style='display: none; '></div>");

		$("#imageSlider" + nextWrapperId).slider({
			from : 1,
			to : 10,
			step : 0.2,
			round : 1,
			dimension : "x",
			skin : "blue",
			onstatechange : function(value) {
				resizeObject(idToResize, mystep * value);
			}
		});

		$("#" + idToDrag).draggable({
			cursor : "move"
		});

		_adjustWrapperOfObject(idToResize, current_area);

	};
	
	
	return {
		init					       : init,
		onLoadTab 				   : onLoadTab,
		drawObject				   : drawObject,
		renderObjectPreview  : renderObjectPreview,
		getObjectInfo			   : getObjectInfo,
		resizeObject 			   : resizeObject,
		drawPreview          : drawPreview,
		resetPreview         : resetPreview,
		drawPreviewElement   : drawPreviewElement,
		drawPreviewObject    : drawPreviewObject
	};

}) (VISH, jQuery);
