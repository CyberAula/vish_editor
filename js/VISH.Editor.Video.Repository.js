VISH.Editor.Video.Repository = (function(V,$,undefined){
	
	var carrouselDivId = "tab_video_repo_content_carrousel";
	var previewDivId = "tab_video_repo_content_preview";
	var currentVideos = new Array();
	
	var onLoadTab = function(){
		 _requestData();
	}
	
	/*
	 * Request data to the server.
	 */
	var _requestData = function(){
		VISH.Editor.API.requestRecomendedVideos(VISH.Editor.Video.Repository.onDataReceived);
	}
	
	 /*
   * Fill tab_video_repo_content_carrousel div with server data.
   */
	var onDataReceived = function(data){
    //Clean previous content
    VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId)
    
    //Clean previous videos
    currentVideos = new Array();  
		
    var content = "";
    
    $.each(data, function(index, video) {
      content = content + "<img src='" + video.poster + "' videoId='" + video.id + "'>"
      currentVideos[video.id]=video
    });

    $("#" + carrouselDivId).html(content);
		VISH.Editor.Carrousel.createCarrousel(carrouselDivId,1,VISH.Editor.Video.Repository.onClickCarrouselElement);
  }
	
	 
  var onClickCarrouselElement = function(event){
    var videoId = $(event.target).attr("videoid");
    var renderedVideo = _renderVideoElement(currentVideos[videoId])
		_renderVideoPreview(renderedVideo,currentVideos[videoId])
  }
  
  var _renderVideoElement = function(video){
    var controls= "controls='controls' "
    var poster="poster='" + video.poster + "'"
    var rendered = "<video class='" + "videoPreview" + "' preload='metadata' " + controls + poster + ">"
    var sources = JSON.parse(video.sources)
    
    $.each(sources, function(index, source) {
      rendered = rendered + "<source src='" + source.src + "' type='" + source.mimetype + "'>"
    });
    
    if(sources.length>0){
      rendered = rendered + "<p>Your browser does not support HTML5 video.</p>"
    }
    
    rendered = rendered + "</video>"
		
		return rendered
  }
	
	var _renderVideoPreview = function(renderedVideo,video){
		var videoArea = $("#" + previewDivId).find("#tab_video_repo_content_preview_video")
		var metadataArea = $("#" + previewDivId).find("#tab_video_repo_content_preview_metadata")
		$(videoArea).html("")
		$(metadataArea).html("")
		$(videoArea).append(renderedVideo)
		
		$()
		//Filling metadata with video fields...
	}
	
	var getCurrentVideos = function(){
		return currentVideos ;
	}
	
	return {
		onLoadTab					      : onLoadTab,
		getCurrentVideos: getCurrentVideos,
		onDataReceived  : onDataReceived,
		onClickCarrouselElement : onClickCarrouselElement
	};

}) (VISH, jQuery);
