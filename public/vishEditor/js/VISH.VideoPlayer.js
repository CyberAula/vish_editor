VISH.VideoPlayer = (function(){
		
	//Flag to prevent notify startVideo events
	//Prevent bucles
	var notifyEventFlag = true;

	var setVideoEvents = function(){
		var videos = $("video")
		$.each(videos, function(index, video) {
			video.addEventListener('play', function () {
				// VISH.Debugging.log("Play at " + video.currentTime);
				if((VISH.Messenger)&&(notifyEventFlag)){
					VISH.Messenger.sendMessage("playVideo",["HTML5",video.currentTime,VISH.Slides.getCurrentSlideNumber(),video.id]);
				} 
				notifyEventFlag = true;
			}, false);
			video.addEventListener('pause', function () {
				// VISH.Debugging.log("Pause " + video.currentTime);
				if((VISH.Messenger)&&(notifyEventFlag)){
					VISH.Messenger.sendMessage("pauseVideo",["HTML5",video.currentTime,VISH.Slides.getCurrentSlideNumber(),video.id]);
				}
				notifyEventFlag = true;
			}, false);
			video.addEventListener('ended', function () {
				// VISH.Debugging.log("Ended " + video.currentTime)
			}, false);

			video.addEventListener("error", function(err) {
                // VISH.Debugging.log("Video error: " + err)
            }, false);

			video.addEventListener("seeked", function(err) {
                // VISH.Debugging.log("Seek at " + video.currentTime)
                if((VISH.Messenger)&&(notifyEventFlag)){
					VISH.Messenger.sendMessage("seekVideo",["HTML5",video.currentTime,VISH.Slides.getCurrentSlideNumber(),video.id]);
				}
				notifyEventFlag = true;
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
	var startVideo = function(videoType,currentTime,videoSlideNumber,videoId){
		if(VISH.Slides.getCurrentSlideNumber()!=videoSlideNumber){
			VISH.Slides.goToSlide(videoSlideNumber,false);
		}

		var video = $("#"+videoId)[0];

		switch(videoType){
			case "HTML5":
				notifyEventFlag = false;
				video.currentTime = currentTime;
				video.play();
				break;
			default:
				break;
		}
	}

	/**
	 * Function to pause a specific video
	 */
	var pauseVideo = function(videoType,currentTime,videoSlideNumber,videoId){
		var video = $("#"+videoId)[0];

		switch(videoType){
			case "HTML5":
				notifyEventFlag = false;
				video.currentTime = currentTime;
				video.pause();
				break;
			default:
				break;
		}
	}


	/**
	 * Function to seek a specific video
	 */
	var seekVideo = function(videoType,currentTime,videoSlideNumber,videoId){
		var video = $("#"+videoId)[0];

		switch(videoType){
			case "HTML5":
				notifyEventFlag = false;
				video.currentTime = currentTime;
				break;
			default:
				break;
		}
	}

	return {
		setVideoEvents 		: setVideoEvents,
		playVideos 			: playVideos,
		stopVideos 			: stopVideos,
		startVideo 			: startVideo,
		pauseVideo 			: pauseVideo,
		seekVideo			: seekVideo
	};

})(VISH,jQuery);