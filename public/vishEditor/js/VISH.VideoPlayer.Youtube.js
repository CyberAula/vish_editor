VISH.VideoPlayer.Youtube = (function(){
		
	//Flag to prevent notify startVideo events
	//Prevent sync bucles
	var notifyEventFlag = true;
	
	var onytplayerStateChange = function(playerId,newState) {
		switch(newState){
			case -1:
				// VISH.Debugging.log(playerId + ": Not initialized");
				break;
			case 0:
				// VISH.Debugging.log(playerId + ": Ended");
				break;
			case 1:
				// VISH.Debugging.log(playerId + ": Reproducing at " + $("#"+playerId)[0].getCurrentTime());
				if((VISH.Messenger)&&(notifyEventFlag)){
					VISH.Messenger.sendMessage("playVideo",["Youtube",playerId,$("#"+playerId)[0].getCurrentTime(),VISH.Slides.getCurrentSlideNumber()]);
				}
				notifyEventFlag = true;
				break;
			case 2:
				// VISH.Debugging.log(playerId + ": Pause at " + $("#"+playerId)[0].getCurrentTime());
				if((VISH.Messenger)&&(notifyEventFlag)){
					VISH.Messenger.sendMessage("pauseVideo",["Youtube",playerId,$("#"+playerId)[0].getCurrentTime(),VISH.Slides.getCurrentSlideNumber()]);
				}
				notifyEventFlag = true;
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
		VISH.Debugging.log(playerId + " error: " + error);
	}

	/**
	 * Function to start a specific video
	 */
	var startVideo = function(videoId,currentTime){
		var ytPlayer = document.getElementById(videoId);
		if(ytPlayer.getCurrentTime()!==currentTime){
			notifyEventFlag = false;
			ytPlayer.seekTo(currentTime);
		}
		if(ytPlayer.getPlayerState()==YT.PlayerState.PLAYING){
			return;
		}
		notifyEventFlag = false;
		ytPlayer.playVideo();
	}

	/**
	 * Function to pause a specific video
	 */
	var pauseVideo = function(videoId,currentTime){
		var ytPlayer = document.getElementById(videoId);
		if(ytPlayer.getCurrentTime()!==currentTime){
			notifyEventFlag = false;
			ytPlayer.seekTo(currentTime);
		}
		if(ytPlayer.getPlayerState()==YT.PlayerState.PAUSED){
			return;
		}
		notifyEventFlag = false;
		ytPlayer.pauseVideo();
	}

	return {
		startVideo 			: startVideo,
		pauseVideo 			: pauseVideo,
		onytplayerStateChange	: onytplayerStateChange
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