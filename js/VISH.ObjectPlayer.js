VISH.ObjectPlayer = (function(){
	
	/**
	 * Function to add an object to the slide
	 * the object is in the wrapper attribute of the div
	 */
	var loadObject = function(element){
		$.each(element.children('.objectelement'),function(index,value){
			var object = $($(value).attr("objectWrapper"));
			$(object).attr("style",$(value).attr("zoomInStyle"));
			$(value).html("<div style='" + $(value).attr("objectStyle") + "'>" + VISH.Utils.getOuterHTML(object) + "</div>");
			adjustDimensionsAfterZoom($($(value).children()[0]).children()[0]);
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
	
	
	var aftersetupSize = function(){
		if($(".current").hasClass("object")){
			loadObject($(".current"));
		}
	}
	
	var adjustDimensionsAfterZoom = function(objectWithZoom){
		var parent = $(objectWithZoom).parent();
		var zoom = VISH.SlidesUtilities.getZoomFromStyle($(objectWithZoom).attr("style"));
		$(objectWithZoom).height($(parent).height()/zoom)
		$(objectWithZoom).width($(parent).width()/zoom)
	}

	return {
		loadObject:loadObject,
		unloadObject:unloadObject,
		aftersetupSize : aftersetupSize,
		adjustDimensionsAfterZoom : adjustDimensionsAfterZoom
	};

})(VISH,jQuery);