VISH.Editor.Video.HTML5 = (function(V,$,undefined){
	
	var onLoadTab = function(tab){
		
	}


  /**
   * Function called when user clicks on import HTML5 video from URL
   * Allows users to paste a HTML5 video from URL
   */
  var drawVideo = function(url){
    
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
    videoTag.setAttribute('poster', "https://github.com/ging/vish_editor/raw/master/images/example_poster_image.jpg");
    var videoSource = document.createElement('source');
    videoSource.setAttribute('src', url);
    var fallbackText = document.createElement('p');
    $(fallbackText).html("Your browser does not support HTML5 video.")
    $(videoTag).append(videoSource)
    $(videoTag).append(fallbackText)
    
    $(current_area).html("");
    $(current_area).append(videoTag)
    
    var editTag = "<div class='edit_pencil'><img class='edit_pencil_img' src='"+VISH.ImagesPath+"/edit.png'/></div>"
    $(current_area).append(editTag)
    
//    current_area.after("<div id='sliderId"+nextVideoId+"' class='theslider'><input id='imageSlider"+nextVideoId+"' type='slider' name='size' value='1' style='display: none; '></div>");      
//    
//    //position the slider below the div with the image
//    var divPos = current_area.position();
//    var divHeight = current_area.height();
//    $("#sliderId"+nextVideoId).css('top', divPos.top + divHeight - 20);
//    $("#sliderId"+nextVideoId).css('left', divPos.left);
//    $("#sliderId"+nextVideoId).css('margin-left', '12px');
//           
//    $("#imageSlider"+nextVideoId).slider({
//      from: 1,
//      to: 8,
//      step: 0.5,
//      round: 1,
//      dimension: "x",
//      skin: "blue",
//      onstatechange: function( value ){
//          $("#" + idToDragAndResize).width(325*value);
//          console.log("onStateChange")
//      }
//    });
    $("#" + idToDragAndResize).draggable({cursor: "move"});
  }


	
	return {
		onLoadTab				 : onLoadTab,
		drawVideo        : drawVideo
	};

}) (VISH, jQuery);
