VISH.VideoPlayer.HTML5 = (function(){
		
	//Is the event trigger by the user or via code?
	var playTriggeredByUser = true;
	var pauseTriggeredByUser = true;
	var seekTriggeredByUser = true;

	var setVideoEvents = function(){
		var videos = $("video")
		$.each(videos, function(index, video) {
			video.addEventListener('play', function () {
				// VISH.Debugging.log("Play at " + video.currentTime);

				var params = new Object();
				params.type = "HTML5";
				params.videoId = video.id;
				params.currentTime = video.currentTime;
				params.slideNumber = VISH.Slides.getCurrentSlideNumber();
				VISH.Events.Notifier.notifyEvent(VISH.Constant.Event.onPlayVideo,params,playTriggeredByUser);

				playTriggeredByUser = true;
			}, false);
			video.addEventListener('pause', function () {
				// VISH.Debugging.log("Pause " + video.currentTime);

				var params = new Object();
				params.type = "HTML5";
				params.videoId = video.id;
				params.currentTime = video.currentTime;
				params.slideNumber = VISH.Slides.getCurrentSlideNumber();
				VISH.Events.Notifier.notifyEvent(VISH.Constant.Event.onPauseVideo,params,pauseTriggeredByUser);
				
				pauseTriggeredByUser = true;
			}, false);
			video.addEventListener('ended', function () {
				// VISH.Debugging.log("Ended " + video.currentTime)
			}, false);

			video.addEventListener("error", function(err) {
                // VISH.Debugging.log("Video error: " + err)
            }, false);

			video.addEventListener("seeked", function(err) {
                // VISH.Debugging.log("Seek at " + video.currentTime)

                var params = new Object();
				params.type = "HTML5";
				params.videoId = video.id;
				params.currentTime = video.currentTime;
				params.slideNumber = VISH.Slides.getCurrentSlideNumber();
				VISH.Events.Notifier.notifyEvent(VISH.Constant.Event.onSeekVideo,params,seekTriggeredByUser);
				
				seekTriggeredByUser = true;
            }, false);

			//PREVENT KEYBOARD EVENTS ON FIREFOX!
			$(video).focus(function(event) {
				this.blur();
			});
		});
	}
	
		
	/**
	 * Function to start all videos of a slide
	 */
	var playVideos = function(element){
		var currentVideos = $(element).find("video");
		$.each(currentVideos, function(index, video) {
			
			if ($(video).attr("wasplayingonslideleave")=="true"){
			  video.play()
			} else if ($(video).attr("wasplayingonslideleave")=="false"){
				//Do nothing
			} else if (typeof $(video).attr("wasplayingonslideleave") == "undefined"){
				//No wasplayingonslideleave attr
				
				//Check autoplayonsliddenter attr
				if ($(video).attr("autoplayonslideenter")=="true"){
					video.play()
				}
			}
		});
	}
	
	
	/**
	 * Function to stop all videos of a slide
	 */
	var stopVideos = function(element){
		var currentVideos = $(element).find("video");
		$.each(currentVideos, function(index, video) {
			var playing = ! video.paused;
			$(video).attr("wasplayingonslideleave",playing)
			if(playing){
				video.pause()
			}
		});
	}

	/**
	 * Function to start a specific video
	 */
	var startVideo = function(videoId,currentTime){
		var video = $("#"+videoId)[0];

		if((typeof currentTime === 'number')&&(video.currentTime !== currentTime)){
			seekTriggeredByUser = false;
			video.currentTime = currentTime;
		}
		if(video.paused){
			playTriggeredByUser = false;
			video.play();
		}
	}

	/**
	 * Function to pause a specific video
	 */
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
	}


	/**
	 * Function to seek a specific video
	 */
	var seekVideo = function(videoId,currentTime){
		var video = $("#"+videoId)[0];
		if((typeof currentTime === 'number')&&(video.currentTime !== currentTime)){
			seekTriggeredByUser = false;
			video.currentTime = currentTime;
		}
	}

	var showControls = function(showControls){
		var videos = $("video")
		$.each(videos, function(index, video) {
			if(!showControls){
				$(video).removeAttr("controls");
			} else {
				$(video).attr("controls",true);
			}
		});
	}

	return {
		setVideoEvents 		: setVideoEvents,
		playVideos 			: playVideos,
		stopVideos 			: stopVideos,
		startVideo 			: startVideo,
		pauseVideo 			: pauseVideo,
		seekVideo			: seekVideo,
		showControls 		: showControls
	};

})(VISH,jQuery);