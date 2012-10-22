VISH.VideoPlayer.Youtube = (function(){
		
	//Slave Mode
	var isSlaveMode;

	//Flag to prevent notify startVideo events
	//Prevent sync bucles
	var playTriggeredByUser = true;
	var pauseTriggeredByUser = true;
	
	var onytplayerStateChange = function(playerId,newState) {
		switch(newState){
			case -1:
				// VISH.Debugging.log(playerId + ": Not initialized");
				break;
			case 0:
				// VISH.Debugging.log(playerId + ": Ended");
				break;
			case 1:
				VISH.Debugging.log(playerId + ": Reproducing at " + $("#"+playerId)[0].getCurrentTime());

				if(isSlaveMode){
					console.log("ASDASD");
					var ytPlayer = document.getElementById(playerId);
					console.log(ytPlayer.getPlayerState());
					//STORE VIDEO PLAYER PREV STATUS...
				}

				var params = new Object();
				params.type = "Youtube";
				params.videoId = playerId;
				params.currentTime = $("#"+playerId)[0].getCurrentTime();
				params.slideNumber = VISH.Slides.getCurrentSlideNumber();
				VISH.Events.Notifier.notifyEvent(VISH.Constant.Event.onPlayVideo,params,playTriggeredByUser);

				playTriggeredByUser = true;
				break;
			case 2:
				// VISH.Debugging.log(playerId + ": Pause at " + $("#"+playerId)[0].getCurrentTime());
				
				var params = new Object();
				params.type = "Youtube";
				params.videoId = playerId;
				params.currentTime = $("#"+playerId)[0].getCurrentTime();
				params.slideNumber = VISH.Slides.getCurrentSlideNumber();
				VISH.Events.Notifier.notifyEvent(VISH.Constant.Event.onPauseVideo,params,pauseTriggeredByUser);

				pauseTriggeredByUser = true;
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

	/**
	 * Function to start a specific video
	 */
	var startVideo = function(videoId,currentTime){
		var ytPlayer = document.getElementById(videoId);
		if(!ytPlayer){
			return;
		}

		var changeCurrentTime = (typeof currentTime === 'number')&&(ytPlayer.getCurrentTime()!==currentTime);
		
		switch(ytPlayer.getPlayerState()){
			case YT.PlayerState.PLAYING:
				if(changeCurrentTime){
					playTriggeredByUser = false;
					ytPlayer.seekTo(currentTime);
				}
				break;
			case YT.PlayerState.PAUSED:
				if(changeCurrentTime){
					pauseTriggeredByUser = false;
					ytPlayer.seekTo(currentTime);
				}
				playTriggeredByUser = false;
				ytPlayer.playVideo();
				break;
			case YT.PlayerState.UNSTARTED:
				playTriggeredByUser = false;
				ytPlayer.playVideo();
			default:
				break;
		}
	}

	/**
	 * Function to pause a specific video
	 */
	var pauseVideo = function(videoId,currentTime){
		var ytPlayer = document.getElementById(videoId);
		if(!ytPlayer){
			return;
		}

		var changeCurrentTime = (typeof currentTime === 'number')&&(ytPlayer.getCurrentTime()!==currentTime);
		
		switch(ytPlayer.getPlayerState()){
			case YT.PlayerState.PLAYING:
				if(changeCurrentTime){
					playTriggeredByUser = false;
					ytPlayer.seekTo(currentTime);
				}
				pauseTriggeredByUser = false;
				ytPlayer.pauseVideo();
				break;
			case YT.PlayerState.PAUSED:
				if(changeCurrentTime){
					pauseTriggeredByUser = false;
					ytPlayer.seekTo(currentTime);
				}
				break;
			case YT.PlayerState.UNSTARTED:
				break;
			default:
				break;
		}
	}

	var setSlaveMode = function(slave){
		isSlaveMode = slave;
	}

	return {
		startVideo 			: startVideo,
		pauseVideo 			: pauseVideo,
		onytplayerStateChange	: onytplayerStateChange,
		setSlaveMode		: setSlaveMode
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