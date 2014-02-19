VISH.Video.HTML5 = (function(V,$,undefined){
		
	//Is the event trigger by the user or via code
	var playTriggeredByUser = true;
	var pauseTriggeredByUser = true;
	var seekTriggeredByUser = true;


	var init = function(){
	};

	/* 
	 * HTML5 Video API
	 */

	var playVideo = function(videoId,currentTime){
		var video = $("#"+videoId)[0];
		if((typeof currentTime === 'number')&&(video.currentTime !== currentTime)){
			seekTriggeredByUser = false;
			video.currentTime = currentTime;
		}
		if(video.paused){
			playTriggeredByUser = false;
			video.play();
		}
	};

	var pauseVideo = function(videoId,currentTime){
		var video = $("#"+videoId)[0];
		if((typeof currentTime === 'number')&&(video.currentTime !== currentTime)){
			seekTriggeredByUser = false;
			video.currentTime = currentTime;
		}
		if(!video.paused){
			pauseTriggeredByUser = false;
			video.pause();
		}
	};

	var seekVideo = function(videoId,currentTime){
		var video = $("#"+videoId)[0];
		if((typeof currentTime === 'number')&&(video.currentTime !== currentTime)){
			seekTriggeredByUser = false;
			video.currentTime = currentTime;
		}
	};

	var showControls = function(showControls){
		var videos = $("video");
		$.each(videos, function(index, video) {
			if(!showControls){
				$(video).removeAttr("controls");
			} else {
				$(video).attr("controls",true);
			}
		});
	};


	/* 
	 * ViSH Viewer features
	 */

	var setVideoEvents = function(){
		var videos = $("video");
		$.each(videos, function(index, video){
			video.addEventListener('play', function(){
				// V.Debugging.log("Play at " + video.currentTime);
				var params = new Object();
				params.type = "HTML5";
				params.videoId = video.id;
				params.currentTime = video.currentTime;
				params.slideNumber = V.Slides.getCurrentSlideNumber();
				V.EventsNotifier.notifyEvent(V.Constant.Event.onPlayVideo,params,playTriggeredByUser);
				playTriggeredByUser = true;
			}, false);
			video.addEventListener('pause', function(){
				// V.Debugging.log("Pause " + video.currentTime);
				var params = new Object();
				params.type = "HTML5";
				params.videoId = video.id;
				params.currentTime = video.currentTime;
				params.slideNumber = V.Slides.getCurrentSlideNumber();
				V.EventsNotifier.notifyEvent(V.Constant.Event.onPauseVideo,params,pauseTriggeredByUser);
				pauseTriggeredByUser = true;
			}, false);
			video.addEventListener('ended', function(){
				// V.Debugging.log("Ended " + video.currentTime);
			}, false);
			video.addEventListener("error", function(err){
                // V.Debugging.log("Video error: " + err);
            }, false);
			video.addEventListener("seeked", function(err){
                // V.Debugging.log("Seek at " + video.currentTime);
                var params = new Object();
				params.type = "HTML5";
				params.videoId = video.id;
				params.currentTime = video.currentTime;
				params.slideNumber = V.Slides.getCurrentSlideNumber();
				V.EventsNotifier.notifyEvent(V.Constant.Event.onSeekVideo,params,seekTriggeredByUser);
				seekTriggeredByUser = true;
            }, false);
			//PREVENT KEYBOARD EVENTS ON FIREFOX!
			$(video).focus(function(event){
				this.blur();
			});
		});
	};
	

	/**
	 * Function to start all videos of a slide
	 */
	var playVideos = function(slide){
		var currentVideos = $(slide).find("video");
		$.each(currentVideos, function(index, video){
			if ($(video).attr("wasplayingonslideleave")=="true"){
			  video.play();
			} else if ($(video).attr("wasplayingonslideleave")=="false"){
				//Do nothing
			} else if (typeof $(video).attr("wasplayingonslideleave") == "undefined"){
				//No wasplayingonslideleave attr
				
				//Check autoplayonsliddenter attr
				if ($(video).attr("autoplayonslideenter")=="true"){
					video.play();
				}
			}
		});
	};
	
	/**
	 * Function to stop all videos of a slide
	 */
	var stopVideos = function(slide){
		var currentVideos = $(slide).find("video");
		$.each(currentVideos, function(index, video) {
			var playing = ! video.paused;
			$(video).attr("wasplayingonslideleave",playing);
			if(playing){
				video.pause();
			}
		});
	};


	/*
	 * Rendering
	 */

	 var renderVideoFromJSON = function(videoJSON, options){
		var renderOptions = {};

		renderOptions.videoId = (videoJSON['id']) ? videoJSON['id'] : V.Utils.getId();
		renderOptions.style = videoJSON['style'];
		renderOptions.controls = videoJSON['controls'];
		renderOptions.autoplay = videoJSON['autoplay'];
		renderOptions.poster = videoJSON['poster'];
		renderOptions.loop = videoJSON['loop'];
		
		//Params forced by options
		if(options){
			if(options.videoClass){
				renderOptions.extraClasses = options.videoClass;
			}
			if(options.controls === false){
				renderOptions.controls = options.controls;
			}
			if(typeof options.poster != "undefined"){
				renderOptions.poster = options.poster;
			}
		};

		return renderVideoFromSources(getSourcesFromJSON(videoJSON),renderOptions);
	};

	var renderVideoFromSources = function(sources,options){
		var videoId = "";
		var videoClasses = "";
		var controls = "controls='controls' ";
		var autoplay = "";
		var poster = "";
		var loop = "";
		var style = "";
		
		if(options){
			if(options['videoId']){
				videoId = "id='"+options['videoId']+"'";
			}
			if(options['extraClasses']){
				videoClasses = videoClasses + options['extraClasses'];
			}
			if(options.controls === false){
				controls = "";
			}
			if(typeof options.autoplay != "undefined"){
				autoplay = "autoplayonslideenter='" + options.autoplay + "' ";
			}
			if(typeof options['poster'] == "string"){
				poster = "poster='"+options['poster']+"' ";
			}
			if(options['loop'] === true){
				loop = "loop='loop' ";
			}
			if(options['style']){
				style = "style='" + options['style'] + "' ";
			}
		}

		var video = "<video " + videoId + " class='" + videoClasses + "' preload='metadata' " + controls + autoplay + poster + loop + style + ">";
		$.each(sources, function(index, source){
			if(typeof source.src == "string"){
				var mimeType = (source.mimeType)?"type='" + source.mimeType + "' ":"";
				video = video + "<source src='" + source.src + "' " + mimeType + ">";
			}	
		});

		if(sources.length>0){
			video = video + "<p>Your browser does not support HTML5 video.</p>";
		}

		video = video + "</video>";

		return video;
	};


	/*
	 * Utils
	 */

	var getSources = function(videoDOM){
		try {
			return $(videoDOM).find("source").map(function(){ return {"src": this.src, "mimeType": getVideoMimeType(this.src)}});
		} catch(e){
			return [];
		}
		return [];
	};

	var getSourcesFromJSON = function(videoJSON){
		if(typeof videoJSON != "object"){
			return [];
		}

		if(typeof videoJSON.sources == "string"){
			try {
				var sources = JSON.parse(videoJSON.sources);
			} catch (e){
				return [];
			}
		} else if(typeof videoJSON.sources == "object"){
			var sources = videoJSON.sources;
		}

		if(typeof sources != "undefined"){
			//Compatibility with old VE versions (now the attr type is called mimeType)
			$.each(sources, function(index, source){
				if(typeof source.type != "undefined"){
					source.mimeType = source.type;
				}
			});
		}

		return sources;
	};

	var getVideoMimeType = function(url){
		var source = (V.Object.getObjectInfo(url)).source;
		return "video/" + source.split('.').pop();
	};

	return {
		init 				: init,
		renderVideoFromJSON	: renderVideoFromJSON,
		renderVideoFromSources	: renderVideoFromSources,
		setVideoEvents 		: setVideoEvents,
		playVideos 			: playVideos,
		stopVideos 			: stopVideos,
		playVideo 			: playVideo,
		pauseVideo 			: pauseVideo,
		seekVideo			: seekVideo,
		showControls 		: showControls,
		getSources 			: getSources,
		getSourcesFromJSON	: getSourcesFromJSON,
		getVideoMimeType	: getVideoMimeType
	};

})(VISH,jQuery);