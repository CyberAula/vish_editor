/*
 * Current version uses the Iframe API based on HTML5
 * Doc: https://developers.google.com/youtube/iframe_api_reference
 */

//Var to store youtube players associated with an iframe
var youtubePlayers = {}; 
//Youtube Constants (also accesible in window['YT'].PlayerState when API is loaded)
var YT = YT || {};
YT.PlayerState = YT.PlayerState || {};
YT.PlayerState.UNSTARTED = -1;
YT.PlayerState.ENDED = 0;
YT.PlayerState.PLAYING = 1;
YT.PlayerState.PAUSED = 2;
YT.PlayerState.BUFFERING = 3;
YT.PlayerState.CUED = 5;

//Callback from Youtube Iframe API
function onYouTubeIframeAPIReady() { }


VISH.VideoPlayer.Youtube = (function(){

	var init = function(){
	}

	var _isYouTubeIframeAPIReady = function(){
		if(window['YT']){
			return true;
		} else {
			return false;
		}
	}

	var loadYoutubeObject = function(article,zone){
		if(VISH.Status.getOnline()===false){
			$(zone).html("<img src='"+VISH.ImagesPath+"advert_new_grey_video2.png'/>");
			return;
		}

		if(!_isYouTubeIframeAPIReady()){
		 	return;
		}

		var youtubeVideoId = getYoutubeIdFromURL($(zone).attr("source"));
		if(youtubeVideoId===null){
			return;
		}
		
		var iframeId = $(zone).attr("ytContainerId");
		$(zone).html("<div id='" + iframeId + "' style='" + $(zone).attr("objectStyle") + "'></div>");

		youtubePlayers[iframeId] = new YT.Player(iframeId, {
          height: '100%',
          width: '100%',
          videoId: youtubeVideoId,
          playerVars: { 'autoplay': 0, 'controls': 0, 'enablejsapi': 1, 'showinfo': 0, wmode: "transparent", 'rel': 0 },
          events: {
             'onReady': onPlayerReady,
             'onStateChange': onPlayerStateChange,
             'onError' : onPlayerError
          }
        });

        $("#"+iframeId).attr("wmode","transparent");

        if(VISH.Status.getDevice().desktop){
        	var loadEvents = false;
        } else {
        	var loadEvents = true;
        }
        VISH.VideoPlayer.CustomPlayer.addCustomPlayerControls(iframeId,loadEvents);
	}


	var onPlayerReady = function(event) {
	// var iframe = event.target.getIframe();
	// var iframeId = iframe.id;
	}

	var onPlayerStateChange = function(event) {
		var newState = event.data;
		var iframe = event.target.getIframe();
		// var player = youtubePlayers[iframe.id];

		switch(newState){
			case -1:
				// VISH.Debugging.log(playerId + ": Not initialized");
				VISH.VideoPlayer.CustomPlayer.loadCustomPlayerControlEvents(iframe);
				break;
			case 0:
				// VISH.Debugging.log(playerId + ": Ended");
				VISH.VideoPlayer.CustomPlayer.onEndVideo(iframe);
				break;
			case 1:
				// VISH.Debugging.log(playerId + ": Reproducing at " + $("#"+playerId)[0].getCurrentTime());
				VISH.VideoPlayer.CustomPlayer.onPlayVideo(iframe);
				break;
			case 2:
				// VISH.Debugging.log(playerId + ": Pause at " + $("#"+playerId)[0].getCurrentTime());
				VISH.VideoPlayer.CustomPlayer.onPauseVideo(iframe);
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


	var onPlayerError = function(event) {
		VISH.Debugging.log("onPlayerError with error type " + event.data);
	}

	var playVideo = function(iframeId,currentTime,triggeredByUser){
		var ytPlayer = youtubePlayers[iframeId];

		//ytPlayer.getPlayerState must be defined to ensure that Youtube player has loaded properly.
		if((ytPlayer)&&(ytPlayer.getPlayerState)){

			var params = new Object();
			params.videoId = iframeId;
			params.currentTime = ytPlayer.getCurrentTime();
			params.slideNumber = VISH.Slides.getCurrentSlideNumber();

			if((triggeredByUser)&&(VISH.Status.isPreventDefaultMode())){
				VISH.Messenger.notifyEventByMessage(VISH.Constant.Event.onPlayVideo,params);
				return;
			}

			VISH.EventsNotifier.notifyEvent(VISH.Constant.Event.onPlayVideo,params,triggeredByUser);

			_seekVideo(ytPlayer,iframeId,currentTime,false);
			if(ytPlayer.getPlayerState()!==YT.PlayerState.PLAYING){
				ytPlayer.playVideo();
			}
		}
	}

	/**
	 * Function to pause a specific video
	 */
	var pauseVideo = function(iframeId,currentTime,triggeredByUser){
		var ytPlayer = youtubePlayers[iframeId];

		if((ytPlayer)&&(ytPlayer.getPlayerState)){

			var params = new Object();
			params.videoId = iframeId;
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
			_seekVideo(ytPlayer,iframeId,currentTime,false);
		}
	}

	/**
	 * Function to pause a specific video
	 */
	var seekVideo = function(iframeId,seekTime,triggeredByUser){
		var ytPlayer = youtubePlayers[iframeId];
		if((ytPlayer)&&(ytPlayer.getPlayerState)){
			_seekVideo(ytPlayer,iframeId,seekTime,triggeredByUser);
		}
	}

	var _seekVideo = function(ytPlayer,iframeId,seekTime,triggeredByUser){
		var changeCurrentTime = (typeof seekTime === 'number')&&(ytPlayer.getCurrentTime()!==seekTime);
		if(changeCurrentTime){
			var params = new Object();
			params.videoId = iframeId;
			params.currentTime = seekTime;
			params.slideNumber = VISH.Slides.getCurrentSlideNumber();

			if((triggeredByUser)&&(VISH.Status.isPreventDefaultMode())){
				VISH.Messenger.notifyEventByMessage(VISH.Constant.Event.onSeekVideo,params);
				return;
			}

			VISH.EventsNotifier.notifyEvent(VISH.Constant.Event.onSeekVideo,params,triggeredByUser);
			
			ytPlayer.seekTo(seekTime);
		}
	}


	/////////
	//Youtube Utils both from Viewer and Editor
	/////////

	/*
	 * Returns the youtube video id contained in the url
	 */
	var getYoutubeIdFromURL = function(url){
		var id = null;
		if(!url){
			return id;
		}

		var youtube_video_pattern_1 =/https?:\/\/?youtu.be\/([aA-zZ0-9-]+)/g
		var youtube_video_pattern_2 =/(https?:\/\/)?(www.youtube.com\/watch\?v=|embed\/)([aA-zZ0-9-]+)[&=.]*/g
		var youtube_video_pattern_3 =/(https?:\/\/)?(www.youtube.com\/v\/)([aA-zZ0-9-]+)/g
		var youtube_video_pattern_4 =/(https?:\/\/)?(www.youtube.com\/embed\/)([aA-zZ0-9-]+)/g

		if(url.match(youtube_video_pattern_1)!=null){
			var result = youtube_video_pattern_1.exec(url)
			if((result)&&(result[1])){
				id = result[1];
			}
			return id;
		}

		if(url.match(youtube_video_pattern_2)!=null){
			var result = url.split("&")[0];
			var result = youtube_video_pattern_2.exec(url)
			if((result)&&(result[3])){
				id = result[3];
			}
			return id;
		}

		if(url.match(youtube_video_pattern_3)!=null){
			var result = url.split("&")[0];
			var result = youtube_video_pattern_3.exec(url)
			if((result)&&(result[3])){
				id = result[3];
			}
			return id;
		}

		if(url.match(youtube_video_pattern_4)!=null){
			var result = url.split("&")[0];
			var result = youtube_video_pattern_4.exec(url)
			if((result)&&(result[3])){
				id = result[3];
			}
			return id;
		}

		return id;
	}

	return {
		init 				: init,
		loadYoutubeObject	: loadYoutubeObject,
		onPlayerReady 		: onPlayerReady,
		onPlayerStateChange : onPlayerStateChange,
		playVideo 			: playVideo,
		pauseVideo 			: pauseVideo,
		seekVideo 			: seekVideo,
		getYoutubeIdFromURL	: getYoutubeIdFromURL
	};

})(VISH,jQuery);



