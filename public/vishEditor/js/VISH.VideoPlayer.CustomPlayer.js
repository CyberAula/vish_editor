VISH.VideoPlayer.CustomPlayer = (function(){

	var init = function(){
		_loadCustomPlayerControlEvents();
	}

	var addCustomPlayerControls = function(videoId){
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
		//Add control events
		_loadCustomPlayerControlEvents(video);
	}


	var _loadCustomPlayerControlEvents = function(video) {
		var customPlayerControls = $(video).parent();
		var progressBar = $(customPlayerControls).parent().find("div.customPlayerProgressBar");
		var progressBarElapsed = $(customPlayerControls).parent().find("div.progressBarElapsed");
		$(customPlayerControls).bind('click', _onClickCustomPlayerControls); 
		$(progressBar).bind('mouseenter', _onMouseEnter);
		$(progressBar).bind('mouseleave', _onMouseLeave);
		$(progressBarElapsed).bind('mouseenter', _onMouseEnter);
		$(progressBarElapsed).bind('mouseleave', _onMouseLeave);
		$(customPlayerControls).bind('mouseenter', _onMouseEnterCustomPlayerControls);
		$(customPlayerControls).bind('mouseleave', _onMouseLeaveCustomPlayerControls);
		$(progressBar).bind('click', _onClickProgressBar); 
  	}

	var _onClickCustomPlayerControls = function(event){
		event.preventDefault();
		var video = $(this).parent().find("object")[0];
		onClickVideo(video);
	}

	var _onMouseEnter = function(event){
		 $(event.target).attr("hover",true);
	}

	var _onMouseLeave = function(event){
		$(event.target).attr("hover",false);
	}

	var _onMouseEnterCustomPlayerControls = function(event){
		$(event.target).attr("hover",true);
		var video = $(this).parent().find("object")[0];
		if($(video).attr("customPlayerStatus")!=="ready"){
			var progressBar = $(video).parent().find("div.customPlayerProgressBar");
			$(progressBar).show();
		}
	}

	var _onMouseLeaveCustomPlayerControls = function(event){
		$(event.target).attr("hover",false);
		setTimeout(function(){
			var customPlayerControls = $(event.target);
			var progressBar = $(customPlayerControls).parent().find("div.customPlayerProgressBar");
			var progressBarElapsed = $(customPlayerControls).parent().find("div.progressBarElapsed");
			var customPlayerControlsHover = $(customPlayerControls).attr("hover")==="true";
			var progressBarHover = ($(progressBar).attr("hover")==="true")||($(progressBarElapsed).attr("hover")==="true");
			if((!customPlayerControlsHover)&&(!progressBarHover)){
				$(progressBar).hide();
			}
		},300);
	}

 
	var _startProgressBar = function(video){
		var progressBar = $(video).parent().find("div.progressBarElapsed");
		setInterval(function(){
			$(progressBar).width((video.getCurrentTime()/video.getDuration())*100+'%');
		},400);
	}

    var _onClickProgressBar = function(event){ 
      if($(event.target).hasClass("customPlayerProgressBar")){
        var progressBar =  event.target;
        var elapsed = $(progressBar).find("div.progressBarElapsed")[0];
      } else if($(event.target).hasClass("progressBarElapsed")){
        var elapsed =  event.target;
        var progressBar = $(elapsed).parent();
      } else {
        return;
      }
      var video = $(progressBar).parent().find("object")[0];
      var ratio = (event.pageX-$(progressBar).offset().left)/$(progressBar).outerWidth();
      $(elapsed).width(ratio*100+'%');
      video.seekTo(Math.round(video.getDuration()*ratio), true);
      event.preventDefault();
      event.stopPropagation();
    }
  

  var onClickVideo = function(video){
    switch($(video).attr("customPlayerStatus")){
      case "ready":
        _startProgressBar(video);
      case "pause":
        var customPlayerControlsButton = $(video).parent().find("div.customPlayerControls").find("div");
        var progressBar = $(video).parent().find("div.customPlayerProgressBar");
        $(customPlayerControlsButton).removeClass().addClass("customPlayerPause");
        $(customPlayerControlsButton).hide();
        $(video).attr("customPlayerStatus","playing");  
        $(progressBar).show();
        video.playVideo();
        break;
      case "playing":
        var customPlayerControlsButton = $(video).parent().find("div.customPlayerControls").find("div");
        $(customPlayerControlsButton).removeClass().addClass("customPlayerPlay");
        $(customPlayerControlsButton).show();
        $(video).attr("customPlayerStatus","pause");
        video.pauseVideo();
        break;
      default:
       break;
    }
  }

  var onEndVideo = function(videoId){
    var video = $("#"+videoId);
    $(video).attr("customPlayerStatus","pause");
    var customPlayerControlsButton = $(video).parent().find("div.customPlayerControls").find("div");
    $(customPlayerControlsButton).removeClass().addClass("customPlayerReplay");
    $(customPlayerControlsButton).show();
  }


	return {
		init : init,
		addCustomPlayerControls : addCustomPlayerControls,
		onEndVideo 	: onEndVideo
	};

})(VISH,jQuery);