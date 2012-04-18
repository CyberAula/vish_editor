VISH.SWFPlayer = (function(){
	
	/**
	 * Function to add the flash object to the slide
	 * the flash object is in the src attribute of the div
	 */
	var loadSWF = function(element){
		$.each(element.children('.swfelement'),function(index,value){
			$(value).html("<embed src='"+$(value).attr('src')+"' class='"+$(value).attr('templateclass')+"' style='" + $(value).attr('swfStyle') + "' />");
		});
	};

	/**
	 * Function to add the iframe object to the slide
	 */
	var loadIframe = function(element){
		$.each(element.children('.iframeelement'),function(index,value){
			$(value).html($(value).attr('src'));
		});
	};

	/**
	 * Function to remove the flash objects from the slides
	 */
	var unloadSWF = function(element){
		$('.swfelement embed').remove();
	}
	
	/**
	 * Function to remove the iframe objects from the slides
	 */
	var unloadIframe = function(element){
		$('.iframeelement iframe').remove();
	}

	return {
		loadSWF:loadSWF,
		loadIframe:loadIframe,
		unloadSWF:unloadSWF,
		unloadIframe:unloadIframe
	};

})(VISH,jQuery);