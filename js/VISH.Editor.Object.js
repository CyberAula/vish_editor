VISH.Editor.Object = (function(V,$,undefined){
		
	var contentToAdd = null;
  var uploadDivId = "tab_flash_upload_content";
  var urlDivId = "tab_flash_from_url_content";
  var urlInputId = "flash_embed_code";
		
	var init = function(){

		VISH.Editor.Object.Repository.init();
		VISH.Editor.Object.Live.init();
		VISH.Editor.Object.Web.init();
		VISH.Editor.Object.PDF.init();
		
	  var urlInput = $(urlDivId ).find("input");
	  $(urlInput).watermark('Paste SWF file URL');
		
		//Load from URL
    $("#" + urlDivId + " .previewButton").click(function(event) {
      if(VISH.Police.validateObject($("#" + urlInputId).val())[0]){
				contentToAdd = VISH.Utils.autocompleteUrls($("#" + urlInputId).val());
        drawPreview(urlDivId, contentToAdd)    
      }
    });
		
		
		//Upload content
    var options = VISH.Editor.getOptions();
    var tagList = $("#" + uploadDivId + " .tagList")
    var bar = $("#" + uploadDivId + " .upload_progress_bar");
    var percent = $("#" + uploadDivId + " .upload_progress_bar_percent");
    
    $("#" + uploadDivId + " input[name='document[file]']").change(function () {
      $("#" + uploadDivId + " input[name='document[title]']").val($("#" + uploadDivId + " input:file").val());
      _resetUploadFields();
      $(tagList).parent().show();
      $("#" + uploadDivId + ' form' + ' .button').show();
      $("#" + uploadDivId + " .upload_progress_bar_wrapper").hide();
    });
		
		
		$("#" + uploadDivId + " #upload_document_submit").click(function(event) {
      if(!VISH.Police.validateFileUpload($("#" + uploadDivId + " input[name='document[file]']").val())[0]){
        event.preventDefault();
      } else {
        if (options) {
          var description = "Uploaded by " + options["ownerName"] + " via Vish Editor"
          $("#" + uploadDivId + " input[name='document[description]']").val(description);
          $("#" + uploadDivId + " input[name='document[owner_id]']").val(options["ownerId"]);
          $("#" + uploadDivId + " input[name='authenticity_token']").val(options["token"]);
          $("#" + uploadDivId + " .documentsForm").attr("action", options["documentsPath"]);
          $("#" + uploadDivId + " input[name='tags']").val(VISH.Utils.convertToTagsArray($(tagList).tagit("tags")));
					var tagList = $("#" + uploadDivId + " .tagList")
          $(tagList).parent().hide();
          $("#" + uploadDivId + " .upload_progress_bar_wrapper").show();
        }
      }
    });
    		
        
    $("#" + uploadDivId + ' form').ajaxForm({
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
	
	var onLoadTab = function(tab){
    if(tab=="upload"){
      _onLoadUploadTab();
    }
    if(tab=="url"){
      _onLoadURLTab();
    }
	}	
	
	 var _onLoadURLTab = function(){
    contentToAdd = null;
    resetPreview(urlDivId);
    $("#" + urlInputId).val("");
  }
	
	var _onLoadUploadTab = function(){
    contentToAdd = null;
		
    //Hide and reset elements
    var tagList = $("#" + uploadDivId + " .tagList")
    $(tagList).parent().hide();
    $("#" + uploadDivId + ' form' + ' .button').hide();
    $("#" + uploadDivId + " .upload_progress_bar_wrapper").hide();
    $("#" + uploadDivId + " input[name='document[file]']").val(""); 
    _resetUploadFields();
		
    VISH.Editor.API.requestTags(_onTagsReceived)
  }
	
	var _resetUploadFields = function(){
    var bar = $("#" + uploadDivId + " .upload_progress_bar");
    var percent = $("#" + uploadDivId + " .upload_progress_bar_percent");
    
    bar.width('0%');
    percent.html('0%');
    resetPreview(uploadDivId)
    
    var tagList = $("#" + uploadDivId + " .tagList")
    $(tagList).tagit("reset")
  }
   
  var _onTagsReceived = function(data){
     var tagList = $("#" + uploadDivId + " .tagList");
     
     //Insert the three first tags.
     if ($(tagList).children().length == 0){
        $.each(data, function(index, tag) {
          if(index==3){
            return false; //break the bucle
          }
          $(tagList).append("<li>" + tag + "</li>")
        });
        
				$(tagList).tagit({tagSource:data, sortable:true, maxLength:15, maxTags:8 , 
        watermarkAllowMessage: "Add tags", watermarkDenyMessage: "limit reached" });
     }
  }
	
	
	var processResponse = function(response){
    try  {
      var jsonResponse = JSON.parse(response)
      if(jsonResponse.src){
        if (VISH.Police.validateObject(jsonResponse.src)[0]) {
          drawPreview(uploadDivId,jsonResponse.src)
          contentToAdd = jsonResponse.src
        }
      }
    } catch(e) {
      //No JSON response
    }
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
  var resizeWebIframe = function(id,width){
    var proportion = $("#" + id).height()/$("#" + id).width();
    $("#" + id).width(width);
    $("#" + id).height(width*proportion);
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
          
				 case "pdf":
            return VISH.Editor.Object.PDF.generatePreviewWrapperForPdf(object);
            break;
					  
          case "youtube":
            return VISH.Editor.Video.Youtube.generatePreviewWrapperForYoutubeVideoUrl(object);
            break;
            
          case "HTML5":
            return VISH.Editor.Video.HTML5.renderVideoFromSources([object]);
            break;
						
				 case "web":
						return VISH.Editor.Object.Web.generatePreviewWrapperForWeb(object);
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
			
		VISH.Debugging.log("Se llamo a Draw object con object " + object + ", area " + area + ", y style " + style)		
			
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
						
					case "pdf":
            V.Editor.Object.drawObject(V.Editor.Object.PDF.generateWrapperForPdf(object));
            break;
						
					case "youtube":
						V.Editor.Object.drawObject(V.Editor.Video.Youtube.generateWrapperForYoutubeVideoUrl(object));
						break;
						
					case "HTML5":
					  V.Editor.Video.HTML5.drawVideoWithUrl(object);
					  break;
						
					case "web":
					  V.Editor.Object.drawObject(V.Editor.Object.Web.generateWrapperForWeb(object));
					  break;
						
					default:
						V.Debugging.log("Unrecognized object source type: " + objectInfo.type)
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
				//drawIframeObjectWithWrapper(object, current_area, object_style);
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
		   width = V.SlidesUtilities.getWidthFromStyle(style,current_area);
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
	
	
	/**
   * param style: optional param with the style, used in editing excursion
   */
  var drawIframeObjectWithWrapper = function(wrapper, current_area, style){
   
	  VISH.Debugging.log("drawIframeObjectWithWrapper")
	 
    var template = V.Editor.getTemplate(current_area);
    var nextWrapperId = V.Editor.getId();
    var idToDrag = "draggable" + nextWrapperId;
    var idToResize = "resizable" + nextWrapperId;
    current_area.attr('type', 'iframe');
    var wrapperDiv = document.createElement('div');
    wrapperDiv.setAttribute('id', idToDrag);
    if(style){
      wrapperDiv.setAttribute('style', style);
    }
    $(wrapperDiv).addClass('iframe_wrapper');

    var iframeTag = $(wrapper);
    $(iframeTag).attr('id', idToResize);
		$(iframeTag).attr('class', 'iframe_content');
		$(iframeTag).attr('scrolling', 'no');
    $(iframeTag).attr('wmode', "transparent");

    $(current_area).html("");
    $(current_area).append(wrapperDiv);

    VISH.Editor.addDeleteButton($(current_area));
      
    $(wrapperDiv).append(iframeTag);
    
    //RESIZE
    var width, value;
    if(style){
       width = V.SlidesUtilities.getWidthFromStyle(style,current_area);
       value = 10*width/$(current_area).width();
    } else {      
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
        resizeWebIframe(idToDrag, mystep * value);
      }
    });

//    $("#" + idToDrag).draggable({
//      cursor : "move"
//    });

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
		drawPreviewObject    : drawPreviewObject,
		_getTypeFromSource  : _getTypeFromSource,
		_getSourceFromObject : _getSourceFromObject
	};

}) (VISH, jQuery);
