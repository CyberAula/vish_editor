VISH.VideoPlayer.Youtube = (function(){

	var init = function(){

	}

	var loadYoutubeObject = function(element,value){
		if(VISH.Status.getOnline()=== false){
			$(value).html("<img src='"+VISH.ImagesPath+"advert_new_grey_video2.png'/>");
			return;
		}
		var source = $(value).attr("source");
		var ytVideoId = $(value).attr("ytVideoId");
		$(value).html("<div id='" + ytVideoId + "' style='" + $(value).attr("objectStyle") + "'></div>");
		var newYtVideoId = VISH.Utils.getId();
		var params = { allowScriptAccess: "always" };
    	var atts = { id: newYtVideoId , wmode: "transparent" };
    	source = source.split("?")[0]; //Remove params
    	source = source + "?enablejsapi=1&controls=0&showinfo=0&rel=0&modestbranding=1&wmodetransparent=true&playerapiid="+newYtVideoId //Add yt necessary params
    	//swfobject library doc in http://code.google.com/p/swfobject/wiki/api
    	swfobject.embedSWF(source,ytVideoId, "100%", "100%", "8", null, null, params, atts); 
		$("#"+newYtVideoId).attr("style",$(value).attr("objectStyle"));

		VISH.VideoPlayer.CustomPlayer.addCustomPlayerControls(newYtVideoId,false);
	}


	var onytplayerStateChange = function(playerId,newState) {
		var player = document.getElementById(playerId);
		switch(newState){
			case -1:
				// VISH.Debugging.log(playerId + ": Not initialized");
				VISH.VideoPlayer.CustomPlayer.loadCustomPlayerControlEvents(player);
				break;
			case 0:
				// VISH.Debugging.log(playerId + ": Ended");
				VISH.VideoPlayer.CustomPlayer.onEndVideo(player);
				break;
			case 1:
				// VISH.Debugging.log(playerId + ": Reproducing at " + $("#"+playerId)[0].getCurrentTime());
				VISH.VideoPlayer.CustomPlayer.onPlayVideo(player);
				break;
			case 2:
				// VISH.Debugging.log(playerId + ": Pause at " + $("#"+playerId)[0].getCurrentTime());
				VISH.VideoPlayer.CustomPlayer.onPauseVideo(player);
				break;
			case 3:
				// VISH.Debugging.log(playerId + ": Buffer Store");
				break;
			case 4:
				break;
			case 5:
				// VISH.Debugging.log(playerId + ": Video Tail Store");
				break;
			default:
				// VISH.Debugging.log(playerId + ": Unknown state: " + newState);
				break;
		}
	}

	var onytplayerError = function(playerId,error) {
		// VISH.Debugging.log(playerId + " error: " + error);
	}

	var playVideo = function(videoId,currentTime,triggeredByUser){
		var ytPlayer = document.getElementById(videoId);

		//ytPlayer.getPlayerState must be defined to ensure that Youtube player has loaded properly.
		if((ytPlayer)&&(ytPlayer.getPlayerState)){

			var params = new Object();
			params.videoId = videoId;
			params.currentTime = ytPlayer.getCurrentTime();
			params.slideNumber = VISH.Slides.getCurrentSlideNumber();

			if((triggeredByUser)&&(VISH.Status.isPreventDefaultMode())){
				VISH.Messenger.notifyEventByMessage(VISH.Constant.Event.onPlayVideo,params);
				return;
			}

			VISH.EventsNotifier.notifyEvent(VISH.Constant.Event.onPlayVideo,params,triggeredByUser);

			_seekVideo(ytPlayer,currentTime,false);
			if(ytPlayer.getPlayerState()!==YT.PlayerState.PLAYING){
				ytPlayer.playVideo();
			}
		}
	}

	/**
	 * Function to pause a specific video
	 */
	var pauseVideo = function(videoId,currentTime,triggeredByUser){
		var ytPlayer = document.getElementById(videoId);
		if((ytPlayer)&&(ytPlayer.getPlayerState)){

			var params = new Object();
			params.videoId = videoId;
			params.currentTime = ytPlayer.getCurrentTime();
			params.slideNumber = VISH.Slides.getCurrentSlideNumber();

			if((triggeredByUser)&&(VISH.Status.isPreventDefaultMode())){
				VISH.Messenger.notifyEventByMessage(VISH.Constant.Event.onPauseVideo,params);
				return;
			}

			VISH.EventsNotifier.notifyEvent(VISH.Constant.Event.onPauseVideo,params,triggeredByUser);

			if(ytPlayer.getPlayerState()===YT.PlayerState.PLAYING){
				ytPlayer.pauseVideo();
			}
			_seekVideo(ytPlayer,currentTime,false);
		}
	}

	/**
	 * Function to pause a specific video
	 */
	var seekVideo = function(videoId,seekTime,triggeredByUser){
		var ytPlayer = document.getElementById(videoId);
		if((ytPlayer)&&(ytPlayer.getPlayerState)){
			_seekVideo(ytPlayer,seekTime,triggeredByUser);
		}
	}

	var _seekVideo = function(video,seekTime,triggeredByUser){
		var changeCurrentTime = (typeof seekTime === 'number')&&(video.getCurrentTime()!==seekTime);
		if(changeCurrentTime){
			var params = new Object();
			params.videoId = video.id;
			params.currentTime = seekTime;
			params.slideNumber = VISH.Slides.getCurrentSlideNumber();

			if((triggeredByUser)&&(VISH.Status.isPreventDefaultMode())){
				VISH.Messenger.notifyEventByMessage(VISH.Constant.Event.onSeekVideo,params);
				return;
			}

			VISH.EventsNotifier.notifyEvent(VISH.Constant.Event.onSeekVideo,params,triggeredByUser);
			
			video.seekTo(seekTime);
		}
	}

	return {
		init 				: init,
		loadYoutubeObject	: loadYoutubeObject,
		onytplayerStateChange	: onytplayerStateChange,
		playVideo 			: playVideo,
		pauseVideo 			: pauseVideo,
		seekVideo 			: seekVideo
	};

})(VISH,jQuery);


/////
//Callback from swfobject library
/////
var youtubePlayers = {};
var YT = YT || {};
YT.PlayerState = YT.PlayerState || {};
YT.PlayerState.UNSTARTED = -1;
YT.PlayerState.ENDED = 0;
YT.PlayerState.PLAYING = 1;
YT.PlayerState.PAUSED = 2;
YT.PlayerState.BUFFERING = 3;
YT.PlayerState.CUED = 5;

function onYouTubePlayerReady (playerId) {
	var ytPlayer = document.getElementById(playerId);
	var idPlayerParams = 'yt_' + playerId;
	youtubePlayers[idPlayerParams] = {
		playerId: playerId,
		onStateChanged: function(state) {
			VISH.VideoPlayer.Youtube.onytplayerStateChange(playerId,state);
		},
		onError: function(err) {
			VISH.VideoPlayer.Youtube.onytplayerError(playerId,err);
		}
	};
	ytPlayer.addEventListener ('onStateChange', 'youtubePlayers.' + idPlayerParams + '.onStateChanged');
	ytPlayer.addEventListener ('onError', 'youtubePlayers.' + idPlayerParams + '.onError');
}