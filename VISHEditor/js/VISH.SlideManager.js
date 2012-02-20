VISH.SlideManager = (function(V,$,undefined){
	var mySlides = null;   //object with the slides to get the content to represent
	var slideStatus = new Array();  //array to save the status of each slide
	
	var init = function(slides){
		mySlides = slides;
		V.Excursion.init(slides);

		$('article').on('slideenter',_onslideenter);
		$('article').on('slideleave',_onslideleave);
	};

	var getStatus = function(slideid){
		if(!slideStatus[slideid]){
			slideStatus[slideid] = {
				poiFrameNumber : 0,
				drawingPoi     : 0    //no drawing Poi
			};
		}		
		return slideStatus[slideid];
	};

	var _onslideenter = function(e){
		var fcElem, slideId;-
		setTimeout(function(){
			if($(e.target).hasClass('swf')){
				V.SWFPlayer.loadSWF($(e.target));
			}
			else if($(e.target).hasClass('applet')){
				V.AppletPlayer.loadApplet($(e.target));
			}
		},500);
		if($(e.target).hasClass('flashcard')){
			slideId = $(e.target).attr("id");
			fcElem = _getFlashcardFromSlideId(slideId);	
			V.Mods.fc.player.init(fcElem, getStatus(slideId));
		}
	};

	var _getFlashcardFromSlideId = function(id){
		var fc = null;
		for(var i=0;i<mySlides.length;i++){
			if(mySlides[i].id===id){
				for(var num=0;num<mySlides[i].elements.length;num++){
					if(mySlides[i].elements[num].type === "flashcard"){					
						return mySlides[i].elements[num];
					}
				}
			}		
		}
		return null;
	};

	var _onslideleave = function(e){
		V.SWFPlayer.unloadSWF();
		V.AppletPlayer.unloadApplet();
	}

	return {
		init      : init,
		getStatus : getStatus
	};

}) (VISH,jQuery);