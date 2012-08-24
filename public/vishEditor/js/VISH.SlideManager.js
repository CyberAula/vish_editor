VISH.SlideManager = (function(V,$,undefined){
	var initOptions;
	var mySlides = null;   //object with the slides to get the content to represent
	var slideStatus = {};  //array to save the status of each slide
	var myDoc; //to store document or parent.document depending if on iframe or not
	
	var user = {}; //{username: "user_name", role:"none"} role: none, logged, student
	var status = {}; //{token: "token", quiz_active_session_id:"4" } quiz_active_session_id : number, false
	
	
	/**
	 * Function to initialize the SlideManager, saves the slides object and init the excursion with it
	 * options is a hash with params and options from the server, example of full options hash:
	 * {"quiz_active_session_id": "7", "token"; "453452453", "username":"ebarra", "postPath": "/quiz.json", "lang": "es"}
	 */
	var init = function(options, excursion){

		V.Slides.init();
		V.Status.init();

		//first set VISH.Editing to false
		VISH.Editing = false;
		V.Debugging.log("Vish.SlideManager: options [username]= " + options['username'] + ", [token]=" + options['token'], + " [quiz_active_session_id]= " + options['quiz_active_session_id']);
		//Quiz_id is different of quiz_session_id !!	
		initOptions = options;

		if((options)&&(options["configuration"])&&(VISH.Configuration)){
			VISH.Configuration.init(options["configuration"]);
		}

		if((options['developping']===true)&&(VISH.Debugging)){

			  VISH.Debugging.init(true);
		} else {
			 VISH.Debugging.init(false);
		}
	
	    //fixing editor mode when save an excursion
		if(options['username']) {
			
			user.username = options['username'];
			user.role  = "logged";
			if(options['token']){
				status.token = options['token'];
			
				if(options['quiz_active_session_id']) {
					status.quiz_active_session_id = options['quiz_active_session_id'];
				} 
				//when logged + token but no quiz_active_session_id
				else { 
				//must be false
				status.quiz_active_session_id = options['quiz_active_session_id']; 
				}			
			
			}
			//no token ( when? ) but logged 
			else {
			
				status.token = "";
				//logged, no token but quiz_active_session_id .... ?
				if(options['quiz_active_session_id']) {
					 	
					status.quiz_active_session_id = options['quiz_active_session_id'];
				
				}
			}
			
		}  //no username 
		else {
		
			user.username=""; //so no token
			status.token=""; 
			
			//no username but quiz active --> (student) 
			if(options['quiz_active_session_id']) {
				V.Debugging.log("options quiz_active_session_id value is: " + options['quiz_active_session_id']);
		 		user.role= "student";
				status.quiz_active_session_id = options['quiz_active_session_id'];
			}
		//no username no quiz active --> (none)
			else {
				
		 		user.role= "none";
		 		status.quiz_active_session_id = options['quiz_active_session_id'];
		 	} 
		
		 }	
		
		// VISH.Debugging.log("(SlideManager)username: " + user.username);
		// VISH.Debugging.log("(SlideManager)role: " + user.role);
		 
		 
		mySlides = excursion.slides;
		V.Excursion.init(mySlides);
		V.ViewerAdapter.setupSize(false);
						
		
				
		$(window).on('orientationchange',function(){
      		V.ViewerAdapter.setupSize();      
    	});
		
		if (V.Status.features.fullscreen) {  
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
		
	
		if (!V.Status.ua.mobile) {
    		//show page counter (only for desktop, in mobile the slides are passed touching)
    		$("#viewbar").show();
    		updateSlideCounter();
		}
		else{
			window.addEventListener("load", function(){ if(!window.pageYOffset){ _hideAddressBar(); } } );
			window.addEventListener("orientationchange", _hideAddressBar );
		}
	};

	
	/**
	 * function to enter and exit fullscreen
	 * the main difficulty here is to detect if we are in the iframe or in a full page outside the iframe
	 */
	var toggleFullScreen = function () {

		var myElem = myDoc.getElementById('excursion_iframe'); //excursion_iframe is the iframe id and the body id
		
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
	/*
	 * to get the user js object
	 */
	
	var getUser = function(){
		
		return user;
	};
	
		/*
	 * to get the user's status js object
	 */
	
	var getUserStatus = function(){
		
		return status;
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
	 * function to update the number that indicates what slide is diplayed
	 * with this format: 1/12 2/12
	 */
	var updateSlideCounter = function(){
		var number_of_slides = V.slideEls.length;
		var slide_number = V.curSlide + 1;
		$("#slide-counter").html(slide_number + "/" + number_of_slides);	
	};


  /*
   * added by KIKE to hide the address bar after loading
   */
  var _hideAddressBar = function()
  { 
    VISH.Debugging.log("TODO method hideAddressBar in slides.js");
        /*
        if(document.height < window.outerHeight)
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
	
	

	return {
		init          			: init,
		getStatus     			: getStatus,
		updateStatus  			: updateStatus,
		addEnterLeaveEvents  	:  addEnterLeaveEvents,
		toggleFullScreen 		: toggleFullScreen, 
		getUser					: getUser, 
		getUserStatus			: getUserStatus,
		updateSlideCounter		: updateSlideCounter
	};

}) (VISH,jQuery);