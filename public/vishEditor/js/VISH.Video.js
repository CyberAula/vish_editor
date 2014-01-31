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


	/*
	 * Used for video synchronization (deprecated). Only used by Messenger.Helper
	 */
	var playVideo = function(videoId,currentTime,triggeredByUser){
		switch(getTypeVideoWithId(videoId)){									 
			case V.Constant.Video.HTML5:
				V.Video.HTML5.playVideo(videoId,currentTime,triggeredByUser);
				break;
			case V.Constant.Video.Youtube:
				V.Video.Youtube.playVideo(videoId,currentTime,triggeredByUser);
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




	/* 
	 * Video Wrapper. Same API for HTML5 and YouTube videos.
	 */


	//Video classification

	var getTypeVideoWithId = function(videoId){
		return getTypeVideo(document.getElementById(videoId));
	};

	var getTypeVideo = function(video){
		var tagName = $(video)[0].tagName;

		if(!video){
			return V.Constant.UNKNOWN;
		} else if(tagName==="VIDEO"){
			return V.Constant.Video.HTML5;
		} else if((tagName==="OBJECT")||(tagName==="IFRAME")){ 
			//Iframe for HTML5 API, Object for deprecated Flash API
			return V.Constant.Video.Youtube;
		}
		return V.Constant.UNKNOWN;
	};


	//Actions
	var play = function(video){
		switch(getTypeVideo(video)){
			case V.Constant.Video.HTML5:
				$(video)[0].play();
				break;
			case V.Constant.Video.Youtube:
				break;
			default:
				break;
		}
	};

	var pause = function(video){
		switch(getTypeVideo(video)){
			case V.Constant.Video.HTML5:
				$(video)[0].pause();
				break;
			case V.Constant.Video.Youtube:
				break;
			default:
				break;
		}
	};

	var seekTo = function(video,seekTime){
		switch(getTypeVideo(video)){
			case V.Constant.Video.HTML5:
				$(video)[0].currentTime = seekTime;
				break;
			case V.Constant.Video.Youtube:
				break;
			default:
				break;
		}		
	};

	//Events
	var onVideoReady = function(video,successCallback,failCallback){
		if(typeof successCallback != "function"){
			return;
		}

		switch(getTypeVideo(video)){
			case V.Constant.Video.HTML5:
				$(video).on("loadeddata", function(event){
					var video = event.target;
					//Check state (based on http://www.w3schools.com/tags/av_prop_readystate.asp)
					if((video.readyState == 4)||(video.readyState == 3)){
						successCallback(video);
					} else {
						if(typeof failCallback == "function"){
							// V.Debugging.log("Video not loaded appropriately");
							failCallback(video);
						}
					}
				});
				break;
			case V.Constant.Video.Youtube:
				break;
			default:
				break;
		}
	};

	var onTimeUpdate = function(video,timeUpdateCallback){
		if(typeof timeUpdateCallback != "function"){
			return;
		}

		switch(getTypeVideo(video)){
			case V.Constant.Video.HTML5:
				$(video).on("timeupdate", function(){
					timeUpdateCallback(video);
				});
				break;
			case V.Constant.Video.Youtube:
				break;
			default:
				break;
		}
	};


	//Getters

	var getStatus = function(video){
		var vStatus = {playing: false, paused: false};
		switch(getTypeVideo(video)){
			case V.Constant.Video.HTML5:
				vStatus.playing = (video.paused == false);
				vStatus.paused = !vStatus.playing;
				break;
			case V.Constant.Video.Youtube:
				break;
			default:
				break;
		}
		return vStatus;
	};

	var getDuration = function(video){
		switch(getTypeVideo(video)){
			case V.Constant.Video.HTML5:
				return $(video)[0].duration;
				break;
			case V.Constant.Video.Youtube:
				return youtubePlayers[video.id].getDuration();
				break;
			default:
				break;
		}
	};

	var getCurrentTime = function(video){	  
		switch(getTypeVideo(video)){
			case V.Constant.Video.HTML5:
				return video.currentTime;
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
		playVideo 			: playVideo,
		pauseVideo 			: pauseVideo,
		seekVideo			: seekVideo,
		getTypeVideoWithId  : getTypeVideoWithId,
		getTypeVideo        : getTypeVideo,
		play 				: play,
		pause 				: pause,
		seekTo				: seekTo,
		onVideoReady		: onVideoReady,
		onTimeUpdate		: onTimeUpdate,
		getDuration 		: getDuration,
		getCurrentTime 		: getCurrentTime,
		getStatus			: getStatus
	};

})(VISH,jQuery);