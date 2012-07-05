VISH.SlideManager = (function(V,$,undefined){
	var mySlides = null;   //object with the slides to get the content to represent
	var slideStatus = {};  //array to save the status of each slide
	var myDoc; //to store document or parent.document depending if on iframe or not
	 //Prevent to load events multiple times.
  var eventsLoaded = false;
	
	/**
	 * Function to initialize the SlideManager, saves the slides object and init the excursion with it
	 */
	var init = function(excursion){
		//first set VISH.Editing to false
		VISH.Editing = false;
		mySlides = excursion.slides;
		V.Excursion.init(mySlides);
		_setupSize();
		
		if(!eventsLoaded){
			eventsLoaded = true;
			addEventListeners(); //for the arrow keys
      $(document).on('click', '#page-switcher-start', VISH.SlidesUtilities.backwardOneSlide);
      $(document).on('click', '#page-switcher-end', VISH.SlidesUtilities.forwardOneSlide);
		}
		
		var isInIFrame = (window.location != window.parent.location) ? true : false;
		var myElem = null;
		
		if(isInIFrame){
			myDoc = parent.document;
		} else {
			myDoc = document;
		}
		
		$(myDoc).on("webkitfullscreenchange mozfullscreenchange fullscreenchange",function(){
      _setupSize();       
    });
		
		var elem = document.getElementById("page-fullscreen");  
		var canFullScreen = elem && (elem.requestFullScreen || elem.mozRequestFullScreen || elem.webkitRequestFullScreen);
		
		if (canFullScreen) {  
		  $(document).on('click', '#page-fullscreen', toggleFullScreen);
		}	else {
		  $("#page-fullscreen").hide();
		}
		 
		
		VISH.SlidesUtilities.updateSlideCounter();
	};

	
	/**
	 * function to enter and exit fullscreen
	 * the main difficulty here is to detect if we are in the iframe or in a full page outside the iframe
	 */
	var toggleFullScreen = function () {

		myElem = myDoc.getElementById('excursion_iframe'); //excursion_iframe is the iframe id and the body id
		
		if ((myDoc.fullScreenElement && myDoc.fullScreenElement !== null) || (!myDoc.mozFullScreen && !myDoc.webkitIsFullScreen)) {
		    if (myDoc.documentElement.requestFullScreen) {
		    	myElem.requestFullScreen();
		    } else if (myDoc.documentElement.mozRequestFullScreen) {
		    	myElem.mozRequestFullScreen();
		    } else if (myDoc.documentElement.webkitRequestFullScreen) {
		    	myElem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);			    	
		    }
		    //change icon
		    $("#page-fullscreen").css("background-position", "-45px 0px");
		    $("#page-fullscreen").hover(function(){
			    $("#page-fullscreen").css("background-position", "-45px -40px");
			}, function() {
			    $("#page-fullscreen").css("background-position", "-45px 0px");
			});
		} else {
		    if (myDoc.cancelFullScreen) {
		    	myDoc.cancelFullScreen();
		    } else if (myDoc.mozCancelFullScreen) {
		    	myDoc.mozCancelFullScreen();
		    } else if (myDoc.webkitCancelFullScreen) {
		    	myDoc.webkitCancelFullScreen();
		    }
		    //change icon
		    $("#page-fullscreen").css("background-position", "0px 0px");
		    $("#page-fullscreen").hover(function(){
			    $("#page-fullscreen").css("background-position", "0px -40px");
			  }, function() {
			    $("#page-fullscreen").css("background-position", "0px 0px");
			  });
		  }
	};
	
	/**
	 * function to adapt the slides to the screen size, in case the editor is shown in another iframe
	 */
	var _setupSize = function(){
		var height = $(window).height()-40; //the height to use is the window height - 40px that is the menubar height
		var width = $(window).width();
		var finalW = 800;
		var finalH = 600;
		
		var aspectRatio = width/height;
		var slidesRatio = 4/3;
		if(aspectRatio > slidesRatio){
			finalH = height - 40;  //leave 40px free, 20 in the top and 20 in the bottom ideally
			finalW = finalH*slidesRatio;	
		}	else {
			finalW = width - 110; //leave 110px free, at least, 55 left and 55 right ideally
			finalH = finalW/slidesRatio;	
		}
		$(".slides > article").css("height", finalH);
		$(".slides > article").css("width", finalW);
		
		//margin-top and margin-left half of the height and width
		var marginTop = finalH/2 + 20;
		var marginLeft = finalW/2;
		$(".slides > article").css("margin-top", "-" + marginTop + "px");
		$(".slides > article").css("margin-left", "-" + marginLeft + "px");
		
		//finally font-size, line-height and letter-spacing of articles
		//after this change the font sizes of the zones will be relative as they are in ems
		var increase = finalH/600;
		$(".slides > article").css("font-size", 16*increase + "px");
		$(".slides > article").css("line-height", 16*increase + "px");
		/*$(".slides > article").css("letter-spacing", 1*increase + "px");*/
		
		//Snapshot callbacks
		VISH.SnapshotPlayer.aftersetupSize(increase);
		
		//Object callbacks
		VISH.ObjectPlayer.aftersetupSize(increase);
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
			else if($(e.target).hasClass('snapshot')){
        V.SnapshotPlayer.loadSnapshot($(e.target));
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
		else{
			$("#page-switcher-start").show();
		}
		
		if(curSlide === slideEls.length-1){
			$("#page-switcher-end").hide();			
		}
		else{
			$("#page-switcher-end").show();
		}
	};

	return {
		init          			: init,
		getStatus     			: getStatus,
		updateStatus  			: updateStatus,
		addEnterLeaveEvents  	:  addEnterLeaveEvents,
		toggleFullScreen : toggleFullScreen
	};

}) (VISH,jQuery);