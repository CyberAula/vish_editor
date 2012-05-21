VISH.SlideManager = (function(V,$,undefined){
	var mySlides = null;   //object with the slides to get the content to represent
	var slideStatus = {};  //array to save the status of each slide
	
	/**
	 * Function to initialize the SlideManager, saves the slides object and init the excursion with it
	 */
	var init = function(excursion){
		mySlides = excursion.slides;
		V.Excursion.init(mySlides);
		
		$(document).on('click', '#page-switcher-start', VISH.SlidesUtilities.backwardOneSlide);
		$(document).on('click', '#page-switcher-end', VISH.SlidesUtilities.forwardOneSlide);
		$(document).on('click', '#page-fullscreen', toggleFullScreen);
		VISH.SlidesUtilities.updateSlideCounter();
	};

		
	/**
	 * function to enter and exit fullscreen
	 * the main difficulty here is to detect if we are in the iframe or in a full page outside the iframe
	 */
	var toggleFullScreen = function () {
		  
		var isInIFrame = (window.location != window.parent.location) ? true : false;
		var myDoc, myElem = null;
		
		if(isInIFrame){
			myDoc = parent.document;
		} else {
			myDoc = document;
		}
		myElem = myDoc.getElementById('excursion_iframe'); //excursion_iframe is the iframe id and the body id
		
		if ((myDoc.fullScreenElement && myDoc.fullScreenElement !== null) || (!myDoc.mozFullScreen && !myDoc.webkitIsFullScreen)) {
		    if (myDoc.documentElement.requestFullScreen) {
		    	myDoc.getElementById('excursion_iframe').requestFullScreen();
		    } else if (myDoc.documentElement.mozRequestFullScreen) {
		    	myDoc.getElementById('excursion_iframe').mozRequestFullScreen();
		    } else if (myDoc.documentElement.webkitRequestFullScreen) {
		    	myDoc.getElementById('excursion_iframe').webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);			    	
		    }
		  } else {
		    if (myDoc.cancelFullScreen) {
		    	myDoc.cancelFullScreen();
		    } else if (myDoc.mozCancelFullScreen) {
		    	myDoc.mozCancelFullScreen();
		    } else if (myDoc.webkitCancelFullScreen) {
		    	myDoc.webkitCancelFullScreen();
		    }
		  }
		
	};
	
	
	/**
	 * function to add enter and leave events
	 * it is called from vish.excursion.js because we need to add the events before loading slides.js
	 * it is called with live() because in the editor we need to add this event for articles now and in the future as the user is adding articles on the fly
	 */
	var addEnterLeaveEvents = function(){
		$('article').live('slideenter',_onslideenter);
		$('article').live('slideleave',_onslideleave);
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
		//hide/show page-switcher buttons if neccessary
		_decideIfPageSwitcher();
		
		var fcElem, slideId;
		setTimeout(function(){
			if($(e.target).hasClass('object')){
				V.ObjectPlayer.loadObject($(e.target));
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
		V.VideoPlayer.playVideos(e.target);
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
		//TODO detect class of e.target and unload only when neccesary
		//XXX optimize detecting class and type
		V.VideoPlayer.stopVideos(e.target);
		V.ObjectPlayer.unloadObject();
		V.AppletPlayer.unloadApplet();
		if($(e.target).hasClass('flashcard')){				
			V.Mods.fc.player.clear();
		}
	};
	
	/**
	 * function to hide/show the page-switchers buttons in the viewer
	 * hide the left one if on first slide
	 * hide the right one if on last slide
	 * show both otherwise
	 */
	var _decideIfPageSwitcher = function(){
		if(curSlide===0){
			$("#page-switcher-start").hide();
		}
		else if(curSlide === slideEls.length-1){
			$("#page-switcher-end").hide();
			if(curSlide === 1){
				$("#page-switcher-start").show();  //case with 2 slides, show the back button
			}
		}
		else{
			$("#page-switcher-start").show();
			$("#page-switcher-end").show();
		}
	};

	return {
		init          			: init,
		getStatus     			: getStatus,
		updateStatus  			: updateStatus,
		addEnterLeaveEvents  	:  addEnterLeaveEvents
	};

}) (VISH,jQuery);