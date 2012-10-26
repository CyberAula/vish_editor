VISH.VideoPlayer = (function(){
	
	var init = function(){
		VISH.VideoPlayer.CustomPlayer.init();
		VISH.VideoPlayer.HTML5.init();
		VISH.VideoPlayer.Youtube.init();
	}

	var getTypeVideoWithId = function(videoId){
		return getTypeVideo(document.getElementById(videoId));
	}

	var getTypeVideo = function(video){
		if(!video){
			return VISH.Constant.UNKNOWN;
		} else if(video.tagName==="VIDEO"){
			return VISH.Constant.Video.HTML5;
		} else if(video.tagName==="OBJECT"){
			return VISH.Constant.Video.Youtube;
		}
		return VISH.Constant.UNKNOWN;
	}

	var playVideo = function(videoId,currentTime,triggeredByUser){
		switch(getTypeVideoWithId(videoId)){
			case VISH.Constant.Video.HTML5:
				VISH.VideoPlayer.HTML5.playVideo(videoId,currentTime);
				break;
			case VISH.Constant.Video.Youtube:
				VISH.VideoPlayer.Youtube.playVideo(videoId,currentTime);
				break;
			default:
				break;
		}
	}

			// if((videoSlideNumber)&&(VISH.Slides.getCurrentSlideNumber()!=videoSlideNumber)){
		// 	VISH.Slides.goToSlide(videoSlideNumber,false);
		// }

	var pauseVideo = function(videoId,currentTime,triggeredByUser){
		switch(getTypeVideoWithId(videoId)){
			case VISH.Constant.Video.HTML5:
				VISH.VideoPlayer.HTML5.pauseVideo(videoId,currentTime);
				break;
			case VISH.Constant.Video.Youtube:
				VISH.VideoPlayer.Youtube.pauseVideo(videoId,currentTime);
				break;
			default:
				break;
		}
	}

	var seekVideo = function(videoId,currentTime,triggeredByUser){
		switch(getTypeVideoWithId(videoId)){
			case VISH.Constant.Video.HTML5:
				VISH.VideoPlayer.HTML5.seekVideo(videoId,currentTime);
				break;
			case VISH.Constant.Video.Youtube:
				VISH.VideoPlayer.Youtube.seekVideo(videoId,currentTime);
				break;
			default:
				break;
		}
	}



	//Wrapper
	//Get parameters regardless of video type

	var getDuration = function(video){
		switch(getTypeVideo(video)){
			case VISH.Constant.Video.HTML5:
				return video.getDuration();
				break;
			case VISH.Constant.Video.Youtube:
				return video.getDuration();
				break;
			default:
				break;
		}
	}


	var getCurrentTime = function(video){
		switch(getTypeVideo(video)){
			case VISH.Constant.Video.HTML5:
				return video.getCurrentTime();
				break;
			case VISH.Constant.Video.Youtube:
				return video.getCurrentTime();
				break;
			default:
				break;
		}
	}

	return {
		init				: init,
		getTypeVideoWithId  : getTypeVideoWithId,
		getTypeVideo        : getTypeVideo,
		playVideo 			: playVideo,
		pauseVideo 			: pauseVideo,
		seekVideo			: seekVideo,
		getDuration 		: getDuration,
		getCurrentTime 		: getCurrentTime
	};

})(VISH,jQuery);