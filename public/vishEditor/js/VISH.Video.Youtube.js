/*
 * Current version uses the Iframe API based on HTML5
 * Doc: https://developers.google.com/youtube/iframe_api_reference
 */

//Var to store youtube players associated with an iframe
var youtubePlayers = {}; 
//Youtube Constants (also accesible in window['YT'].PlayerState when API is loaded)
var YT = YT || {};

/* WE DEFINE CONSTANTS*/
YT.PlayerState = YT.PlayerState || {};
YT.PlayerState.UNSTARTED = -1;
YT.PlayerState.ENDED = 0;
YT.PlayerState.PLAYING = 1;
YT.PlayerState.PAUSED = 2;
YT.PlayerState.BUFFERING = 3;
YT.PlayerState.CUED = 5;

//Callback from Youtube Iframe API
function onYouTubeIframeAPIReady() { }


VISH.Video.Youtube = (function(V,$,undefined){

	var _enableCustomPlayer;

	var init = function(enableCustomPlayer){
		_enableCustomPlayer = enableCustomPlayer;
	};

	var _isYouTubeIframeAPIReady = function(){
		if(window['YT']){
			return true;
		} else {
			return false;
		}
	};

	var renderVideoFromJSON = function(videoJSON, options){
		var videoId = (videoJSON['id']) ? videoJSON['id'] : V.Utils.getId();
		var videoSource = videoJSON['body'] || videoJSON['source'];
		var videoClass = "";
		if(options){
			if(options.videoClass){
				videoClass = videoClass + " " + options.videoClass;
			}
		};
		videoClass = "class='" + videoClass + "'";

		var ytContainerId = V.Utils.getId();
		var style = (videoJSON['style'])? videoJSON['style'] : "";
		var zoomInStyle = (videoJSON['zoomInStyle'])? videoJSON['zoomInStyle'] : "";
		var video = "<div id='"+ videoId + "' " + videoClass + " objectStyle='" + style + "' zoomInStyle='" + zoomInStyle + "' source='" + videoSource + "' ytContainerId='" + ytContainerId + "'>" + "</div>";
		return video;
	};

	var loadYoutubeObject = function(container,options){
		if(V.Status.isOnline()===false){
			$(container).html("<img src='"+V.ImagesPath+"adverts/advert_new_grey_video.png'/>");
			return;
		}

		// If Youtube Iframe isn't ready, load nothing
		if(!_isYouTubeIframeAPIReady()){
			return;
		}

		var youtubeVideoId = getYoutubeIdFromURL($(container).attr("source")); 
		if(youtubeVideoId===null){
			return;
		}
		
		var iframeId = $(container).attr("ytContainerId");
		$(container).html("<div id='" + iframeId + "' videotype='"+ V.Constant.MEDIA.YOUTUBE_VIDEO +"' style='" + $(container).attr("objectStyle") + "'></div>");

		var enableCustomPlayer = _enableCustomPlayer;
		var controls = enableCustomPlayer ? 0 : 1;
		var _onReadyCallback = onPlayerReady;

		if(options){
			if(typeof options.enableCustomPlayer == "boolean"){
				enableCustomPlayer = options.enableCustomPlayer;
				controls = enableCustomPlayer ? 0 : 1;
			}
			if(typeof options.controls == "boolean"){
				controls = (options.controls===true) ? 1 : 0;
			}
			if(typeof options.onReadyCallback == "function"){
				_onReadyCallback = options.onReadyCallback;
			}
		}

		youtubePlayers[iframeId] = new YT.Player(iframeId, {
		  height: '100%',
		  width: '100%',
		  videoId: youtubeVideoId,
		  playerVars: { 'autoplay': 0, 'controls': controls, 'enablejsapi': 1, 'showinfo': 0, wmode: "transparent", 'rel': 0 },
		  events: {
			 'onReady': _onReadyCallback,
			 // 'onStateChange': onPlayerStateChange,
			 'onError' : onPlayerError
		  }
		});

		$("#"+iframeId).attr("wmode","transparent");

		//Enable custom player only if its specified by options
		if(_enableCustomPlayer){
			//In current version player control events are loaded in onPlayerReady event
			V.Video.CustomPlayer.addCustomPlayerControls(iframeId,false);
		}

	};

	var onPlayerReady = function(event){
		if(_enableCustomPlayer){
			var iframe = event.target.getIframe();
			// var iframeId = iframe.id;
			// V.Debugging.log("onPlayerReady " + iframe.id);
			V.Video.CustomPlayer.loadCustomPlayerControlEvents(iframe);
		}
	};

	var onPlayerStateChange = function(event){
		if(!_enableCustomPlayer){
			return;
		}

		var newState = event.data;
		var iframe = event.target.getIframe();
		// var player = youtubePlayers[iframe.id];

		switch(newState){
			case -1:
				// V.Debugging.log("Not initialized");
				// V.Video.CustomPlayer.loadCustomPlayerControlEvents(iframe);
				break;
			case 0:
				// V.Debugging.log(playerId + ": Ended");
				V.Video.CustomPlayer.onEndVideo(iframe);
				break;
			case 1:
				// V.Debugging.log(playerId + ": Reproducing at " + $("#"+playerId)[0].getCurrentTime());
				V.Video.CustomPlayer.onPlayVideo(iframe);
				break;
			case 2:
				// V.Debugging.log(playerId + ": Pause at " + $("#"+playerId)[0].getCurrentTime());
				V.Video.CustomPlayer.onPauseVideo(iframe);
				break;
			case 3:
				// V.Debugging.log(playerId + ": Buffer Store");
				break;
			case 4:
				break;
			case 5:
				// V.Debugging.log(playerId + ": Video Tail Store");
				break;
			default:
				// V.Debugging.log(playerId + ": Unknown state: " + newState);
				break;
		}
	};

	var onPlayerError = function(event){
		V.Debugging.log("onPlayerError with error type " + event.data);
	};

	var playVideo = function(iframeId,currentTime,triggeredByUser){
		var ytPlayer = youtubePlayers[iframeId];

		//ytPlayer.getPlayerState must be defined to ensure that Youtube player has loaded properly.
		if((ytPlayer)&&(ytPlayer.getPlayerState)){

			var params = new Object();
			params.videoId = iframeId;
			params.currentTime = ytPlayer.getCurrentTime();
			params.slideNumber = V.Slides.getCurrentSlideNumber();

			if((triggeredByUser)&&(V.Status.isPreventDefaultMode())){
				V.Messenger.notifyEventByMessage(V.Constant.Event.onPlayVideo,params);
				return;
			}

			V.EventsNotifier.notifyEvent(V.Constant.Event.onPlayVideo,params,triggeredByUser);

			_seekVideo(ytPlayer,iframeId,currentTime,false);
			if(ytPlayer.getPlayerState()!==YT.PlayerState.PLAYING){
				ytPlayer.playVideo();
			}
		}
	};

	/**
	 * Function to pause a specific video
	 */
	var pauseVideo = function(iframeId,currentTime,triggeredByUser){
		var ytPlayer = youtubePlayers[iframeId];

		if((ytPlayer)&&(ytPlayer.getPlayerState)){

			var params = new Object();
			params.videoId = iframeId;
			params.currentTime = ytPlayer.getCurrentTime();
			params.slideNumber = V.Slides.getCurrentSlideNumber();

			if((triggeredByUser)&&(V.Status.isPreventDefaultMode())){
				V.Messenger.notifyEventByMessage(V.Constant.Event.onPauseVideo,params);
				return;
			}

			V.EventsNotifier.notifyEvent(V.Constant.Event.onPauseVideo,params,triggeredByUser);

			if(ytPlayer.getPlayerState()===YT.PlayerState.PLAYING){
				ytPlayer.pauseVideo();
			}
			_seekVideo(ytPlayer,iframeId,currentTime,false);
		}
	};

	/**
	 * Function to pause a specific video
	 */
	var seekVideo = function(iframeId,seekTime,triggeredByUser){
		var ytPlayer = youtubePlayers[iframeId];
		if((ytPlayer)&&(ytPlayer.getPlayerState)){
			_seekVideo(ytPlayer,iframeId,seekTime,triggeredByUser);
		}
	};

	var _seekVideo = function(ytPlayer,iframeId,seekTime,triggeredByUser){
		var changeCurrentTime = (typeof seekTime === 'number')&&(ytPlayer.getCurrentTime()!==seekTime);
		if(changeCurrentTime){
			var params = new Object();
			params.videoId = iframeId;
			params.currentTime = seekTime;
			params.slideNumber = V.Slides.getCurrentSlideNumber();

			if((triggeredByUser)&&(V.Status.isPreventDefaultMode())){
				V.Messenger.notifyEventByMessage(V.Constant.Event.onSeekVideo,params);
				return;
			}

			V.EventsNotifier.notifyEvent(V.Constant.Event.onSeekVideo,params,triggeredByUser);
			
			ytPlayer.seekTo(seekTime);
		}
	};

	var getYouTubePlayer = function(id){
		return youtubePlayers[id];
	};


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
	};

	return {
		init 				: init,
		renderVideoFromJSON	: renderVideoFromJSON,
		loadYoutubeObject	: loadYoutubeObject,
		onPlayerReady 		: onPlayerReady,
		onPlayerStateChange : onPlayerStateChange,
		playVideo 			: playVideo,
		pauseVideo 			: pauseVideo,
		seekVideo 			: seekVideo,
		getYoutubeIdFromURL	: getYoutubeIdFromURL,
		getYouTubePlayer	: getYouTubePlayer
	};

})(VISH,jQuery);



