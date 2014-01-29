VISH.VideoPlayer = (function(V,$,undefined){
	
	var init = function(){
		V.VideoPlayer.CustomPlayer.init();
		V.VideoPlayer.HTML5.init();
		V.VideoPlayer.Youtube.init();
	};

	var getTypeVideoWithId = function(videoId){ // to know the type of video
		return getTypeVideo(document.getElementById(videoId));
	};

	var getTypeVideo = function(video){
		if(!video){
			return V.Constant.UNKNOWN;
		} else if(video.tagName==="VIDEO"){
			return V.Constant.Video.HTML5;
		} else if((video.tagName==="OBJECT")||(video.tagName==="IFRAME")){ 
			//Iframe for HTML5 API, Object for deprecated Flash API
			return V.Constant.Video.Youtube;
		}
		return V.Constant.UNKNOWN;
	};

	var playVideo = function(videoId,currentTime,triggeredByUser){
		switch(getTypeVideoWithId(videoId)){ //play the video in a different way depending 
											 // on the type.
			case V.Constant.Video.HTML5:
				V.VideoPlayer.HTML5.playVideo(videoId,currentTime,triggeredByUser);
				break;
			case V.Constant.Video.Youtube:
				V.VideoPlayer.Youtube.playVideo(videoId,currentTime,triggeredByUser); //how 2 play a Youtube Video
				break;
			default:
				break;
		}
	};

	var pauseVideo = function(videoId,currentTime,triggeredByUser){
		switch(getTypeVideoWithId(videoId)){ // Same idea but pausing
			case V.Constant.Video.HTML5:
				V.VideoPlayer.HTML5.pauseVideo(videoId,currentTime,triggeredByUser);
				break;
			case V.Constant.Video.Youtube:
				V.VideoPlayer.Youtube.pauseVideo(videoId,currentTime,triggeredByUser);
				break;
			default:
				break;
		}
	};

	var seekVideo = function(videoId,seekTime,triggeredByUser){
		switch(getTypeVideoWithId(videoId)){ //same idea but seeking
			case V.Constant.Video.HTML5:
				V.VideoPlayer.HTML5.seekVideo(videoId,seekTime,triggeredByUser);
				break;
			case V.Constant.Video.Youtube:
				V.VideoPlayer.Youtube.seekVideo(videoId,seekTime,triggeredByUser);
				break;
			default:
				break;
		}
	};



	//Wrapper
	//Get parameters regardless of video type

	var getDuration = function(video){
		switch(getTypeVideo(video)){ //get duration of the video (returns a number)
			case V.Constant.Video.HTML5:
				return video.getDuration();
				break;
			case V.Constant.Video.Youtube:
				return youtubePlayers[video.id].getDuration();
				break;
			default:
				break;
		}
	};


	var getCurrentTime = function(video){ //getCurrentTime method depending on the type
										  // of video
		switch(getTypeVideo(video)){
			case V.Constant.Video.HTML5:
				return video.getCurrentTime();
				break;
			case V.Constant.Video.Youtube:
				return youtubePlayers[video.id].getCurrentTime();
				break;
			default:
				break;
		}
	};

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