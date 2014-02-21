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
			case V.Constant.MEDIA.HTML5_VIDEO:
				V.Video.HTML5.playVideo(videoId,currentTime,triggeredByUser);
				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
				V.Video.Youtube.playVideo(videoId,currentTime,triggeredByUser);
				break;
			default:
				break;
		}
	};

	var pauseVideo = function(videoId,currentTime,triggeredByUser){
		switch(getTypeVideoWithId(videoId)){
			case V.Constant.MEDIA.HTML5_VIDEO:
				V.Video.HTML5.pauseVideo(videoId,currentTime,triggeredByUser);
				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
				V.Video.Youtube.pauseVideo(videoId,currentTime,triggeredByUser);
				break;
			default:
				break;
		}
	};

	var seekVideo = function(videoId,seekTime,triggeredByUser){
		switch(getTypeVideoWithId(videoId)){
			case V.Constant.MEDIA.HTML5_VIDEO:
				V.Video.HTML5.seekVideo(videoId,seekTime,triggeredByUser);
				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
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
		if(typeof $(video)[0] == "undefined"){
			return V.Constant.UNKNOWN;
		}

		var tagName = $(video)[0].tagName;
		if(tagName==="VIDEO"){
			return V.Constant.MEDIA.HTML5_VIDEO;
		} else if((tagName==="OBJECT")||(tagName==="IFRAME")){ 
			//Iframe for HTML5 API, Object for deprecated Flash API
			return V.Constant.MEDIA.YOUTUBE_VIDEO;
		}
		return V.Constant.UNKNOWN;
	};


	//Actions
	var play = function(video){
		switch(getTypeVideo(video)){
			case V.Constant.MEDIA.HTML5_VIDEO:
				$(video)[0].play();
				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:		
				var videoId = $(video).attr("id");
				var ytplayer = V.Video.Youtube.getYouTubePlayer(videoId);

				if(!V.Status.getDevice().desktop){
					var ytStatus = ytplayer.getPlayerState();
					if(ytStatus===-1 || ytStatus===5){
						//Prevent YouTube Videos to crash on mobile devices
						var options = {};
						options.width = '80%';
						options.text = V.I18n.getTrans("i.YouTubePlayAlert");
						var button1 = {};
						button1.text = V.I18n.getTrans("i.Ok");
						button1.callback = function(){
							$.fancybox.close();
						}
						options.buttons = [button1];
						V.Utils.showDialog(options);
						return;
					}
				};

				ytplayer.playVideo();
				break;
			default:
				break;
		}
	};

	var pause = function(video){
		switch(getTypeVideo(video)){
			case V.Constant.MEDIA.HTML5_VIDEO:
				$(video)[0].pause();
				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
				var videoId = $(video).attr("id");
				var ytplayer = V.Video.Youtube.getYouTubePlayer(videoId);
				ytplayer.pauseVideo();
				break;
			default:
				break;
		}
	};

	var seekTo = function(video,seekTime){
		switch(getTypeVideo(video)){
			case V.Constant.MEDIA.HTML5_VIDEO:
				$(video)[0].currentTime = seekTime;
				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
				var videoId = $(video).attr("id");
				var ytplayer = V.Video.Youtube.getYouTubePlayer(videoId);
				var ytStatus = ytplayer.getPlayerState();
				var videoUnstarted = (ytStatus==-1);
				// var videoPlaying = (ytStatus==1);
				// var videoPaused = (ytStatus==2);
				
				ytplayer.seekTo(seekTime);

				if(videoUnstarted){
					ytplayer.pauseVideo();
				}

				//Notify time update
				if((typeof youtubePlayerTimeUpdate[videoId] != "undefined")&&(typeof youtubePlayerTimeUpdate[videoId].timer == "undefined")){
					youtubePlayerTimeUpdate[videoId].timeUpdateCallback(video,seekTime);
				};

				break;
			default:
				break;
		}		
	};

	var setVolume = function(video,volume){
		//Volume is a number between 0 and 100
		switch(getTypeVideo(video)){
			case V.Constant.MEDIA.HTML5_VIDEO:
				//Volume should be a number between 0.0 and 1.0
				$(video)[0].volume = (volume/100);
				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
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
			case V.Constant.MEDIA.HTML5_VIDEO:
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
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
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
			case V.Constant.MEDIA.HTML5_VIDEO:
				$(video).on("timeupdate", function(){
					var cTime = video.currentTime;
					timeUpdateCallback(video,cTime);
				});
				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
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
			case V.Constant.MEDIA.HTML5_VIDEO:
				video.addEventListener('play', function(){
					statusCallback(video,V.Constant.EVideo.Status.Playing);
				}, false);
				video.addEventListener('pause', function(){
					statusCallback(video,V.Constant.EVideo.Status.Paused);
				}, false);

				// video.addEventListener('ended', function(){
				// 	statusCallback(video,V.Constant.EVideo.Status.Ended);
				// }, false);

				//ended listener fallback
				$(video).on("timeupdate", function(){
					var cTime = $(video)[0].currentTime;
					var duration = $(video)[0].duration;
					if(cTime==duration){
						$(video).trigger("pause");
						statusCallback(video,V.Constant.EVideo.Status.Ended);
					}
				});

				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
				var videoId = $(video).attr("id");
				var ytplayer = V.Video.Youtube.getYouTubePlayer(videoId);
				ytplayer.addEventListener("onStateChange", function(event){
					var newState = event.data;
					// var iframe = event.target.getIframe();
					// $(video).attr("id") == iframe.id

					switch(newState){
						case -1:
							//Unstarted
							break;
						case 0:
							//Ended
							break;
						case 1:
							//Playing
							//Restart timeupdate event
							if((typeof youtubePlayerTimeUpdate[videoId] != "undefined")&&(typeof youtubePlayerTimeUpdate[videoId].timer == "undefined")){
								youtubePlayerTimeUpdate[videoId].timer = _createYouTubeTimer(video,ytplayer,youtubePlayerTimeUpdate[videoId].timeUpdateCallback);
							};
							break;
						case 2:
							//Paused
							//Stop timeupdate event
							if((typeof youtubePlayerTimeUpdate[videoId] != "undefined")&&(typeof youtubePlayerTimeUpdate[videoId].timer != "undefined")){
								clearTimeout(youtubePlayerTimeUpdate[videoId].timer);
								youtubePlayerTimeUpdate[videoId].timer = undefined;
							};
							break;
						case 3:
							//Buffering
							break;
						case 4:
							break;
						case 5:
							//Video cued
							break;
						default:
							break;
					}

					var vStatus = _getVEStatusFromYouTubeStatus(newState);
					statusCallback(video,vStatus);
				});
				break;
			default:
				break;
		}
	};


	//Getters

	var getStatus = function(video){
		var vStatus;
		switch(getTypeVideo(video)){
			case V.Constant.MEDIA.HTML5_VIDEO:
				if(video.paused == false){
					vStatus = V.Constant.EVideo.Status.Playing;
				} else {
					vStatus = V.Constant.EVideo.Status.Paused;
				}
				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
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
		switch(ytStatus){
			case -1:
				//Unstarted
				return V.Constant.EVideo.Status.Paused;
			case 0:
				//Ended
				return V.Constant.EVideo.Status.Ended;
			case 1:
				//Playing
				return V.Constant.EVideo.Status.Playing;
			case 2:
				//Paused
				return V.Constant.EVideo.Status.Paused;
			case 3:
				//Buffering
				return V.Constant.EVideo.Status.Paused;
			case 4:
				return V.Constant.EVideo.Status.Paused;
			case 5:
				//Video cued
				return V.Constant.EVideo.Status.Paused;
			default:
				return V.Constant.EVideo.Status.Paused;
		}
	};

	var getDuration = function(video){
		switch(getTypeVideo(video)){
			case V.Constant.MEDIA.HTML5_VIDEO:
				return $(video)[0].duration;
				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
				return V.Video.Youtube.getYouTubePlayer($(video).attr("id")).getDuration();
				break;
			default:
				break;
		}
	};

	var getCurrentTime = function(video){
		switch(getTypeVideo(video)){
			case V.Constant.MEDIA.HTML5_VIDEO:
				return video.currentTime;
				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
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