VISH.Editor.Video.HTML5 = (function(V,$,undefined){
	
	var init = function(){
	};

	var drawVideoWithWrapper = function(videoTag){
		var sources = V.Video.HTML5.getSources(videoTag);
		if(sources.length > 0){
			var options = {};

			//Look for poster
			var poster = V.Video.HTML5.getPoster(videoTag);
			if(typeof poster == "string"){
				options.poster = poster;
			}
			//Look for autoplay...
			options.timestamp = true;

			drawVideo(sources,options);
		}
	};

	var drawVideoWithUrl = function(url){
		var options = {};
		options.timestamp = true;
		drawVideo([{src: url}],options);
	};
	
	/**
	* Returns a video object prepared to draw.
	* Sources: array of arrays [[source src, source type],...] .
	* Options: hash with additional data like poster url or autoplay
	* param area: optional param indicating the area to add the video, used for editing presentations
	* param style: optional param with the style, used in editing presentation
	*/
	var drawVideo = function(sources,options,area,style){
		var current_area;
		if(area){
			current_area = area;
		}	else {
			current_area = V.Editor.getCurrentArea();
		}
		current_area.attr('type','video');

		//Default options
		var posterUrl = V.Video.HTML5.getDefaultPosterURL();
		var autoplay = false;
			
		//Replace defeault options if options hash is defined
		if(options){
			if((options['poster'])&&(!V.Video.HTML5.isDefaultPosterPath(options['poster']))){
				posterUrl = options['poster'];
			}
			if(options['autoplay']){
				autoplay = options['autoplay'];
			}
		}
			
		var template = V.Editor.getTemplate(area);

		var nextVideoId = V.Utils.getId();
		var idToDragAndResize = "draggable" + nextVideoId;
		
		var videoTag = document.createElement('video');
		videoTag.setAttribute('id', idToDragAndResize);
		videoTag.setAttribute('draggable', true);
		videoTag.setAttribute('class', template + "_video");
		videoTag.setAttribute('title', "Click to drag");
		videoTag.setAttribute('controls', "controls");
		videoTag.setAttribute('preload', "metadata");
		videoTag.setAttribute('poster', posterUrl);
		videoTag.setAttribute('autoplayonslideenter',autoplay);
		if(style){
			videoTag.setAttribute('style', style);
		}

		$(current_area).html("");
		$(current_area).append(videoTag);

		//Insert sources after append video
		V.Video.HTML5.addSourcesToVideoTag(sources,videoTag,{timestamp:true});

		V.Editor.addDeleteButton($(current_area));

		$("#" + idToDragAndResize).draggable({cursor: "move"});

		V.Editor.Tools.loadToolsForZone(current_area);
	};


	/*
	 * Renderer
	 */
	var renderVideoFromWrapper = function(videoTag,options){
		var sources = V.Video.HTML5.getSources(videoTag);
		if(sources.length > 0){
			var options = options || {};
			//Look for poster
			var poster = V.Video.HTML5.getPoster(videoTag);
			if(typeof poster == "string"){
				options.poster = poster;
			}
			return V.Video.HTML5.renderVideoFromSources(sources,options);
		}
	};

	var renderVideoWithURL = function(url,options){
		return V.Video.HTML5.renderVideoFromSources([{src: url}],options);
	};

	/* More Utils */
	var getDefaultPoster = function(){
		return V.ImagesPath + "icons/example_poster_image.jpg";
	};


	return {
		init 					: init,
		drawVideoWithUrl 		: drawVideoWithUrl,
		drawVideo 				: drawVideo,
		drawVideoWithWrapper	: drawVideoWithWrapper,
		renderVideoFromWrapper	: renderVideoFromWrapper,
		renderVideoWithURL		: renderVideoWithURL,
		getDefaultPoster		: getDefaultPoster
	};

}) (VISH, jQuery);
