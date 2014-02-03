VISH.ObjectPlayer = (function(V,$,undefined){
	
	/**
	 * Function to add an object to the slide
	 * the object is in the wrapper attribute of the div
	 */
	var loadObject = function(slide){
		$.each(slide.children('.objectelement'),function(index,value){
			if($(value).hasClass('youtubeelement')){
				V.Video.Youtube.loadYoutubeObject(value);
				return;
			}

			if($(value).attr("objectWrapper").match("^<iframe")!==null && V.Status.isOnline()=== false){
				$(value).html("<img src='"+V.ImagesPath+"/adverts/advert_new_grey_iframe.png'/>");
				return;
			}

			var object = $($(value).attr("objectWrapper"));
			$(object).attr("style",$(value).attr("zoomInStyle"));
			$(value).html("<div style='" + $(value).attr("objectStyle") + "'>" + V.Utils.getOuterHTML(object) + "</div>");
			adjustDimensionsAfterZoom($($(value).children()[0]).children()[0]);
		});
	};

	/**
	 * Function to remove the flash objects from the slides
	 */
	var unloadObject= function(slide){
		$.each($(slide).children('.objectelement'),function(index,value){
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
		var parentHeight = $(parent).height();
		var parentWidth = $(parent).width();
		var zoom = V.Utils.getZoomFromStyle($(objectWithZoom).attr("style"));
		var percentHeight = (parentHeight/zoom)/parentHeight*100;
		var percentWidth = (parentWidth/zoom)/parentWidth*100;
		$(objectWithZoom).height(percentHeight+"%");
		$(objectWithZoom).width(percentWidth+"%");
	}

	return {
		loadObject:loadObject,
		unloadObject:unloadObject,
		aftersetupSize : aftersetupSize,
		adjustDimensionsAfterZoom : adjustDimensionsAfterZoom
	};

})(VISH,jQuery);