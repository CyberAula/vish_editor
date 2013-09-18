VISH.Editor.Video.Repository = (function(V, $, undefined) {
	
	var containerDivId = "tab_video_repo_content";
	var carrouselDivId = "tab_video_repo_content_carrousel";
	var previewDivId = "tab_video_repo_content_preview";
	var myInput;
	var timestampLastSearch;

	//Store video metadata
	var currentVideos = new Array();
	var selectedVideo = null;
	

	var init = function(){
		myInput = $("#tab_video_repo_content").find("input[type='search']");
		$(myInput).watermark(V.I18n.getTrans("i.SearchContent"));
		$(myInput).keydown(function(event){
			if(event.keyCode == 13) {
				_requestData($(myInput).val());
				$(myInput).blur();
			}
		});
	};
	
	var beforeLoadTab = function(){
		_cleanSearch();
	}
	
	var onLoadTab = function(){
		
	};
	
	var _requestData = function(text){
		_prepareRequest();
		V.Editor.API.requestVideos(text, _onDataReceived, _onAPIError);
	};

	var _prepareRequest = function(){
		_cleanCarrousel();
		_cleanVideoPreview();
		V.Utils.Loader.startLoadingInContainer($("#"+carrouselDivId));
		$(myInput).attr("disabled","true");
		timestampLastSearch = Date.now();
	}

	var _cleanSearch = function(){
		timestampLastSearch = undefined;
		$(myInput).val("");
		$(myInput).removeAttr("disabled");
		_cleanVideoPreview();
		_cleanCarrousel();
	}

	var _cleanCarrousel = function(){
		$("#" + carrouselDivId).hide();
		V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
	}

	var _onDataReceived = function(data){
		if(!_isValidResult()){
			return;
		}

		//The received data has an array called "videos"
		if((!data)||(!data.videos)||(data.videos.length==0)){
			_onSearchFinished();
			_drawData(true);
			return;
		}

		var carrouselImages = [];
		currentVideos = new Array();
		$.each(data.videos, function(index, video) {
			if(video){
				var myImg = $("<img src='" + video.poster + "' videoId='" + video.id + "' title='"+video.title+"'/>")
				carrouselImages.push(myImg);
				currentVideos[video.id] = video;
			}
		});

		var options = {};
		options.callback = _onImagesLoaded;
		V.Utils.Loader.loadImagesOnContainer(carrouselImages,carrouselDivId,options);
	};
	
	var _onImagesLoaded = function(){
		_onSearchFinished();
		_drawData();
	}
	
	var _onSearchFinished = function(){
		V.Utils.Loader.stopLoadingInContainer($("#"+carrouselDivId));
		$(myInput).removeAttr("disabled");
	}

	var _drawData = function(noResults){
		$("#" + carrouselDivId).show();

		if(!_isValidResult()){
			//We need to clean because data has been loaded by V.Utils.Loader
			_cleanCarrousel();
			return;
		}

		$("#" + containerDivId).addClass("temp_shown");
		$("#" + carrouselDivId).addClass("temp_shown");


		if(noResults===true){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'>" + "No results found" + "</p>");
		} else if(noResults===false){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'>" + "Error connecting to ViSH server" + "</p>");
		} else {
			var options = new Array();
			options.callback = _onClickCarrouselElement;
			options.rowItems = 5;
			options.scrollItems = 5;		
			options.afterCreateCarruselFunction = function(){
				//We need to wait even a little more that afterCreate callback
				setTimeout(function(){
					$("#" + containerDivId).removeClass("temp_shown");
					$("#" + carrouselDivId).removeClass("temp_shown");
				},100);
			}
			V.Editor.Carrousel.createCarrousel(carrouselDivId, options);
		}
	}
	
	var _onAPIError = function(){
		if(_isValidResult()){
			_onSearchFinished();
			_drawData(false);
		}
	};
	
	var _onClickCarrouselElement = function(event) {
		var videoId = $(event.target).attr("videoId");
		var renderedVideo = V.Renderer.renderVideo(currentVideos[videoId], "preview");
		_renderVideoPreview(renderedVideo, currentVideos[videoId]);
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
	}


	/* Preview */
	
	var _renderVideoPreview = function(renderedVideo, video) {
		var videoArea = $("#" + previewDivId).find("#tab_video_repo_content_preview_video");
		var metadataArea = $("#" + previewDivId).find("#tab_video_repo_content_preview_metadata");
		var button = $("#" + previewDivId).find(".okButton");
		$(videoArea).html("");
		$(metadataArea).html("");
		if((renderedVideo) && (video)) {
			$(videoArea).append(renderedVideo);
			var table = V.Editor.Utils.generateTable({title:video.title, author:video.author, description:video.description});
			$(metadataArea).html(table);
			$(button).show();
		}
	};
	
	var _cleanVideoPreview = function(){
		var videoArea = $("#" + previewDivId).find("#tab_video_repo_content_preview_video");
		var metadataArea = $("#" + previewDivId).find("#tab_video_repo_content_preview_metadata");
		var button = $("#" + previewDivId).find(".okButton");
		$(videoArea).html("");
		$(metadataArea).html("");
		$(button).hide();
	};
	
	var addSelectedVideo = function(){
		if(selectedVideo != null){
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
			V.Editor.Video.HTML5.drawVideo(sourcesArray, options);
			$.fancybox.close();
		}
	};
	
	return {
		init 				: init,
		beforeLoadTab 		: beforeLoadTab,
		onLoadTab 			: onLoadTab,
		addSelectedVideo 	: addSelectedVideo
	};

})(VISH, jQuery);
