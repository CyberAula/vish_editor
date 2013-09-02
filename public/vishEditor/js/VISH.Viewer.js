VISH.Viewer = (function(V,$,undefined){

	//Initial options
	var initOptions;
	//Pointer to the current presentation
	var current_presentation;


	/**
	 * Function to initialize the Viewer, saves the slides object and init the presentation with it
	 * options is a hash with params and options from the server.
	 */
	var init = function(options, presentation){
		V.Editing = false;
		
		V.Debugging.init(options);

		if(options){
			initOptions = options;
		} else {
			initOptions = {};
		}
		
		if((options)&&(options["configuration"])&&(V.Configuration)){
			V.Configuration.init(options["configuration"]);
		}

		if(V.Debugging.isDevelopping()){
			if ((options["configuration"]["mode"]===V.Constant.NOSERVER)&&(!presentation)&&(V.Debugging.getPresentationSamples()!==null)) {
			 	presentation = V.Debugging.getPresentationSamples();
			}
		}

		V.Debugging.log("\n\nViSH Viewer init with presentation:\n"); 
		V.Debugging.log(JSON.stringify(presentation));

		V.Utils.init();
		presentation = V.Utils.fixPresentation(presentation);
		if(presentation===null){
			V.Utils.showPNotValidDialog();
			return;
		}
		current_presentation = presentation;
		
		V.Status.init(function(){
			//Status loading finishes
			_initAferStatusLoaded(options,presentation);
		});
	};

	var _initAferStatusLoaded = function(options,presentation){	
		V.Flashcard.init();
		V.VirtualTour.init();
		V.Quiz.initBeforeRender(presentation);
		V.Renderer.init();
		V.Slides.init();
		V.Utils.Loader.loadDeviceCSS();
		V.User.init(options);
		V.Storage.init();
		V.Recommendations.init(options);
		V.Events.init();
		V.EventsNotifier.init();
	  	V.VideoPlayer.init();
		V.Themes.loadTheme(presentation.theme);
		V.Presentation.init(presentation.slides);
		V.Quiz.init();

		//Init Vish Editor Addons
		if(options.addons){
			V.Addons.init(options.addons);
		}

		V.ViewerAdapter.init(options); //Also init texts

		if(V.Slides.getCurrentSlideNumber()>0){
			V.Slides.triggerEnterEventById($(V.Slides.getCurrentSlide()).attr("id"));
		}

		if(!V.Status.getIsEmbed()){
			//Try to win focus
			window.focus();
		}
	}


	/**
	 * Function to enter and exit fullscreen
	 */
	var toggleFullScreen = function () {
		if(V.Status.isSlaveMode()){
			return;
		}

		if(V.Status.getIsInIframe()){
			var myDoc = parent.document;
			var myElem = V.Status.getIframe();
		} else {
			var myDoc = document;
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
	
	
	var getOptions = function(){	
		return initOptions;
	};

	/**
	* Function called when entering slide in viewer, we have to show the objects
	*/
	var onSlideEnterViewer = function(e){
		var slide = e.target;
		var slideType = $(e.target).attr("type");
		var cSlideNumber = V.Slides.getCurrentSlideNumber();

		//Hide/show page-switcher buttons if neccessary
		V.ViewerAdapter.decideIfPageSwitcher();
		
		setTimeout(function(){
			if(cSlideNumber!==V.Slides.getCurrentSlideNumber()){
				//Prevent objects to load when the slide isn't focused
				return;
			}
			if($(slide).hasClass(V.Constant.OBJECT)){
				V.ObjectPlayer.loadObject($(slide));
			}
			if($(slide).hasClass(V.Constant.SNAPSHOT)){
				V.SnapshotPlayer.loadSnapshot($(slide));
			}
		},500);

		// if(V.Status.getDevice().mobile){
		// 	V.ImagePlayer.reloadGifs($(slide));
		// }
		
		V.VideoPlayer.HTML5.playVideos(slide);

		if(slideType===V.Constant.FLASHCARD){
			V.Flashcard.startAnimation(slide.id);
		} else if(slideType===V.Constant.VTOUR){
			V.VirtualTour.loadVirtualTour(slide.id);
		}

		if(_isRecommendationMoment()){
			V.Recommendations.generateFancybox();
		}
	};	

	/**
	* Function called when leaving a slide in viewer
	*/
	var onSlideLeaveViewer = function(e){
		var slide = e.target;
		var slideType = $(e.target).attr("type");

		if($(slide).hasClass(V.Constant.OBJECT)){
			V.ObjectPlayer.unloadObject($(slide));
		}
		if($(slide).hasClass(V.Constant.SNAPSHOT)){
			V.SnapshotPlayer.unloadSnapshot($(slide));
		}

		V.VideoPlayer.HTML5.stopVideos(slide);

		if(slideType===V.Constant.FLASHCARD){
			V.Flashcard.stopAnimation(slide.id);
		} else if(slideType===V.Constant.VTOUR){
			V.VirtualTour.unloadVirtualTour(slide.id);
		}
	};

	/**
	 * function to check if this is the penultimate Slide (or the only one) and call to get the recommendations
	 */
	var _isRecommendationMoment = function(){
		var number_of_slides = V.Slides.getSlides().length;
		var slide_number = V.Slides.getCurrentSlideNumber();

		if(number_of_slides===1 || slide_number===(number_of_slides-1)){
			return true;
		} else {
			return false;
		}
	};
	
	
	/**
	 * function to update the number that indicates what slide is diplayed
	 * with this format: 1/12 2/12
	 */
	var updateSlideCounter = function(){
		var number_of_slides = V.Slides.getSlides().length;
		var slide_number = V.Slides.getCurrentSlideNumber();
		if(number_of_slides===0){
			slide_number = 0;
		}
		$("#slide-counter-input").val(slide_number);
		$("#slide-counter-span").html("/" + number_of_slides);
	};
	
	var getCurrentPresentation = function(){
		return current_presentation;
	};

	var getPresentationType = function(){
		return getCurrentPresentation().type;
	};

	return {
		init 					: init,
		toggleFullScreen 		: toggleFullScreen, 
		getOptions				: getOptions,
		updateSlideCounter		: updateSlideCounter,
		getCurrentPresentation	: getCurrentPresentation,
		getPresentationType		: getPresentationType,
		onSlideEnterViewer		: onSlideEnterViewer,
		onSlideLeaveViewer		: onSlideLeaveViewer
	};

}) (VISH,jQuery);