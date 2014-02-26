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
		var renderOptions = options || {};

		if(typeof renderOptions.id == "undefined"){
			renderOptions.id = (videoJSON['id']) ? videoJSON['id'] : V.Utils.getId();
		}
		if(typeof renderOptions.controls == "undefined"){
			renderOptions.controls = videoJSON['controls'];
		}
		if(typeof renderOptions.poster == "undefined"){
			renderOptions.poster = videoJSON['poster'];
		}

		renderOptions.style = videoJSON['style'];
		renderOptions.autoplay = videoJSON['autoplay'];
		renderOptions.loop = videoJSON['loop'];
		
		return renderVideoFromSources(getSourcesFromJSON(videoJSON),renderOptions);
	};

	var renderVideoFromSources = function(sources,options){
		var video = $("<video></video>");

		if((options)&&(options.extraAttrs)){
			for(var key in options.extraAttrs){
				$(video).attr(key,options.extraAttrs[key]);
			}
		}

		if(options){
			if(options['id']){
				$(video).attr("id",options['id']);
			}
			if(typeof options.onVideoReady == "string"){
				//Look for the function
				try {
					var onVideoReadySplit = options.onVideoReady.split(".");
					var onVideoReadyFunction = window[onVideoReadySplit[0]];
					for(var k=1; k<onVideoReadySplit.length; k++){
						onVideoReadyFunction = onVideoReadyFunction[onVideoReadySplit[k]];
					}
					if(typeof onVideoReadyFunction == "function"){
						// onVideoReady = 'onloadeddata="'+ options.onVideoReady + '(this)' + '" ';
						$(video).attr("onloadeddata",options.onVideoReady + '(this)');
					}
				} catch(e){}
			}
			if(options['extraClasses']){
				var extraClassesLength = options['extraClasses'].length;
				for(var i=0; i<extraClassesLength; i++){
					$(video).addClass(options['extraClasses'][i]);
				}
			}
			if(options.controls !== false){
				$(video).attr("controls","controls");
			}
			if(typeof options.autoplay != "undefined"){
				$(video).attr("autoplayonslideenter",options.autoplay);
			}
			if(typeof options['poster'] == "string"){
				$(video).attr("poster",options['poster']);
			}
			if(options['loop'] === true){
				$(video).attr("loop","loop");
			}
			if(options['style']){
				$(video).attr("style",options['style']);
			}
		}
		video = V.Utils.getOuterHTML(video);
		video = video.split("</video>")[0];

		//Write sources (we can't loaded it to the DOM directly, because then they will start to load, before been actually rendered)
		if((!options)||(options.loadSources !== false)){
			$.each(sources, function(index, source){
				if(typeof source.src == "string"){
					var mimeType = (source.mimeType)?"type='" + source.mimeType + "' ":"";
					video = video + "<source src='" + source.src + "' " + mimeType + ">";
				}
			});

			if(sources.length>0){
				video = video + "<p>Your browser does not support HTML5 video.</p>";
			}
		}

		video = video + "</video>";

		return video;
	};

	var addSourcesToVideoTag = function(sources,videoTag){
		$.each(sources, function(index, source){
			if(typeof source.src == "string"){
				var mimeType = (source.mimeType)?"type='" + source.mimeType + "' ":"";
				$(videoTag).append("<source src='"+source.src+"' " + mimeType + ">");
			}
		});
		if(sources.length>0){
			$(videoTag).append("<p>Your browser does not support HTML5 video.</p>");
		}
	};

	/*
	 * Utils
	 */

	var getSources = function(videoDOM){
		if(typeof videoDOM == "string"){
			var sources = [];
			//Prevent video to be rendered in a non appropriate time.
			var srcPattern = new RegExp("src=(\'||\")([a-z.://0-9]+)","g");

			// var videoDOM = "<video controls='controls'><source src='http://vishub.org/videos/3366.webm' type='video/webm' ><source src='http://vishub.org/videos/3366.mp4' type='video/mp4' ><p>Your browser does not support HTML5 video.</p></video>";
			var found;
			while(found = srcPattern.exec(videoDOM)){
				if(found.length>2){
					sources.push(found[2]);
				}
				srcPattern.lastIndex = found.index+1;
			};

			return sources.map(function(value){ return {"src": value, "mimeType": getVideoMimeType(value)}});
		}

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
		addSourcesToVideoTag	: addSourcesToVideoTag,
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