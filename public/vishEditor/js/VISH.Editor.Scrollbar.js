/*
 * Wrapper for jQuery custom content scroller
 * http://manos.malihu.gr/jquery-custom-content-scroller/
 */

VISH.Editor.Scrollbar = (function(V,$,undefined){
	
	//Available Options: callback
	var createScrollbar = function(containerId,options){
		//Necessary params
		if(!containerId){
			return;
		}
		
		//Default values
		var callback = null;
		var horizontalScroll = false;
		
		//Read options
		if(options){
			if(options['callback']){
				callback = options['callback'];
			}
			if(options['horizontalScroll']){
				horizontalScroll = options['horizontalScroll'];
			}
		}

		var scrollbar = $("#"+containerId);
		$(scrollbar).mCustomScrollbar({
			scrollInertia: 0,
			autoDraggerLength: true,
			horizontalScroll:horizontalScroll
		});
		$(scrollbar).find(".mCSB_container").css("margin-right","5px");

		setTimeout(function(){
			$(scrollbar).mCustomScrollbar("update");
			setTimeout(function(){
				$(scrollbar).mCustomScrollbar("scrollTo","bottom");
				//Callback
				if(typeof callback === "function"){
					callback();
				}
			},150);
		},100);

		return;
	}
	
	var cleanScrollbar = function(containerId){
		//Remove content
		var scrollbar = $("#"+containerId);
		$(scrollbar).html("");
		//Remove all classes
		$(scrollbar).removeClass();
		return;
	}
  
	var goToElement = function(containerId,element){
		var elementId = $(element).attr("id");
		if(typeof elementId == "string"){
			$("#"+containerId).mCustomScrollbar("scrollTo","#" + elementId);
		} else {
			// V.Debugging.log("Elements without id can't be scrolled to");
		}
	}
  
	var insertElement = function(containerId,element,posc){
	}

	return {
		createScrollbar	  : createScrollbar,
		cleanScrollbar    : cleanScrollbar,
		goToElement		  : goToElement
	};

}) (VISH, jQuery);
