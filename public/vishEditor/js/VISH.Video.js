VISH.Video = (function(V,$,undefined){
	
	var _enableCustomPlayer;

	var init = function(){
		var options = V.Utils.getOptions();
		if((options)&&(options.videoCustomPlayer===true)){
			_enableCustomPlayer = true;
			V.Video.CustomPlayer.init();
		} else {
			_enableCustomPlayer = false;
		}

		V.Video.HTML5.init(_enableCustomPlayer);
		V.Video.Youtube.init(_enableCustomPlayer);
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
		switch(getTypeVideoWithId(videoId)){											 
			case V.Constant.Video.HTML5:
				V.Video.HTML5.playVideo(videoId,currentTime,triggeredByUser);
				break;
			case V.Constant.Video.Youtube:
				V.Video.Youtube.playVideo(videoId,currentTime,triggeredByUser); //how 2 play a Youtube Video
				break;
			default:
				break;
		}
	};

	var pauseVideo = function(videoId,currentTime,triggeredByUser){
		switch(getTypeVideoWithId(videoId)){
			case V.Constant.Video.HTML5:
				V.Video.HTML5.pauseVideo(videoId,currentTime,triggeredByUser);
				break;
			case V.Constant.Video.Youtube:
				V.Video.Youtube.pauseVideo(videoId,currentTime,triggeredByUser);
				break;
			default:
				break;
		}
	};

	var seekVideo = function(videoId,seekTime,triggeredByUser){
		switch(getTypeVideoWithId(videoId)){
			case V.Constant.Video.HTML5:
				V.Video.HTML5.seekVideo(videoId,seekTime,triggeredByUser);
				break;
			case V.Constant.Video.Youtube:
				V.Video.Youtube.seekVideo(videoId,seekTime,triggeredByUser);
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