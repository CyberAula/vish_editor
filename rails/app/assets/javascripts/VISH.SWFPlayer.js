VISH.SWFPlayer = (function(){
	
	/**
	 * Function to add the flash object to the slide
	 * the flash object is in the src attribute of the div
	 */
	var loadSWF = function(element){
		$.each(element.children('.swfelement'),function(index,value){
			$(value).append("<embed src='"+$(value).attr('src')+"' class='"+$(value).attr('templateclass')+"' />");
		});
	};

	/**
	 * Function to remove the flash objects from the slides
	 */
	var unloadSWF = function(element){
		$('.swfelement embed').remove();
	}

	return {
		loadSWF:loadSWF,
		unloadSWF:unloadSWF
	};

})(VISH,jQuery);