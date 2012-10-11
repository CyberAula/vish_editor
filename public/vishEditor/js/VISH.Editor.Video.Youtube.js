VISH.Editor.Video.Youtube = (function(V,$,undefined){
	
	var carrouselDivId = "tab_video_youtube_content_carrousel";
	var previewDivId = "tab_video_youtube_content_preview";
	var queryMaxMaxNumberYoutubeVideo= 20; //maximum video query for youtube API's (999 max)
	var currentVideos = new Array(); //to videoID param
	var selectedVideo = null;
	
	var init = function(){
		var myInput = $("#tab_video_youtube_content").find("input[type='search']");
		$(myInput).watermark(VISH.Editor.I18n.getTrans("i.SearchContent"));
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
				VISH.Editor.Video.Youtube.requestYoutubeData($(myInput).val());
				$(myInput).blur();
			}
		});
	};

	
	var onLoadTab = function(){
		//Clean previous content
		$("#tab_video_youtube_content").find("input[type='search']").val("");
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);
		$("#" + carrouselDivId).hide();
		_cleanVideoPreview();
	};

	
    /*
	 Request videos to Youtube API
	 */	
	var requestYoutubeData = function(text){
		var url_youtube = "http://gdata.youtube.com/feeds/api/videos?q="+text+"&alt=json-in-script&callback=?&max-results="+queryMaxMaxNumberYoutubeVideo+"&start-index=1";	 
		jQuery.getJSON(url_youtube,function (data) {
			_onDataReceived(data);
		});
	};

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

		if((!data.feed)||(data.feed.length==0)||(!data.feed.entry)){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'> No results found </p>");
			$("#" + carrouselDivId).show();
			return
		} 

		$.each(data.feed.entry, function(i, item) {
			var video = item['id']['$t'];
			var title = item['title']['$t']; //not used yet
			var author = item.author[0].name.$t;
			var subtitle = item.media$group.media$description.$t;

			video=video.replace('http://gdata.youtube.com/feeds/api/videos/', 'http://www.youtube.com/watch?v='); //replacement of link
			var videoID = video.replace('http://www.youtube.com/watch?v=', ''); //removing link and getting the video ID
			//url's video thumbnail 
			currentVideos[videoID] = new Object();
			currentVideos[videoID].id = videoID;
			currentVideos[videoID].title = title;
			currentVideos[videoID].author = author;
			currentVideos[videoID].subtitle = subtitle;

			var image_url = "http://img.youtube.com/vi/"+videoID+"/0.jpg" 
			var myImg = $("<img videoID="+videoID+" src="+image_url+" />")
			carrouselImages.push(myImg); 
		});
			
		VISH.Utils.loader.loadImagesOnCarrousel(carrouselImages,_onImagesLoaded,carrouselDivId);
	};

	var _onImagesLoaded = function(){
		$("#" + carrouselDivId).show();
		var options = new Array();
		options['rows'] = 1;
		options['callback'] = VISH.Editor.Video.Youtube.onClickCarrouselElement;
		options['rowItems'] = 5;
		VISH.Editor.Carrousel.createCarrousel(carrouselDivId, options);
	}
		
	var _getYoutubeIdFromURL = function(url){	
		var youtube_video_pattern_1 =/https?:\/\/?youtu.be\/([aA-zZ0-9]+)/g
		var youtube_video_pattern_2 =/(https?:\/\/)?(www.youtube.com\/watch\?v=|embed\/)([aA-z0-9Z]+)[&=.]*/g
		var id = null;

		if(url.match(youtube_video_pattern_1)!=null){
			var result = youtube_video_pattern_1.exec(url)
		if((result)&&(result[1])){
			id = result[1];
		}
			return id;
		}

		if(url.match(youtube_video_pattern_2)!=null){
			var result = url.split("&")[0];
			var result = youtube_video_pattern_2.exec(url)
			if((result)&&(result[3])){
				id = result[3];
			}
			return id;
		}

		return id;
	}
	
	var addSelectedVideo = function() {
		if(selectedVideo != null) {
			VISH.Editor.Object.drawObject(_generateWrapper(selectedVideo.id));
			$.fancybox.close();
		}
	};


	/** 
	* Funcion to show a preview youtube video and select to embed into the zone
	* video_id    
	*/
	var onClickCarrouselElement = function(event) {
		var videoId = $(event.target).attr("videoID");
		var renderedPreviewVideo = _generatePreviewWrapper(videoId);
		_renderVideoPreview(renderedPreviewVideo, currentVideos[videoId]);
		selectedVideo = currentVideos[videoId];
	};

  
	var _renderVideoPreview = function(renderedIframe, video) {
		var videoArea = $("#" + previewDivId).find("#tab_video_youtube_content_preview_video");
		var metadataArea = $("#" + previewDivId).find("#tab_video_youtube_content_preview_metadata");
		var button = $("#" + previewDivId).find(".okButton");
		$(videoArea).html("");
		$(metadataArea).html("");
		if((renderedIframe) && (video)) {
			$(videoArea).append(renderedIframe);
			var table = VISH.Utils.generateTable(video.author, video.title, video.description);
			$(metadataArea).html(table);
			$(button).show();
		}
	};
  
  
	var _cleanVideoPreview = function() {
		var videoArea = $("#" + previewDivId).find("#tab_video_youtube_content_preview_video");
		var metadataArea = $("#" + previewDivId).find("#tab_video_youtube_content_preview_metadata");
		var button = $("#" + previewDivId).find(".okButton");
		$(videoArea).html("");
		$(metadataArea).html("");
		$(button).hide();
	};

 
	var _generateWrapper = function (videoId) {
		var video_embedded = "http://www.youtube.com/embed/"+videoId;
		current_area=  VISH.Editor.getCurrentArea();
		var width_height = VISH.Editor.Utils.dimentionToDraw(current_area.width(), current_area.height(), 325, 243 );    
		var wrapper = "<iframe src='"+video_embedded+"?wmode=opaque' frameborder='0' style='width:"+width_height.width+ "px; height:"+ width_height.height+ "px;'></iframe>";
		return wrapper;
	}
 
	var generateWrapperForYoutubeVideoUrl = function (url){
		var videoId = _getYoutubeIdFromURL(url);
		if(videoId!=null){
			return _generateWrapper(videoId);
		} else {
			return "Youtube Video ID can't be founded."
		}
	}
 
	var _generatePreviewWrapper = function (videoId) {
		var video_embedded = "http://www.youtube.com/embed/"+videoId;
		var wrapper = '<iframe class="objectPreview" type="text/html" src="'+video_embedded+'?wmode=opaque" frameborder="0"></iframe>';
		return wrapper;
	}
 
	var generatePreviewWrapperForYoutubeVideoUrl = function (url){
		var videoId = _getYoutubeIdFromURL(url);
		if(videoId!=null){
			return _generatePreviewWrapper(videoId);
		} else {
			return "<p class='objectPreview'>Youtube Video ID can't be founded.</p>"
		}
	}

  return {
		init		  								: init,
		onLoadTab	  								: onLoadTab,
		onClickCarrouselElement 					: onClickCarrouselElement, 
		requestYoutubeData 							: requestYoutubeData,
		addSelectedVideo							: addSelectedVideo,
		generateWrapperForYoutubeVideoUrl 			: generateWrapperForYoutubeVideoUrl,
		generatePreviewWrapperForYoutubeVideoUrl 	: generatePreviewWrapperForYoutubeVideoUrl
  };

}) (VISH, jQuery);
