VISH.ObjectPlayer = (function(){
	
	/**
	 * Function to add an object to the slide
	 * the object is in the wrapper attribute of the div
	 */
	var loadObject = function(element){
		$.each(element.children('.objectelement'),function(index,value){
			$(value).html("<div style='" + $(value).attr("objectStyle") + "'>" + $(value).attr("objectWrapper") + "</div>");
		});
	};

	/**
	 * Function to remove the flash objects from the slides
	 */
	var unloadObject= function(){
		var element = $('.past, .next')
		$.each(element.children('.objectelement'),function(index,value){
			$(value).html("");
		});
	}

	return {
		loadObject:loadObject,
		unloadObject:unloadObject
	};

})(VISH,jQuery);