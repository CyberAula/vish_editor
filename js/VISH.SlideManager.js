VISH.SlideManager = (function(V,$,undefined){
	var mySlides = null;   //object with the slides to get the content to represent
	var slideStatus = {};  //array to save the status of each slide
	
	/**
	 * Function to initialize the SlideManager, saves the slides object and init the excursion with it
	 */
	var init = function(slides){
		mySlides = slides;
		V.Excursion.init(slides);

		$('article').on('slideenter',_onslideenter);
		$('article').on('slideleave',_onslideleave);
	};

	/**
	 * function to get the status of the slide, used for flashcards that have a status (showing photo, showing video frame)
	 */
	var getStatus = function(slideid){
		if(!slideStatus[slideid]){
			slideStatus[slideid] = {
				id             : slideid,
				poiFrameNumber : 0,
				drawingPoi     : 0    //no drawing Poi
			};
		}		
		return slideStatus[slideid];
	};

	/**
	 * Function to update the status of a slide
	 */
	var updateStatus = function(slideid, newStatus){
		slideStatus[slideid] = newStatus;	
	};

	/**
	 * Private function that is called when we enter a slide
	 * If we have a flash object or an applet we load it after 0,5 segs because
	 * if loaded in the first moment it appears outside the screen and do not move with the slide
	 * If we have a flashcard init it
	 */
	var _onslideenter = function(e){
		var fcElem, slideId;
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
			V.Mods.fc.player.init(fcElem, slideId);
		}
		V.VideoPlayer.autoPlayVideos(e.target)
	};

	/**
	 * Function to get the flashcard json element from the slide element
	 */
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

	/**
	 * Private function that is called when we leave the slide
	 * we unload flash objects and applets (because they do not move when moving slides)
	 * and we stop flashcards
	 */
	var _onslideleave = function(e){
		V.VideoPlayer.stopVideos(e.target);
		V.SWFPlayer.unloadSWF();
		V.AppletPlayer.unloadApplet();
		if($(e.target).hasClass('flashcard')){				
			V.Mods.fc.player.clear();
		}
	}

	return {
		init          : init,
		getStatus     : getStatus,
		updateStatus  : updateStatus
	};

}) (VISH,jQuery);