VISH.Editor.Video.Repository = (function(V,$,undefined){
	
	var carrouselDivId = "tab_video_repo_content_carrousel";
	var previewDivId = "tab_video_repo_content_preview";
	var currentVideos = new Array();
	
	var init = function(){
		var myInput = $("#tab_video_repo_content").find("input[type='search']");
		$(myInput).watermark('Search content');
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
          VISH.Editor.Video.Repository.requestData($(myInput).val());
					$(myInput).blur();
      }
    });
	}
	
	var onLoadTab = function(){
		var previousSearch = ($("#tab_video_repo_content").find("input[type='search']").val()!="");
		if(! previousSearch){
		 _renderVideoPreview(null);
     _requestInicialData();
		}
	}
	
	/*
	 * Request inicial data to the server.
	 */
	var _requestInicialData = function(){
		VISH.Editor.API.requestRecomendedVideos(VISH.Editor.Video.Repository.onDataReceived,VISH.Editor.Video.Repository.onAPIError);
	}
	
	/*
   * Request data to the server.
   */
  var requestData = function(text){
    VISH.Editor.API.requestVideos(text,VISH.Editor.Video.Repository.onDataReceived,VISH.Editor.Video.Repository.onAPIError);
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
	
	 var onAPIError = function(){
    VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId)
		console.log("API error")
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
		if((renderedVideo)&&(video)){
			$(videoArea).append(renderedVideo)
		}
		
		//Filling metadata with video fields...
	}
	
	var getCurrentVideos = function(){
		return currentVideos ;
	}
	
	return {
		init                    : init,
		onLoadTab					      : onLoadTab,
		getCurrentVideos        : getCurrentVideos,
		requestData             : requestData,
		onDataReceived  : onDataReceived,
		onClickCarrouselElement : onClickCarrouselElement
	};

}) (VISH, jQuery);
