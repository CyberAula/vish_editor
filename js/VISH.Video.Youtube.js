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
var _youTubeIframeApiReady = false;
function onYouTubeIframeAPIReady(){ _youTubeIframeApiReady = true; }


VISH.Video.Youtube = (function(V,$,undefined){

	var _waitForLoadYouTubeAPI = true;
	var _enableCustomPlayer;

	var init = function(enableCustomPlayer){
		_enableCustomPlayer = enableCustomPlayer;

		_loadYouTubeIframeAPILibrary();
		setTimeout(function(){
			_waitForLoadYouTubeAPI = false;
		},11000);
	};

	var _loadYouTubeIframeAPILibrary = function(){
		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	};

	var _isYouTubeIframeAPIReady = function(){
		if((window['YT'])&&(_youTubeIframeApiReady===true)){
			return true;
		} else {
			return false;
		}
	};

	var renderVideoFromJSON = function(videoJSON, options){
		var source = videoJSON['body'] || videoJSON['source'];
		var options = options || {};
		options.id = (videoJSON['id']) ? videoJSON['id'] : V.Utils.getId();
		options.objectStyle = videoJSON['style'];
		options.zoomInStyle = videoJSON['zoomInStyle'];
		return renderVideoFromSource(source,options);
	};

	var renderVideoFromSource = function(source,options){
		var videoId = ((options)&&(options.id)) ? options.id : V.Utils.getId();
		var ytContainerId = V.Utils.getId();
		var videoClasses = "";
		var objectStyle = "";
		var zoomInStyle = "";
		if(options){
			if(options.extraClasses){
				videoClasses = videoClasses + " " + options.extraClasses;
			}
			if(options.objectStyle){
				objectStyle = "objectStyle='" + options.objectStyle + "' ";
			} else if(options.style){
				objectStyle = "objectStyle='" + options.style + "' ";
			}
			if(options.zoomInStyle){
				zoomInStyle = "zoomInStyle='" + options.zoomInStyle + "' ";
			}
		};

		var video = "<div id='"+ videoId + "' ytContainerId='" + ytContainerId + "' class='" + videoClasses + "' " + objectStyle + zoomInStyle + " source='" + source + "'>" + "</div>";
		return video;
	};

	var loadYoutubeObject = function(container,options){
		var enableCustomPlayer = _enableCustomPlayer;
		var controls = enableCustomPlayer ? 0 : 1;
		var _onReadyCallback = onPlayerReady;
		var _onPlayerError = onPlayerError;

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
			if(typeof options.onPlayerError == "function"){
				_onPlayerError = options.onPlayerError;
			}
		}


		if(V.Status.isOnline()===false){
			$(container).html("<img src='"+V.ImagesPath+"adverts/advert_new_grey_video.png'/>");
			_onPlayerError();
			return;
		}

		// If Youtube Iframe isn't ready, load nothing
		if(!_isYouTubeIframeAPIReady()){
			if(_waitForLoadYouTubeAPI){
				setTimeout(function(){
					loadYoutubeObject(container,options);
				},1000);
			} else {
				$(container).html("<img src='"+V.ImagesPath+"adverts/advert_new_grey_video.png'/>");
				$(container).addClass("videoOfflineContainer");
				var nonAvailableImg = $(container).find("img");
				$(nonAvailableImg).load(function(response){
					$(nonAvailableImg).css("margin-top",($(container).height()-$(nonAvailableImg).height())/2 + "px");
				});
				_onPlayerError();
			}
			return;
		}

		var youtubeVideoId = getYoutubeIdFromURL($(container).attr("source")); 
		if(youtubeVideoId===null){
			_onPlayerError();
			return;
		}
		
		var iframeId = $(container).attr("ytContainerId");
		var ytStyle = (typeof $(container).attr("objectStyle") != "undefined") ? ("style='" + $(container).attr("objectStyle") + "' ") : "";
		$(container).html("<div id='" + iframeId + "' videotype='"+ V.Constant.MEDIA.YOUTUBE_VIDEO + "' " + ytStyle + "'></div>");

		youtubePlayers[iframeId] = new YT.Player(iframeId, {
		  height: '100%',
		  width: '100%',
		  videoId: youtubeVideoId,
		  playerVars: { 'autoplay': 0, 'controls': controls, 'enablejsapi': 1, 'showinfo': 0, wmode: "transparent", 'rel': 0 },
		  events: {
			 'onReady': _onReadyCallback,
			 // 'onStateChange': onPlayerStateChange,
			 'onError' : _onPlayerError
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
		if((typeof event == "object")&&(typeof event.data != "undefined")){
			V.Debugging.log("onPlayerError with error type " + event.data);
		}
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

	var getEmbedSource = function(youTubeVideoDOM){
		return "https://www.youtube.com/embed/" + V.Video.Youtube.getYoutubeIdFromURL(V.Object.getObjectInfo(youTubeVideoDOM).source);
	};

	return {
		init 				: init,
		renderVideoFromJSON	: renderVideoFromJSON,
		renderVideoFromSource	: renderVideoFromSource,
		loadYoutubeObject	: loadYoutubeObject,
		onPlayerReady 		: onPlayerReady,
		onPlayerStateChange : onPlayerStateChange,
		playVideo 			: playVideo,
		pauseVideo 			: pauseVideo,
		seekVideo 			: seekVideo,
		getYoutubeIdFromURL	: getYoutubeIdFromURL,
		getYouTubePlayer	: getYouTubePlayer,
		getEmbedSource		: getEmbedSource
	};

})(VISH,jQuery);



