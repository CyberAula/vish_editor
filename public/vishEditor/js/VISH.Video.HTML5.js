VISH.Video.HTML5 = (function(V,$,undefined){
		
	//Is the event trigger by the user or via code?
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

	var renderVideoFromJSON = function(videoJSON, options){
		var videoId = V.Utils.getId();
		var style = (videoJSON['style'])?"style='" + videoJSON['style'] + "'":"";
		var controls= (videoJSON['controls'])?"controls='" + videoJSON['controls'] + "' ":"controls='controls' ";
		var autoplay= (videoJSON['autoplay'])?"autoplayonslideenter='" + videoJSON['autoplay'] + "' ":"";
		var poster=(videoJSON['poster'])?"poster='" + videoJSON['poster'] + "' ":"";
		var loop=(videoJSON['loop'])?"loop='loop' ":"";

		//Params forced by options
		var videoClass = "";
		if(options){
			if(options.videoClass){
				videoClass = "class='"+options.videoClass+"'";
			}
			if(typeof options.controls != "undefined"){
				if(options.controls === false){
					controls = "";
				} else {
					controls = "controls='" + options.controls + "' ";
				}
			}
			if(typeof options.poster != "undefined"){
				if(options.poster === false){
					poster = "";
				} else {
					poster="poster='" + options.poster + "' ";
				}
			}
		};

		var video = "<video id='" + videoId + "' " + videoClass + " preload='metadata' " + style + controls + autoplay + poster + loop + ">";
		
		var sources = getSourcesFromJSON(videoJSON);
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
	var playVideos = function(element){
		var currentVideos = $(element).find("video");
		$.each(currentVideos, function(index, video) {
			
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
	var stopVideos = function(element){
		var currentVideos = $(element).find("video");
		$.each(currentVideos, function(index, video) {
			var playing = ! video.paused;
			$(video).attr("wasplayingonslideleave",playing);
			if(playing){
				video.pause();
			}
		});
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

	var getVideoMimeType = function(url){
		var source = (V.Object.getObjectInfo(url)).source;
		return "video/" + source.split('.').pop();
	};

	var getSourcesFromJSON = function(videoJSON){
		try {
			var sources = JSON.parse(videoJSON['sources']);

			//Compatibility with old VE versions (now the attr type is called mimeType)
			$.each(sources, function(index, source) {
				source.mimeType = source.type;
			});

			return sources;
		} catch (e){
			return [];
		}
	};

	return {
		init 				: init,
		renderVideoFromJSON	: renderVideoFromJSON,
		setVideoEvents 		: setVideoEvents,
		playVideos 			: playVideos,
		stopVideos 			: stopVideos,
		playVideo 			: playVideo,
		pauseVideo 			: pauseVideo,
		seekVideo			: seekVideo,
		showControls 		: showControls,
		getSources 			: getSources,
		getVideoMimeType	: getVideoMimeType
	};

})(VISH,jQuery);