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
		
		VISH.Debugging.init(options);

		VISH.Editing = false;

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

		current_presentation = presentation;
		
		V.Quiz.init(presentation);
		V.Slides.init();
		V.Status.init();
		V.Utils.loadDeviceCSS();
		V.User.init(options);
		

		//first action will be to detect what kind of view we have, game, flashcard, presentation
		if(presentation.type ==="game"){
			setPresentationType("game");
			VISH.ViewerAdapter.setupGame(presentation);	
			VISH.Game.registerActions(presentation);		
		} else if(presentation.type === "flashcard"){
			setPresentationType("flashcard");
			VISH.Flashcard.init(presentation);
		}

		//important that events are initialized after presentation type is proccessed
		V.Events.init();
		V.Events.Notifier.init();
	  	
		V.Themes.selectTheme(presentation.theme);
		mySlides = presentation.slides;
		V.Presentation.init(mySlides);
		V.ViewerAdapter.setupSize(false);
		
		$(window).on('orientationchange',function(){
      		V.ViewerAdapter.setupSize();      
    	});
		
		if ((V.Status.getDevice().features.fullscreen)&&(V.Status.getDevice().desktop)) {
			if(V.Status.getIsInIframe()){
				myDoc = parent.document;
			} else {
				myDoc = document;
			}
			$(document).on('click', '#page-fullscreen', toggleFullScreen);
			$(myDoc).on("webkitfullscreenchange mozfullscreenchange fullscreenchange",function(event){
	      		V.ViewerAdapter.setupElements();
	      		//done with a timeout because it did not work well in ubuntu (in Kike's laptop)
	      		setTimeout(function(){
	      			VISH.ViewerAdapter.setupSize(true);
	      			VISH.ViewerAdapter.decideIfPageSwitcher();
	      		}, 400);    
	    	});
		}	else {
		  	$("#page-fullscreen").hide();
		}
		
		if (V.Status.getDevice().desktop) {
    		//show page counter (only for desktop, in mobile the slides are passed touching)
    		$("#viewbar").show();
    		updateSlideCounter();
		} else {
			window.addEventListener("load", function(){ hideAddressBar(); } );
			window.addEventListener("orientationchange", hideAddressBar );		
		}

		V.Quiz.prepareQuiz(presentation);

		if((options)&&(options["preview"])){
			$("div#viewerpreview").show();
		}

		if((!V.Status.getDevice().desktop)&&(!VISH.Status.getIsInIframe())&&(options)&&(options["comeBackUrl"])){
			$("button#closeButton").show();
		}

		//Init Vish Editor Addons
		if(options.addons){
			VISH.Addons.init(options.addons);
		}
	};

	/**
	 * function to enter and exit fullscreen
	 * the main difficulty here is to detect if we are in the iframe or in a full page outside the iframe
	 */
	var toggleFullScreen = function () {

		if(VISH.Events.isSlaveMode()){
			return;
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
	 * If we have a flash object or an applet we load it after 0,5 segs because
	 * if loaded in the first moment it appears outside the screen and do not move with the slide
	 * If we have a flashcard init it
	 */
	var _onslideenter = function(e){
		//hide/show page-switcher buttons if neccessary
		V.ViewerAdapter.decideIfPageSwitcher();
		
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
		V.VideoPlayer.HTML5.playVideos(e.target);
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
		V.VideoPlayer.HTML5.stopVideos(e.target);
		V.ObjectPlayer.unloadObject();
		V.AppletPlayer.unloadApplet();
		if($(e.target).hasClass('flashcard')){				
			V.Mods.fc.player.clear();
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


  /*
   * added by KIKE to hide the address bar after loading
   */
  var hideAddressBar = function(){ 
    	VISH.Debugging.log("TODO method hideAddressBar in slides.js");
        /*
        if(document.body.style.height < window.outerHeight)
        {
            document.body.style.height = (window.outerHeight + 50) + 'px';
            VISH.Debugging.log("height " + document.body.style.height);
        }

        setTimeout( function(){ 
          VISH.Debugging.log("scroll");
          window.scrollTo(0, 1); 
          }, 50 );
		*/
  };
	
	var getCurrentPresentation = function(){
		return current_presentation;
	};


	var getPresentationType = function(){
		return presentationType;
	};

	var setPresentationType = function(type){
		presentationType = type;
	};

	return {
		init          			: init,
		getStatus     			: getStatus,
		updateStatus  			: updateStatus,
		addEnterLeaveEvents  	: addEnterLeaveEvents,
		hideAddressBar			: hideAddressBar,
		toggleFullScreen 		: toggleFullScreen, 
		getOptions				: getOptions,
		updateSlideCounter		: updateSlideCounter,
		getCurrentPresentation	: getCurrentPresentation,
		getPresentationType		: getPresentationType,
		setPresentationType		: setPresentationType
	};

}) (VISH,jQuery);