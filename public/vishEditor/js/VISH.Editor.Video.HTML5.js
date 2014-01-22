VISH.Editor.Video.HTML5 = (function(V,$,undefined){
	
	var init = function(){
	};

	var drawVideoWithWrapper = function(videoTag){
		var sources = V.VideoPlayer.HTML5.getSources(videoTag);
		if(sources.length > 0){
			var options = {};

			//Look for poster
			var video = $(videoTag);
			if($(video).attr("poster")){
				options.poster = $(video).attr("poster");
			}
			// if($(video).attr("autoplay")=="true"){
			// 	options.autoplay = "true";
			// }
			drawVideo(sources,options);
		}
	};

	var drawVideoWithUrl = function(url){
		drawVideo([{src: url}]);
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

		//Default options
		var posterUrl = V.ImagesPath + "vicons/example_poster_image.jpg";
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
			
		var template = V.Editor.getTemplate(area);

		var nextVideoId = V.Utils.getId();
		var idToDragAndResize = "draggable" + nextVideoId;
		current_area.attr('type','video');

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
			
		$(sources).each(function(index, source){
			var videoSource = document.createElement('source');
			videoSource.setAttribute('src', source.src);
			if(source.mimeType){
				videoSource.setAttribute('type', source.mimeType);
			} else {
				videoSource.setAttribute('type', V.VideoPlayer.HTML5.getVideoMimeType(source.src));
			}
			$(videoTag).append(videoSource);
		});

		var fallbackText = document.createElement('p');
		$(fallbackText).html("Your browser does not support HTML5 video.");
		$(videoTag).append(fallbackText);

		$(current_area).html("");
		$(current_area).append(videoTag);

		V.Editor.addDeleteButton($(current_area));

		$("#" + idToDragAndResize).draggable({cursor: "move"});

		V.Editor.Tools.loadToolsForZone(current_area);
	};


	/*
	 * Renderer
	 */
	var renderVideoFromWrapper = function(videoTag){
		var sources = V.VideoPlayer.HTML5.getSources(videoTag);
		if(sources.length > 0){
			return renderVideoFromSources(sources);
		}
	};

	var renderVideoWithURL = function(url){
		return renderVideoFromSources([{src: url}]);
	};

	var renderVideoFromSources = function(sources){
		var posterUrl = V.ImagesPath + "icons/example_poster_image.jpg";
		var rendered = "<video class='objectPreview' preload='metadata' controls='controls' poster='" + posterUrl + "' >";
		$.each(sources, function(index, source) {
			rendered = rendered + "<source src='" + source.src + "' " + (typeof source.mimeType == "string" ? source.mimeType : V.VideoPlayer.HTML5.getVideoMimeType(source.src)) + ">";
		});   
		rendered = rendered + "</video>";
		return rendered;
	};

	return {
		init 					: init,
		drawVideoWithUrl 		: drawVideoWithUrl,
		drawVideo 				: drawVideo,
		drawVideoWithWrapper	: drawVideoWithWrapper,
		renderVideoFromWrapper	: renderVideoFromWrapper,
		renderVideoWithURL		: renderVideoWithURL,
		renderVideoFromSources 	: renderVideoFromSources
	};

}) (VISH, jQuery);
