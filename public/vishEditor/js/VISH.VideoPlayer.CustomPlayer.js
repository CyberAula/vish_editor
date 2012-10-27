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
		$(customPlayerContainer).append($("<div class='customPlayerControls'><div class='customPlayerPlay'></div></div>"));
		$(customPlayerContainer).append($("<div class='customPlayerProgressBar'><div class='progressBarElapsed'></div></div>"));
		var customPlayerControls = $(customPlayerContainer).find("div.customPlayerControls");
		$(customPlayerContainer).attr("style",$(video).attr("style"));
		$(video).attr("style","width:98%; height:98%;")
		$(customPlayerControls).attr("style","width: 100%; height:100%;")
		//Initial status
		$(video).attr("customPlayerStatus","ready");
		if(loadEvents){
			loadCustomPlayerControlEvents(video);
		}
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
		var video = $(this).parent().find("object")[0];
		onClickVideo(video);
	}

	var _onEnterCustomPlayer = function(event){
		var video = $(event.target).parent().find("object")[0];
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

		var video = $(progressBar).parent().find("object")[0];
		var ratio = (event.pageX-$(progressBar).offset().left)/$(progressBar).outerWidth();
		if(!VISH.Status.isPreventDefault()){
			$(elapsed).width(ratio*100+'%');
		}	
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
				if(!VISH.Status.isPreventDefault()){
					onPlayVideo(video);
				}
				VISH.VideoPlayer.playVideo(video.id,null,true);
				break;
			case "playing":
				if(!VISH.Status.isPreventDefault()){
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
		$(customPlayerControlsButton).removeClass().addClass("customPlayerPause");
		$(customPlayerControlsButton).hide();
		$(video).attr("customPlayerStatus","playing");  
		$(progressBar).show();
	}

	var onPauseVideo = function(video){
		var customPlayerControlsButton = $(video).parent().find("div.customPlayerControls").find("div");
		$(customPlayerControlsButton).removeClass().addClass("customPlayerPlay");
		$(customPlayerControlsButton).show();
		$(video).attr("customPlayerStatus","pause");
	}


	var onEndVideo = function(video){
		$(video).attr("customPlayerStatus","pause");
		var customPlayerControlsButton = $(video).parent().find("div.customPlayerControls").find("div");
		$(customPlayerControlsButton).removeClass().addClass("customPlayerReplay");
		$(customPlayerControlsButton).show();
	}


	return {
		init : init,
		addCustomPlayerControls : addCustomPlayerControls,
		loadCustomPlayerControlEvents : loadCustomPlayerControlEvents,
		onPlayVideo : onPlayVideo,
		onPauseVideo : onPauseVideo,
		onEndVideo 	: onEndVideo
	};

})(VISH,jQuery);