VISH.ObjectPlayer = (function(V,$,undefined){
	
	/**
	 * Function to add an object to the slide
	 * the object is in the wrapper attribute of the div
	 */
	var loadObject = function(slide){
		$.each(slide.children('.objectelement'),function(index,objectWrapper){
			if($(objectWrapper).hasClass('loadedObject')){
				return;
			} else {
				$(objectWrapper).addClass('loadedObject');
			}

			if($(objectWrapper).hasClass('youtubeelement')){
				V.Video.Youtube.loadYoutubeObject(objectWrapper);
				return;
			}

			if($(objectWrapper).attr("objectWrapper").match("^<iframe")!==null && V.Status.isOnline()=== false){
				$(objectWrapper).html("<img src='"+V.ImagesPath+"/adverts/advert_new_grey_iframe.png'/>");
				return;
			}

			var object = $($(objectWrapper).attr("objectWrapper"));
			$(object).attr("style",$(objectWrapper).attr("zoomInStyle"));
			$(objectWrapper).html("<div style='" + $(objectWrapper).attr("objectStyle") + "'>" + V.Utils.getOuterHTML(object) + "</div>");
			adjustDimensionsAfterZoom($($(objectWrapper).children()[0]).children()[0]);
		});
	};

	var unloadObject= function(slide){
		$.each($(slide).children('.objectelement:not(".unloadableObject")'),function(index,objectWrapper){
			$(objectWrapper).removeClass('loadedObject');
			$(objectWrapper).html("");
		});
	};
	
	
	var aftersetupSize = function(){
		if($(".current").hasClass("object")){
			loadObject($(".current"));
		}
	};
	
	var adjustDimensionsAfterZoom = function(objectWithZoom){
		var parent = $(objectWithZoom).parent();
		var parentHeight = $(parent).height();
		var parentWidth = $(parent).width();
		var zoom = V.Utils.getZoomFromStyle($(objectWithZoom).attr("style"));
		var percentHeight = (parentHeight/zoom)/parentHeight*100;
		var percentWidth = (parentWidth/zoom)/parentWidth*100;
		$(objectWithZoom).height(percentHeight+"%");
		$(objectWithZoom).width(percentWidth+"%");
	};

	return {
		loadObject 					: loadObject,
		unloadObject 				: unloadObject,
		aftersetupSize 				: aftersetupSize,
		adjustDimensionsAfterZoom 	: adjustDimensionsAfterZoom
	};

})(VISH,jQuery);