VISH.Editor.Video.HTML5 = (function(V,$,undefined){
	
	var init = function(){
    var urlInput = $("#tab_video_from_url_content").find("input.url");
    $(urlInput).watermark('Paste HTML5 video URL');
		var uploadInput = $("#tab_video_upload_content").find("input.upload");
    $(uploadInput).watermark('Select video to upload');
  }
	
	var onLoadTab = function(tab){
		
	}

  var drawVideoWithUrl = function (url){
		drawVideo([[url,_getMimetypeFromUrl(url)]])
	}
	
	var _getMimetypeFromUrl = function(url) {
		//Code here...
		return null;
	}

  /**
   * Returns a video object prepared to draw.
   * Sources: array of arrays [[source src, source mymetipe],...] .
   * Options: hash with additional data like poster url or autoplay
   */
  var drawVideo = function(sources,options){
    
		//Default options
		var posterUrl = "https://github.com/ging/vish_editor/raw/master/images/example_poster_image.jpg";
		var autoplay = false;
		
		//Replace defeault options if options hash is defined
		if(options){
			if(options['poster']){
				var posterUrl = options['poster'];
			}
			if(options['autoplay']){
        var autoplay = options['autoplay'];
      }
		}
		
		var current_area = VISH.Editor.getCurrentArea();
    var template = VISH.Editor.getTemplate();

    var nextVideoId = VISH.Editor.getId();
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
    
    var editTag = "<div class='edit_pencil'><img class='edit_pencil_img' src='"+VISH.ImagesPath+"/edit.png'/></div>"
    $(current_area).append(editTag)
		
		
		//RESIZE
    
		$("#menubar").before("<div id='sliderId"+nextVideoId+"' class='theslider'><input id='imageSlider"+nextVideoId+"' type='slider' name='size' value='1' style='display: none; '></div>");
            
    $("#imageSlider"+nextVideoId).slider({
      from: 1,
      to: 8,
      step: 0.5,
      round: 1,
      dimension: "x",
      skin: "blue",
      onstatechange: function( value ){
          $("#" + idToDragAndResize).width(325*value);
      }
    });

    $("#" + idToDragAndResize).draggable({cursor: "move"});
  }


	
	return {
		init             : init,
		onLoadTab				 : onLoadTab,
		drawVideoWithUrl : drawVideoWithUrl,
		drawVideo        : drawVideo
	};

}) (VISH, jQuery);
