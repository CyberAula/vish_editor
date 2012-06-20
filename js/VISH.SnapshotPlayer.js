VISH.SnapshotPlayer = (function(){
	
	/**
	 * Function to add an object to the slide
	 * the object is in the wrapper attribute of the div
	 */
	var loadSnapshot = function(element){
		$.each(element.children('.snapshotelement'),function(index,value){
			var wrapper_class = $(value).attr("template") + "_snapshot_wrapper";
			var content_class = $(value).attr("template") + "_ snapshot_content";
			var content = $(value).attr("objectWrapper");
			$(content).addClass(content_class);
			var scrollTop = $(value).attr("scrollTop");
			var scrollLeft = $(value).attr("scrollLeft");
			//$(value).hide();
			$(value).html("<div class='" + wrapper_class + "' style='" + $(value).attr("objectStyle") + "'>" + VISH.Utils.getOuterHTML($(content)) + "</div>");
			
			console.log("scrollTop:" + scrollTop)
			console.log("scrollLeft:" + scrollLeft)
			
			$(value).find("." + wrapper_class).scrollTop(scrollTop);
			$(value).find("." + wrapper_class).scrollLeft(scrollLeft);
			//$(value).show();
		});
	};

	/**
	 * Function to remove the flash objects from the slides
	 */
	var unloadSnapshot= function(){
		var element = $('.past, .next')
		$.each(element.children('.objectelement'),function(index,value){
			$(value).html("");
		});
	}

	return {
		loadSnapshot:loadSnapshot,
		unloadSnapshot:unloadSnapshot
	};

})(VISH,jQuery);