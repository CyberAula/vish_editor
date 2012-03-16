VISH.VideoPlayer = (function(){
			
	/**
	 * Set video events
	 */
	var setVideoTagEvents = function(){
		var videos = $("video")
		$.each(videos, function(index, video) {
			video.addEventListener('play', function () {
				  //console.log("Play " + video.currentTime)
			}, false);
			video.addEventListener('pause', function () {
				//console.log("Pause " + video.currentTime);
			}, false);
			video.addEventListener('ended', function () {
				//console.log("Ended " + video.currentTime)
			}, false);
			
			//PREVENT KEYBOARD EVENTS ON FIREFOX!
			$(video).focus(function(event) {
        this.blur();
      });
		});
	}
	
		
	/**
	 * Function to start all videos of a slide
	 */
	var playVideos = function(element){
		var currentVideos = $(element).find("video");
		$.each(currentVideos, function(index, video) {
			
			if ($(video).attr("wasplayingonslideleave")=="true"){
			  video.play()
			} else if ($(video).attr("wasplayingonslideleave")=="false"){
				//Do nothing
			} else if (typeof $(video).attr("wasplayingonslideleave") == "undefined"){
				//No wasplayingonslideleave attr
				
				//Check autoplayonsliddenter attr
				if ($(video).attr("autoplayonslideenter")=="true"){
					video.play()
				}
			}
		});
	}
	
	
	/**
	 * Function to stop all videos of a slide
	 */
	var stopVideos = function(element){
		var currentVideos = $(element).find("video");
		$.each(currentVideos, function(index, video) {
			var playing = ! video.paused;
			$(video).attr("wasplayingonslideleave",playing)
			if(playing){
				video.pause()
			}
		});
	}

	return {
		setVideoTagEvents: setVideoTagEvents,
		playVideos: playVideos,
		stopVideos:stopVideos
	};

})(VISH,jQuery);