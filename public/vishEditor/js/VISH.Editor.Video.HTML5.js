VISH.Editor.Video.HTML5 = (function(V,$,undefined){
	
  var init = function(){
  }
	
  var drawVideoWithUrl = function (url){
    drawVideo([[url,_getVideoType(url)]])
  }
	
	var _getVideoType = function(url){
		var source = (VISH.Object.getObjectInfo(url)).source;
    return "video/" + source.split('.').pop();
	}

  /**
   * Returns a video object prepared to draw.
   * Sources: array of arrays [[source src, source type],...] .
   * Options: hash with additional data like poster url or autoplay
   * param area: optional param indicating the area to add the video, used for editing presentations
   * param style: optional param with the style, used in editing presentation
   */
  var drawVideo = function(sources,options, area, style){
		
		var current_area;
  	if(area){
  		current_area = area;
  	}	else {
  		current_area = VISH.Editor.getCurrentArea();
  	}
  	
    //Default options
	  var posterUrl = "https://github.com/ging/vish_editor/raw/master/images/example_poster_image.jpg";
	  var autoplay = false;
		
	//Replace defeault options if options hash is defined
		if(options){
		  if(options['poster']){
		    posterUrl = options['poster'];
		  }
		  if(options['autoplay']){
	        autoplay = options['autoplay'];
	    }
		}
		
	
    var template = VISH.Editor.getTemplate(area);

    var nextVideoId = VISH.Utils.getId();
    var idToDragAndResize = "draggable" + nextVideoId;
    current_area.attr('type','video');
    
    var videoTag = document.createElement('video');
    videoTag.setAttribute('id', idToDragAndResize);
    videoTag.setAttribute('class', template + "_video");
    videoTag.setAttribute('title', "Click to drag");
    videoTag.setAttribute('controls', "controls");
    videoTag.setAttribute('preload', "metadata");
    videoTag.setAttribute('poster', posterUrl);
		videoTag.setAttribute('autoplayonslideenter',autoplay);
		if(style){
			videoTag.setAttribute('style', style);
		}
		
	  $(sources).each(function(index, source) {
      var videoSource = document.createElement('source');
      videoSource.setAttribute('src', source[0]);
		  if(source[1]){
		    videoSource.setAttribute('type', source[1]);
		  }
		  $(videoTag).append(videoSource)
    });
    
    var fallbackText = document.createElement('p');
    $(fallbackText).html("Your browser does not support HTML5 video.")
    $(videoTag).append(fallbackText)
    
    $(current_area).html("");
    $(current_area).append(videoTag)
    
    VISH.Editor.addDeleteButton($(current_area));
    	
	  //RESIZE
		var width, value;
		if(style){
		   width = V.Editor.Utils.getWidthFromStyle(style);
		   value = width/80;
		} else {
			value = 4;
		}
    $("#menubar").before("<div id='sliderId"+nextVideoId+"' class='theslider'><input id='imageSlider"+nextVideoId+"' type='slider' name='size' value='"+value+"' style='display: none; '></div>");
            
    $("#imageSlider"+nextVideoId).slider({
      from: 1,
      to: 8,
      step: 0.2,
      round: 1,
      dimension: "x",
      skin: "blue",
      onstatechange: function( value ){
          $("#" + idToDragAndResize).width(80*value);
      }
    });

    $("#" + idToDragAndResize).draggable({cursor: "move"});
  }

  var renderVideoFromSources = function(sources){
    var posterUrl = "https://github.com/ging/vish_editor/raw/master/images/example_poster_image.jpg";
    var rendered = "<video class='objectPreview' preload='metadata' controls='controls' poster='" + posterUrl + "' >";
		$.each(sources, function(index, source) {
       rendered = rendered + "<source src='" + source + "' " + _getVideoType(source) + ">";
    });   
    rendered = rendered + "</video>";
    return rendered;
  };
	

  return {
    init             : init,
	  drawVideoWithUrl : drawVideoWithUrl,
	  drawVideo        : drawVideo,
		renderVideoFromSources : renderVideoFromSources
  };

}) (VISH, jQuery);
