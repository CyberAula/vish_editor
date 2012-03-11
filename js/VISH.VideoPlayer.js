VISH.VideoPlayer = (function(){
		
	/**
	 * Function to start videos with autoplayonslideenter param
	 */
	var autoPlayVideos = function(element){
		var currentVideos = $(element).find("video");
		$.each(currentVideos, function(index, value) {
			if ($(value).attr("autoplayonslideenter")=="true"){
				$(value)[0].play()
			}
		});
	}
	
	
	/**
	 * Function to stop all the videos of a slide
	 */
	var stopVideos = function(element){
		var currentVideos = $(element).find("video");
		$.each(currentVideos, function(index, value) {
			$(value)[0].pause()
		});
	}

	return {
		autoPlayVideos: autoPlayVideos,
		stopVideos:stopVideos
	};

})(VISH,jQuery);