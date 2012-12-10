VISH.VideoPlayer.CustomPlayer = (function(){

	var progressBarTimer;

	var init = function(){
	}

	var addCustomPlayerControls = function(videoId,loadEvents){
		var video = document.getElementById(videoId);
		//Create wrapper
		var customPlayerContainer = $("<div class='customPlayerContainer'>");
		$(video).parent().append(customPlayerContainer);
		$(video).remove();
		$(customPlayerContainer).append(video);
		$(customPlayerContainer).append($("<div class='customPlayerControls'><div class='customPlayerButton customPlayerPlay'></div></div>"));
		$(customPlayerContainer).append($("<div class='customPlayerProgressBar'><div class='progressBarElapsed'></div></div>"));
		var customPlayerControls = $(customPlayerContainer).find("div.customPlayerControls");
		$(customPlayerContainer).attr("style",$(video).attr("style"));
		$(video).attr("style","width:100%; height:100%;")
		$(customPlayerControls).attr("style","width: 100%; height:100%;")
		_adjustPlayerControls(customPlayerControls);

		//Initial status
		$(video).attr("customPlayerStatus","ready");
		if(loadEvents){
			loadCustomPlayerControlEvents(video);
		}
	}

	/*
	 * Check that background-size param of player images is ok.
	 * Videos with strange aspect ratios need a readjustement
	 */
	var _adjustPlayerControls = function(customPlayerControls){
		var width = $(customPlayerControls).width();
		var height = $(customPlayerControls).height();

		var min_width = 70; //Minimum size for the player
		var originalBackgroundSize = 0.5; //50%

		var icon_width = originalBackgroundSize*width;
		if(icon_width>height){
			_applyBackgroundSize(customPlayerControls,height/width);
		} else {
			if(icon_width<min_width){
				_applyBackgroundSize(customPlayerControls,Math.min(1,min_width/width));
			} else {
				_applyBackgroundSize(customPlayerControls,originalBackgroundSize);
			}
		}
	}

	var _applyBackgroundSize = function(customPlayerControls,bs){
		$(customPlayerControls).find("div.customPlayerButton").css("background-size",bs*100+"%");
	}

	var loadCustomPlayerControlEvents = function(video) {
		var customPlayerContainer = $(video).parent();
		var customPlayerControls = $(customPlayerContainer).find("div.customPlayerControls");
		var progressBar = $(customPlayerContainer).parent().find("div.customPlayerProgressBar");
		$(customPlayerControls).bind('click', _onClickCustomPlayerControls);
		$(customPlayerContainer).bind('mouseenter', _onEnterCustomPlayer);
		$(customPlayerContainer).bind('mouseleave', _onLeaveCustomPlayer);
		$(progressBar).bind('click', _onClickProgressBar); 
  	}

	var _onClickCustomPlayerControls = function(event){
		event.preventDefault();
		var video = $(this).parent().children()[0];
		onClickVideo(video);
	}

	var _onEnterCustomPlayer = function(event){
		var video = $(event.target).parent().children()[0];
		if($(video).attr("customPlayerStatus")!=="ready"){
			var progressBar = $(video).parent().find("div.customPlayerProgressBar");
			$(progressBar).show();
		}
	}

	var _onLeaveCustomPlayer = function(event){
		var progressBar = $(event.target).parent().find("div.customPlayerProgressBar");
		$(progressBar).hide();
	}

	var _startProgressBar = function(video){
		var progressBar = $(video).parent().find("div.progressBarElapsed");
		var timer = progressBarTimer = setInterval(function(){
			try {
				var ratio = (VISH.VideoPlayer.getCurrentTime(video)/VISH.VideoPlayer.getDuration(video))*100;
				$(progressBar).width(ratio+'%');
				if(ratio===100){
					clearTimeout(timer);
				}
			} catch(e){
				clearTimeout(timer);
			}
		},400);
	}

	var _onClickProgressBar = function(event){ 
		if(VISH.Status.isSlaveMode()){
			return;
		}
		
		if($(event.target).hasClass("customPlayerProgressBar")){
			var progressBar =  event.target;
			var elapsed = $(progressBar).find("div.progressBarElapsed")[0];
		} else if($(event.target).hasClass("progressBarElapsed")){
			var elapsed =  event.target;
			var progressBar = $(elapsed).parent();
		} else {
			return;
		}
		event.preventDefault();
		event.stopPropagation();

		var video = $(progressBar).parent().children()[0];
		var ratio = (event.pageX-$(progressBar).offset().left)/$(progressBar).outerWidth();

		// Improve User Experience, disable progress bar blinds
		// if(!VISH.Status.isPreventDefaultMode()){
		// 	$(elapsed).width(ratio*100+'%');
		// }

		var seekToPos = Math.round(VISH.VideoPlayer.getDuration(video)*ratio);
		VISH.VideoPlayer.seekVideo(video.id,seekToPos,true);
	}
  

	var onClickVideo = function(video){
		if(VISH.Status.isSlaveMode()){
			return;
		}
		switch($(video).attr("customPlayerStatus")){
			case "ready":
			case "pause":
				if(!VISH.Status.isPreventDefaultMode()){
					onPlayVideo(video);
				}
				VISH.VideoPlayer.playVideo(video.id,null,true);
				break;
			case "playing":
				if(!VISH.Status.isPreventDefaultMode()){
					onPauseVideo(video);
				}
				VISH.VideoPlayer.pauseVideo(video.id,null,true);
				break;
			default:
				break;
		}
	}

	//Callbacks

	var onPlayVideo = function(video){
		_startProgressBar(video);
		var customPlayerControlsButton = $(video).parent().find("div.customPlayerControls").find("div");
		var progressBar = $(video).parent().find("div.customPlayerProgressBar");
		$(customPlayerControlsButton).removeClass().addClass("customPlayerButton customPlayerPause");
		$(customPlayerControlsButton).hide();
		$(video).attr("customPlayerStatus","playing");  
		$(progressBar).show();
	}

	var onPauseVideo = function(video){
		var customPlayerControlsButton = $(video).parent().find("div.customPlayerControls").find("div");
		$(customPlayerControlsButton).removeClass().addClass("customPlayerButton customPlayerPlay");
		$(customPlayerControlsButton).show();
		$(video).attr("customPlayerStatus","pause");
	}


	var onEndVideo = function(video){
		$(video).attr("customPlayerStatus","pause");
		var customPlayerControlsButton = $(video).parent().find("div.customPlayerControls").find("div");
		$(customPlayerControlsButton).removeClass().addClass("customPlayerButton customPlayerReplay");
		$(customPlayerControlsButton).show();
	}


	return {
		init 							: init,
		addCustomPlayerControls 		: addCustomPlayerControls,
		loadCustomPlayerControlEvents 	: loadCustomPlayerControlEvents,
		onPlayVideo 					: onPlayVideo,
		onPauseVideo 					: onPauseVideo,
		onEndVideo 						: onEndVideo
	};

})(VISH,jQuery);