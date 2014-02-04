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
				var videoId = $(video).attr("id");
				var ytplayer = V.Video.Youtube.getYouTubePlayer(videoId);
				ytplayer.playVideo();

				//Restart timeupdate event
				if((typeof youtubePlayerTimeUpdate[videoId] != "undefined")&&(typeof youtubePlayerTimeUpdate[videoId].timer == "undefined")){
					youtubePlayerTimeUpdate[videoId].timer = _createYouTubeTimer(video,ytplayer,youtubePlayerTimeUpdate[videoId].timeUpdateCallback);
				};

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
				var videoId = $(video).attr("id");
				var ytplayer = V.Video.Youtube.getYouTubePlayer(videoId);
				ytplayer.pauseVideo();

				//Stop timeupdate event
				if((typeof youtubePlayerTimeUpdate[videoId] != "undefined")&&(typeof youtubePlayerTimeUpdate[videoId].timer != "undefined")){
					clearTimeout(youtubePlayerTimeUpdate[videoId].timer);
					youtubePlayerTimeUpdate[videoId].timer = undefined;
				};

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
				var videoId = $(video).attr("id");
				var ytplayer = V.Video.Youtube.getYouTubePlayer(videoId);
				var ytStatus = ytplayer.getPlayerState();
				var videoPaused = (ytStatus==2);
				// var videoUnstarted = (ytStatus==-1);
				// if(videoUnstarted){
				// 	ytplayer.pauseVideo();
				// }

				ytplayer.seekTo(seekTime);

				//Restart timeupdate event
				if((typeof youtubePlayerTimeUpdate[videoId] != "undefined")&&(typeof youtubePlayerTimeUpdate[videoId].timer == "undefined")){
					if(videoPaused===true){
						//Then, the video will remain paused
						youtubePlayerTimeUpdate[videoId].timeUpdateCallback(video,seekTime);
					} else {
						//The video will start playing
						youtubePlayerTimeUpdate[videoId].timer = _createYouTubeTimer(video,ytplayer,youtubePlayerTimeUpdate[videoId].timeUpdateCallback);
					} 	
				};		

				break;
			default:
				break;
		}		
	};

	var setVolume = function(video,volume){
		//Volume is a number between 0 and 100
		switch(getTypeVideo(video)){
			case V.Constant.Video.HTML5:
				//Volume should be a number between 0.0 and 1.0
				$(video)[0].volume = (volume/100);
				break;
			case V.Constant.Video.Youtube:
				//Volume should be a number between 0 and 100
				V.Video.Youtube.getYouTubePlayer($(video).attr("id")).setVolume(volume);
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
				// onVideoReady callback must be specified when loading the YouTube video.
				// After load the YouTube video, its possible to add events on fly.
				break;
			default:
				break;
		}
	};

	var youtubePlayerTimeUpdate = {};

	var onTimeUpdate = function(video,timeUpdateCallback){
		if(typeof timeUpdateCallback != "function"){
			return;
		}

		switch(getTypeVideo(video)){
			case V.Constant.Video.HTML5:
				$(video).on("timeupdate", function(){
					var cTime = video.currentTime;
					timeUpdateCallback(video,cTime);
				});
				break;
			case V.Constant.Video.Youtube:
				var videoId = $(video).attr("id");
				var ytplayer = V.Video.Youtube.getYouTubePlayer(videoId);
				if(typeof youtubePlayerTimeUpdate[videoId] == "undefined"){
					youtubePlayerTimeUpdate[videoId] = {};
					youtubePlayerTimeUpdate[videoId].timeUpdateCallback = timeUpdateCallback;
					if(_getVEStatusFromYouTubeStatus(ytplayer.getPlayerState()).playing === true){
						//Start timer
						youtubePlayerTimeUpdate[videoId].timer = _createYouTubeTimer(video,ytplayer,timeUpdateCallback);
					}
				};
				break;
			default:
				break;
		}
	};

	var _createYouTubeTimer = function(video,ytplayer,timeUpdateCallback){
		return setInterval(function(){
			var cTime = ytplayer.getCurrentTime();
			timeUpdateCallback(video,cTime);
		},200);
	};

	var onStatusChange = function(video,statusCallback){
		if(typeof statusCallback != "function"){
			return;
		}

		switch(getTypeVideo(video)){
			case V.Constant.Video.HTML5:
				video.addEventListener('play', function(){
					statusCallback(video,{playing: true, paused: false});
				}, false);
				video.addEventListener('pause', function(){
					statusCallback(video,{playing: false, paused: true});
				}, false);
				break;
			case V.Constant.Video.Youtube:
				var videoId = $(video).attr("id");
				var ytplayer = V.Video.Youtube.getYouTubePlayer(videoId);
				ytplayer.addEventListener("onStateChange", function(event){
					var vStatus = _getVEStatusFromYouTubeStatus(event.data);
					statusCallback(video,vStatus);
				});
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
				var ytplayer =  V.Video.Youtube.getYouTubePlayer($(video).attr("id"));
				//Returns the state of the player. Possible values are unstarted (-1), ended (0), playing (1), paused (2), buffering (3), video cued (5).
				var ytStatus = ytplayer.getPlayerState();
				vStatus = _getVEStatusFromYouTubeStatus(ytStatus);
				break;
			default:
				break;
		}
		return vStatus;
	};

	var _getVEStatusFromYouTubeStatus = function(ytStatus){
		var vStatus = {playing: false, paused: false};
		vStatus.playing = (ytStatus===1);
		vStatus.paused = !vStatus.playing;
		return vStatus;
	}

	var getDuration = function(video){
		switch(getTypeVideo(video)){
			case V.Constant.Video.HTML5:
				return $(video)[0].duration;
				break;
			case V.Constant.Video.Youtube:
				return V.Video.Youtube.getYouTubePlayer($(video).attr("id")).getDuration();
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
				return V.Video.Youtube.getYouTubePlayer($(video).attr("id")).getCurrentTime();
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
		setVolume			: setVolume,
		onVideoReady		: onVideoReady,
		onTimeUpdate		: onTimeUpdate,
		onStatusChange		: onStatusChange,
		getDuration 		: getDuration,
		getCurrentTime 		: getCurrentTime,
		getStatus			: getStatus
	};

})(VISH,jQuery);