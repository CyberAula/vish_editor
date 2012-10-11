VISH.ObjectPlayer = (function(){
	
	/**
	 * Function to add an object to the slide
	 * the object is in the wrapper attribute of the div
	 */
	var loadObject = function(element){
		$.each(element.children('.objectelement'),function(index,value){
			if($(value).hasClass('youtubeelement')){
				loadYoutubeObject(element,value);
				return;
			}
			var object = $($(value).attr("objectWrapper"));
			$(object).attr("style",$(value).attr("zoomInStyle"));
			$(value).html("<div style='" + $(value).attr("objectStyle") + "'>" + VISH.Utils.getOuterHTML(object) + "</div>");
			adjustDimensionsAfterZoom($($(value).children()[0]).children()[0]);
		});
	};

	var loadYoutubeObject = function(element,value){
		var source = $(value).attr("source");
		var ytVideoId = $(value).attr("ytVideoId");
		$(value).html("<div id='" + ytVideoId + "' style='" + $(value).attr("objectStyle") + "'></div>");
		var newYtVideoId = VISH.Utils.getId();
		var params = { allowScriptAccess: "always" };
    	var atts = { id: newYtVideoId };
    	source = source.split("?")[0]; //Remove params
    	source = source + "?enablejsapi=1&playerapiid="+newYtVideoId+"&wmodetransparent=true" //Add yt necessary params
    	//swfobject library doc in http://code.google.com/p/swfobject/wiki/api
    	swfobject.embedSWF(source,ytVideoId, "100%", "100%", "8", null, null, params, atts); 
		$("#"+newYtVideoId).attr("style",$(value).attr("objectStyle"));
	}

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
		var zoom = VISH.Utils.getZoomFromStyle($(objectWithZoom).attr("style"));
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