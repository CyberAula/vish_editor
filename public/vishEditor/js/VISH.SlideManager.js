VISH.SlideManager = (function(V,$,undefined){
	var initOptions;
	var mySlides = null;   //object with the slides to get the content to represent
	var slideStatus = {};  //array to save the status of each slide
	var myDoc; //to store document or parent.document depending if on iframe or not
	var current_presentation;
	var presentationType = "presentation"; //can be "presentation", "game", "flashcard"


	/**
	 * Function to initialize the SlideManager, saves the slides object and init the presentation with it
	 * options is a hash with params and options from the server.
	 */
	var init = function(options, presentation){
		VISH.Editing = false;
		
		VISH.Debugging.init(options);

		if(options){
			initOptions = options;
		} else {
			initOptions = {};
		}
		
		if((options)&&(options["configuration"])&&(VISH.Configuration)){
			VISH.Configuration.init(options["configuration"]);
		}

		if(VISH.Debugging.isDevelopping()){
			if ((options["configuration"]["mode"]=="noserver")&&(!presentation)&&(VISH.Debugging.getPresentationSamples()!=null)) {
			 	presentation = VISH.Debugging.getPresentationSamples();
			}
		}

		VISH.Debugging.log("\n\nSlideManager.init with presentation:\n"); 
		VISH.Debugging.log(JSON.stringify(presentation));

		current_presentation = presentation;
		setPresentationType(presentation.type);
		
		V.Status.init(function(){
			//Status loading finishes
			_initAferStatusLoaded(options,presentation);
		});
	};

	var _initAferStatusLoaded = function(options,presentation){
		V.Quiz.init(presentation);
		V.Flashcard.init();
		V.Renderer.init();
		V.Slides.init();
		V.Utils.loadDeviceCSS();
		V.User.init(options);
		V.Utils.init();
		
		//Experimental initializers for new excursion types
		switch(presentation.type){
			case VISH.Constant.GAME:
				VISH.ViewerAdapter.setupGame(presentation);	
				VISH.Game.registerActions(presentation);
				break;
			case VISH.Constant.VTOUR:
				VISH.VirtualTour.init();
				break;
		}

		//important that events are initialized after presentation type is proccessed
		V.Events.init();
		V.EventsNotifier.init();
	  	V.VideoPlayer.init();

		V.Themes.loadTheme(presentation.theme);
		mySlides = presentation.slides;
		V.Presentation.init(mySlides);
		V.Quiz.prepareQuiz(presentation);

		//Init Vish Editor Addons
		if(options.addons){
			V.Addons.init(options.addons);
		}

		V.ViewerAdapter.init(options); //Also init texts
	}


	/**
	 * function to enter and exit fullscreen
	 * the main difficulty here is to detect if we are in the iframe or in a full page outside the iframe
	 */
	var toggleFullScreen = function () {

		if(VISH.Status.isSlaveMode()){
			return;
		}
		if(V.Status.getIsInIframe()){
			var myDoc = parent.document;
		} else {
			var myDoc = document;
		}
				
		if(VISH.Status.getIsInIframe()){
			var myElem = VISH.Status.getIframe();
		} else {
			var myElem = myDoc.getElementById('presentation_iframe');
		}
		
		if ((myDoc.fullScreenElement && myDoc.fullScreenElement !== null) || (!myDoc.mozFullScreen && !myDoc.webkitIsFullScreen)) {
		    if (myDoc.documentElement.requestFullScreen) {
		    	myElem.requestFullScreen();
		    } else if (myDoc.documentElement.mozRequestFullScreen) {
		    	myElem.mozRequestFullScreen();
		    } else if (myDoc.documentElement.webkitRequestFullScreen) {
		    	myElem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);			    	
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


	var getOptions = function(){	
		return initOptions;
	};


	/**
	 * Private function that is called when we enter a slide
	 * If we have a object (flash or applet) we load it after 0,5 segs because
	 * if loaded in the first moment it appears outside the screen and do not move with the slide
	 * If we have a flashcard init it
	 */
	var _onslideenter = function(e){
		var slide = e.target;

		//Hide/show page-switcher buttons if neccessary
		V.ViewerAdapter.decideIfPageSwitcher();
		
		setTimeout(function(){
			if($(slide).hasClass('object')){
				V.ObjectPlayer.loadObject($(slide));
			}
			if($(e.target).hasClass('snapshot')){
        		V.SnapshotPlayer.loadSnapshot($(slide));
			}
		},500);

		// if(VISH.Status.getDevice().mobile){
		// 	V.ImagePlayer.reloadGifs($(slide));
		// }
		
		V.VideoPlayer.HTML5.playVideos(e.target);

		if($(e.target).hasClass("flashcard_slide")){
			V.Flashcard.startAnimation(e.target.id);
		}
	};

	/**
	 * Private function that is called when we leave the slide
	 * Unload objects and stop flashcards
	 */
	var _onslideleave = function(e){
		var slide = e.target;

		if($(slide).hasClass('object')){
			V.ObjectPlayer.unloadObject($(slide));
		}
		if($(slide).hasClass('snapshot')){
    		V.SnapshotPlayer.unloadSnapshot($(slide));
  		}

		V.VideoPlayer.HTML5.stopVideos(slide);

		if($(e.target).hasClass("flashcard_slide")){
			V.Flashcard.stopAnimation(e.target.id);
		}
	};

	

	/**
	 * function to update the number that indicates what slide is diplayed
	 * with this format: 1/12 2/12
	 */
	var updateSlideCounter = function(){
		var number_of_slides = V.Slides.getSlides().length;
		var slide_number = VISH.Slides.getCurrentSlideNumber();
		if(number_of_slides===0){
			slide_number=0;
		}
		$("#slide-counter").html(slide_number + "/" + number_of_slides);	
	};
	
	var getCurrentPresentation = function(){
		return current_presentation;
	};


	var getPresentationType = function(){
		return presentationType;
	};

	var setPresentationType = function(type){
		if(!type){
			type = VISH.Constant.STANDARD;
		}
		presentationType = type;
	};

	return {
		init          			: init,
		getStatus     			: getStatus,
		updateStatus  			: updateStatus,
		addEnterLeaveEvents  	: addEnterLeaveEvents,
		toggleFullScreen 		: toggleFullScreen, 
		getOptions				: getOptions,
		updateSlideCounter		: updateSlideCounter,
		getCurrentPresentation	: getCurrentPresentation,
		getPresentationType		: getPresentationType,
		setPresentationType		: setPresentationType
	};

}) (VISH,jQuery);