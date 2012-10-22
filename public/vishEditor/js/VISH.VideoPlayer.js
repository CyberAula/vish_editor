VISH.VideoPlayer = (function(){
		
	/**
	 * Function to start a specific video
	 */
	var startVideo = function(videoType,videoId,currentTime,videoSlideNumber){
		if((videoSlideNumber)&&(VISH.Slides.getCurrentSlideNumber()!=videoSlideNumber)){
			VISH.Slides.goToSlide(videoSlideNumber,false);
		}
		switch(videoType){
			case "HTML5":
				VISH.VideoPlayer.HTML5.startVideo(videoId,currentTime);
				break;
			case "Youtube":
				VISH.VideoPlayer.Youtube.startVideo(videoId,currentTime);
				break;
			default:
				break;
		}
	}

	/**
	 * Function to pause a specific video
	 */
	var pauseVideo = function(videoType,videoId,currentTime,videoSlideNumber){
		switch(videoType){
			case "HTML5":
				VISH.VideoPlayer.HTML5.pauseVideo(videoId,currentTime);
				break;
			case "Youtube":
				VISH.VideoPlayer.Youtube.pauseVideo(videoId,currentTime);
				break;
			default:
				break;
		}
	}


	/**
	 * Function to seek a specific video
	 */
	var seekVideo = function(videoType,videoId,currentTime,videoSlideNumber){
		switch(videoType){
			case "HTML5":
				VISH.VideoPlayer.HTML5.seekVideo(videoId,currentTime);
				break;
			default:
				break;
		}
	}

	return {
		startVideo 			: startVideo,
		pauseVideo 			: pauseVideo,
		seekVideo			: seekVideo
	};

})(VISH,jQuery);