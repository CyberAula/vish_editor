VISH.Editor.Object.Snapshot = (function(V,$,undefined){
		
	var contentToAdd = null;	
	var urlDivId = "tab_object_snapshot_content";
  var urlInputId = "object_snapshot_code";
		
	var init = function(){
		var urlInput = $(urlDivId ).find("input");
    $(urlInput).watermark('Paste website URL');
		
		//Load from URL
    $("#" + urlDivId + " .previewButton").click(function(event) {
      if(VISH.Police.validateObject($("#" + urlInputId).val())[0]){
				contentToAdd = VISH.Utils.autocompleteUrls($("#" + urlInputId).val());
        VISH.Editor.Object.drawPreview(urlDivId, contentToAdd);
      }
    });
		
	};

  
  var onLoadTab = function(tab){
		contentToAdd = null;
    VISH.Editor.Object.resetPreview(urlDivId);
    $("#" + urlInputId).val("");
  }
	
	
  var drawPreviewElement = function(){
		if(_validateSnapShot(contentToAdd)){
			drawSnapShot(_wrapperSnapShot(contentToAdd));
      $.fancybox.close();
		}
  }
	
	
	var _validateSnapShot = function(object){	
		var objectInfo = VISH.Object.getObjectInfo(object);
		
    switch (objectInfo.wrapper) {
      case null:
        //Verify Web Url
				return _validateUrl(object);
        break;
        
      case "IFRAME":
        return _validateUrl(objectInfo.source);
        break;
        
      default:
				return false;
        break;
    }
  }
	
	
	var _validateUrl = function(url){
		var http_urls_pattern=/(http(s)?:\/\/)([aA-zZ0-9%=_&+?])+([./-][aA-zZ0-9%=_&+?]+)*[/]?/g
    
		if(url.match(http_urls_pattern)!=null){
      return true;
    } else {
			return false;
		}
	}
	
	
	var _wrapperSnapShot = function(content){
		var objectInfo = VISH.Object.getObjectInfo(content);
		if(objectInfo.wrapper===null){
			return "<iframe src='" + content + "'></iframe>";
		} else {
			return content;
		}
	}
	
	/**
   * Param style: optional param with the style, used in editing presentation
   */
  var drawSnapShot = function(wrapper, area, style,scrollTop,scrollLeft){

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
	 
    var template = V.Editor.getTemplate(current_area);
    var nextWrapperId = V.Utils.getId();
    var idToDrag = "draggable" + nextWrapperId;
    var idToResize = "resizable" + nextWrapperId;
    current_area.attr('type', 'snapshot');
		
    var wrapperDiv = document.createElement('div');
    wrapperDiv.setAttribute('id', idToDrag);
    if(style){
      wrapperDiv.setAttribute('style', style);
    }
    $(wrapperDiv).addClass('snapshot_wrapper');

    var iframeTag = $(wrapper);
    $(iframeTag).attr('id', idToResize);
    $(iframeTag).attr('class', 'snapshot_content');
    $(iframeTag).attr('scrolling', 'no');
    $(iframeTag).attr('wmode', "opaque");
	$(iframeTag).css('pointer-events', "none");

    $(current_area).html("");
    $(current_area).append(wrapperDiv);

    VISH.Editor.addDeleteButton($(current_area));
      
    $(wrapperDiv).append(iframeTag);
		
		//Move scrools
    if(scrollTop){
      $('#' + idToDrag).scrollTop(scrollTop);
    }
    if(scrollLeft){
      $('#' + idToDrag).scrollLeft(scrollLeft);
    }
    
    //RESIZE
    var width, value;
    if(style){
       width = V.Editor.Utils.getWidthFromStyle(style,current_area);
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
        _resizeWebIframe(idToDrag, mystep * value);
      }
    });

		
		$('#' + idToDrag).bind('mousedown',function(event){
			 event.preventDefault();
    });
		

    $("#" + idToDrag).draggable({
      cursor : "move",
			disabled: false,
		  start: function(event, ui){
		  	if (!_isBorderClick(event, idToDrag)) {
		  		return false;
		  	}
	    }
    });
  };
	
	var _isBorderClick = function(event,idToDrag){
		var accuracy = 6;
		var scrollAccuracy = -10;
		var width = $('#' + idToDrag).width();
    var height = $('#' + idToDrag).height();
    var offset = $('#' + idToDrag).offset();
    var dif1 = event.pageX - offset.left;
    if(dif1<accuracy){
      //Left side"
			return true;
    }
    var dif2 = event.pageY - offset.top;
		if(dif2<accuracy){
      //Top side"
			return true;
    }
    var dif3 = (offset.left + width)-event.pageX;  
    if(dif3<scrollAccuracy){
      //Right side"
      return true;
    }
    var dif4 = (offset.top + height)-event.pageY;
    if(dif4<scrollAccuracy){
      //Bottom side
      return true;
    }
		
		return false;
	}
	
	 /*
   * Resize object and its wrapper automatically
   */
  var _resizeWebIframe = function(id,width){
    var proportion = $("#" + id).height()/$("#" + id).width();
    $("#" + id).width(width);
    $("#" + id).height(width*proportion);
  };

			
	return {
		init: init,
		onLoadTab : onLoadTab,
		drawPreviewElement : drawPreviewElement,
		drawSnapShot : drawSnapShot
	};

}) (VISH, jQuery);
