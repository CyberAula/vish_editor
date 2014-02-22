VISH.Editor.Video.Youtube = (function(V,$,undefined){
	
	var containerDivId = "tab_video_youtube_content";
	var carrouselDivId = "tab_video_youtube_content_carrousel";
	var previewDivId = "tab_video_youtube_content_preview";
	var myInput;
	var timestampLastSearch;

	//Store video metadata
	var currentVideos = new Array();
	var selectedVideo = null;

	//Youtube API
	var MAX_VIDEOS = 20; //maximum video query for youtube API's (999 max)


	var init = function(){
		myInput = $("#" + containerDivId).find("input[type='search']");
		$(myInput).vewatermark(V.I18n.getTrans("i.SearchContent"));
		$(myInput).keydown(function(event){
			if(event.keyCode == 13) {
				_requestData($(myInput).val());
				$(myInput).blur();
			}
		});
	};

	var beforeLoadTab = function(){
		_cleanSearch();
	};
	
	var onLoadTab = function(){
	};
	
	var _requestData = function(text){
		_prepareRequest();
		_searchInYoutube(text);
	};

	var _prepareRequest = function(){
		_cleanCarrousel();
		_cleanVideoPreview();
		V.Utils.Loader.startLoadingInContainer($("#"+carrouselDivId));
		$(myInput).attr("disabled","true");
		timestampLastSearch = Date.now();
	};
	
	var _cleanSearch = function(){
		timestampLastSearch = undefined;
		$(myInput).val("");
		$(myInput).removeAttr("disabled");
		_cleanVideoPreview();
		_cleanCarrousel();
	};

	var _cleanCarrousel = function(){
		$("#" + carrouselDivId).hide();
		V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
	};

	var _searchInYoutube = function(text){
		var url_youtube = "http://gdata.youtube.com/feeds/api/videos?q="+text+"&alt=json-in-script&callback=?&max-results="+MAX_VIDEOS+"&start-index=1";	 
		$.getJSON(url_youtube, function(data){
			_onDataReceived(data);
		}).error(function(){
			_onAPIError();
		});
	};

	var _onDataReceived = function(data) {
		if(!_isValidResult()){
			return;
		}

		//The received data has an array called "feed"
		if((!data)||(!data.feed)||(data.feed.length==0)||(!data.feed.entry)){
			_onSearchFinished();
			_drawData(true);
			return;
		}

		currentVideos = new Array();
		var carrouselImages = [];

		$.each(data.feed.entry, function(i, item){
			var video = item['id']['$t'];
			var title = item['title']['$t']; //not used yet
			var author = item.author[0].name.$t;
			var subtitle = item.media$group.media$description.$t;

			video = video.replace('http://gdata.youtube.com/feeds/api/videos/', 'http://www.youtube.com/watch?v='); //replacement of link
			var videoId = video.replace('http://www.youtube.com/watch?v=', ''); //removing link and getting the video ID
			currentVideos[videoId] = new Object();
			currentVideos[videoId].id = videoId;
			currentVideos[videoId].title = title;
			currentVideos[videoId].author = author;
			currentVideos[videoId].subtitle = subtitle;

			var image_url = "http://img.youtube.com/vi/"+videoId+"/0.jpg";
			var myImg = $("<img videoId='"+videoId+"' src='"+image_url+"' title='"+title+"'/>");
			carrouselImages.push(myImg); 
		});
			
		var options = {};
		options.callback = _onImagesLoaded;
		V.Utils.Loader.loadImagesOnContainer(carrouselImages,carrouselDivId,options);
	};

	var _onImagesLoaded = function(){
		_onSearchFinished();
		_drawData();
	};
	
	var _onSearchFinished = function(){
		V.Utils.Loader.stopLoadingInContainer($("#"+carrouselDivId));
		$(myInput).removeAttr("disabled");
	};

	var _drawData = function(noResults){
		$("#" + carrouselDivId).show();

		if(!_isValidResult()){
			//We need to clean because data has been loaded by V.Utils.Loader
			_cleanCarrousel();
			return;
		}

		V.Utils.addTempShown([$("#" + containerDivId),$("#" + carrouselDivId)]);

		if(noResults===true){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'>" + V.I18n.getTrans("i.Noresultsfound") + "</p>");
			V.Utils.removeTempShown([$("#" + containerDivId),$("#" + carrouselDivId)]);
		} else if(noResults===false){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'>" + V.I18n.getTrans("i.errorYoutubeConnection") + "</p>");
			V.Utils.removeTempShown([$("#" + containerDivId),$("#" + carrouselDivId)]);
		} else {
			var options = new Array();
			options.rows = 1;
			options.callback = _onClickCarrouselElement;
			options.rowItems = 5;
			options.scrollItems = 5;		
			options.afterCreateCarruselFunction = function(){
				//We need to wait even a little more that afterCreate callback
				setTimeout(function(){
					V.Utils.removeTempShown([$("#" + containerDivId),$("#" + carrouselDivId)]);
				},100);
			}
			V.Editor.Carrousel.createCarrousel(carrouselDivId, options);
		}
	};

	var addSelectedVideo = function(){
		if(selectedVideo != null){
			V.Editor.Video.addContent(_generateWrapper(selectedVideo.id));
		}
	};

	var _onAPIError = function(){
		if(_isValidResult()){
			_onSearchFinished();
			_drawData(false);
		}
	};
	
	var _onClickCarrouselElement = function(event) {
		var videoId = $(event.target).attr("videoId");
		var renderedPreviewVideo = _generatePreviewWrapper(videoId);
		_renderVideoPreview(renderedPreviewVideo, currentVideos[videoId]);
		selectedVideo = currentVideos[videoId];
	};

	var _isValidResult = function(){
		if(typeof timestampLastSearch == "undefined"){
			//Old search (not valid).
			return false;
		}

		var isVisible = $("#" + carrouselDivId).is(":visible");
		if(!isVisible){
			return false;
		}

		return true;
	};


	/* Video Preview */
  
	var _renderVideoPreview = function(renderedIframe, video) {
		var videoArea = $("#" + previewDivId).find("#tab_video_youtube_content_preview_video");
		var metadataArea = $("#" + previewDivId).find("#tab_video_youtube_content_preview_metadata");
		var button = $("#" + previewDivId).find(".okButton");
		$(videoArea).html("");
		$(metadataArea).html("");
		if((renderedIframe) && (video)) {
			$(videoArea).append(renderedIframe);
			var table = V.Editor.Utils.generateTable({title:video.title, author:video.author, description:video.subtitle});
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

	var _generateWrapper = function(videoId){
		var videoURL = "http://www.youtube.com/embed/"+videoId;
		videoURL = V.Utils.addParamToUrl(videoURL,"wmode","opaque");
		var videoWContainer = ((typeof V.Editor.getCurrentArea() != "undefined")&&(V.Editor.getCurrentArea() != null)) ? V.Editor.getCurrentArea() : V.Editor.getCurrentContainer();
		var dimensionsToDraw = V.Utils.dimentionsToDraw($(videoWContainer).width(), $(videoWContainer).height(),325,243);
		var wrapper = "<iframe src='"+videoURL+"' frameborder='0' style='width:"+dimensionsToDraw.width+"px; height:"+dimensionsToDraw.height+"px;'></iframe>";
		return wrapper;
	};
 
	var generateWrapperForYoutubeVideoUrl = function (url){
		var videoId = V.Video.Youtube.getYoutubeIdFromURL(url);
		if(videoId!=null){
			return _generateWrapper(videoId);
		} else {
			return "Youtube Video ID can't be founded.";
		}
	};

	var _generatePreviewWrapper = function(videoId){
		var videoURL = "http://www.youtube.com/embed/"+videoId;
		videoURL = V.Utils.addParamToUrl(videoURL,"wmode","opaque");
		var wrapper = '<iframe class="objectPreview" src="'+videoURL+'" frameborder="0"></iframe>';
		return wrapper;
	};

	var generatePreviewWrapperForYoutubeVideoUrl = function(url){
		var videoId = V.Video.Youtube.getYoutubeIdFromURL(url);
		if(videoId!=null){
			return _generatePreviewWrapper(videoId);
		} else {
			return "<p class='objectPreview'>Youtube Video ID can't be founded.</p>"
		}
	};

	return {
		init		  								: init,
		beforeLoadTab								: beforeLoadTab,
		onLoadTab	  								: onLoadTab,
		addSelectedVideo							: addSelectedVideo,
		generateWrapperForYoutubeVideoUrl 			: generateWrapperForYoutubeVideoUrl,
		generatePreviewWrapperForYoutubeVideoUrl 	: generatePreviewWrapperForYoutubeVideoUrl
	};

}) (VISH, jQuery);
