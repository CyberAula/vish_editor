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
		
		//Read options
		if(options){
			if(options['callback']){
				callback = options['callback'];
			}
		}

		var scrollbar = $("#"+containerId);
		$(scrollbar).mCustomScrollbar({
			scrollInertia: 0,
			autoDraggerLength: true
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
		$(scrollbar).removeClass("mCustomScrollbar _mCS_1 _mCS_2");
		return;
	}
  
	var goToElement = function(carrouselDivId,element){
	}
  
	var insertElement = function(carrouselDivId,element,posc){
	}

	return {
		createScrollbar	  : createScrollbar,
		cleanScrollbar    : cleanScrollbar
	};

}) (VISH, jQuery);
