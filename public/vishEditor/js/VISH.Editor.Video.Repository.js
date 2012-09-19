VISH.Editor.Video.Repository = (function(V, $, undefined) {
	
	var carrouselDivId = "tab_video_repo_content_carrousel";
	var previewDivId = "tab_video_repo_content_preview";
	var currentVideos = new Array();
	var selectedVideo = null;
	
	var init = function() {
		var myInput = $("#tab_video_repo_content").find("input[type='search']");
		$(myInput).watermark(VISH.Editor.I18n.getTrans("i.SearchContent"));
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
				_requestData($(myInput).val());
				$(myInput).blur();
			}
		});
	};	
	
	var onLoadTab = function() {
		var previousSearch = ($("#tab_video_repo_content").find("input[type='search']").val() != "");
		if(!previousSearch) {
			_cleanVideoPreview();
			_requestInitialData();
		}
	};
	
	/*
	 * Request inicial data to the server.
	 */
	var _requestInitialData = function() {
		VISH.Editor.API.requestRecomendedVideos(_onDataReceived, _onAPIError);
	};
	
	/*
	 * Request data to the server.
	 */
	var _requestData = function(text) {
		VISH.Editor.API.requestVideos(text, _onDataReceived, _onAPIError);
	};
	
	/*
	 * Fill tab_video_repo_content_carrousel div with server data.
	 */
	var _onDataReceived = function(data) {
		//Clean previous content
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);
		$("#" + carrouselDivId).hide();
		
		//clean previous preview if any
		_cleanVideoPreview(); 

		//Clean previous videos
		currentVideos = new Array();
		
		 //Clean carrousel images
    var carrouselImages = [];

		var content = "";

    if((!data.videos)||(data.videos.length==0)){
      $("#" + carrouselDivId).html("<p class='carrouselNoResults'> No results found </p>");
      $("#" + carrouselDivId).show();
      return;
    } 

		//data.videos is an array with the results
		$.each(data.videos, function(index, video) {
			if(video){
				var myImg = $("<img src='" + video.poster + "' videoId='" + video.id + "'/>")
        carrouselImages.push(myImg);
        currentVideos[video.id] = video;
			}
		});

		VISH.Utils.loader.loadImagesOnCarrousel(carrouselImages,_onImagesLoaded,carrouselDivId);
		
	};
	
	
	var _onImagesLoaded = function(){
    $("#" + carrouselDivId).show();
		var options = new Array();
    options['rows'] = 1;
    options['callback'] = _onClickCarrouselElement;
    options['rowItems'] = 5;
    VISH.Editor.Carrousel.createCarrousel(carrouselDivId, options);
  }
	
	
	var _onAPIError = function() {
		//VISH.Debugging.log("API error");
	};
	
	var _onClickCarrouselElement = function(event) {
		var videoId = $(event.target).attr("videoid");
		var renderedVideo = VISH.Renderer.renderVideo(currentVideos[videoId], "preview");
		_renderVideoPreview(renderedVideo, currentVideos[videoId]);
		selectedVideo = currentVideos[videoId];
	};
	
	var _renderVideoPreview = function(renderedVideo, video) {
		var videoArea = $("#" + previewDivId).find("#tab_video_repo_content_preview_video");
		var metadataArea = $("#" + previewDivId).find("#tab_video_repo_content_preview_metadata");
		var button = $("#" + previewDivId).find(".okButton");
		$(videoArea).html("");
		$(metadataArea).html("");
		if((renderedVideo) && (video)) {
			$(videoArea).append(renderedVideo);
			var table = VISH.Utils.generateTable(video.author, video.title, video.description);
			$(metadataArea).html(table);
			$(button).show();
		}
	};
	
	var _cleanVideoPreview = function() {
		var videoArea = $("#" + previewDivId).find("#tab_video_repo_content_preview_video");
		var metadataArea = $("#" + previewDivId).find("#tab_video_repo_content_preview_metadata");
		var button = $("#" + previewDivId).find(".okButton");
		$(videoArea).html("");
		$(metadataArea).html("");
		$(button).hide();
	};
	
	var addSelectedVideo = function() {
		if(selectedVideo != null) {
			var sourcesArray = [];
			var options = new Array();
			options['poster'] = selectedVideo.poster;
			var sources = selectedVideo.sources;
			if(typeof sources == "string"){
        sources = JSON.parse(sources)
      }
			$.each(sources, function(index, source) {
				sourcesArray.push([source.src, source.type]);
			});
			VISH.Editor.Video.HTML5.drawVideo(sourcesArray, options);
			$.fancybox.close();
		}
	};
	
	return {
		init : init,
		onLoadTab : onLoadTab,
		addSelectedVideo : addSelectedVideo
	};

})(VISH, jQuery);
