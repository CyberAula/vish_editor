VISH.Presentation = (function(V,undefined){
	var mySlides = null;
	
	/**
	 * Function to initialize the presentation
	 * Initialize renderer and call it to render each slide
	 */
	var init = function(slides){
		mySlides = slides;		
		V.Renderer.init();

		for(var i=0;i<slides.length;i++){
			V.Renderer.renderSlide(slides[i]);			
		}

		_finishRenderer();
	};

	/**
	 * Private function called when we have finished rendering the slides
	 */
	var _finishRenderer = function(){
		V.VideoPlayer.HTML5.setVideoEvents();
		V.SlideManager.addEnterLeaveEvents();
		V.Slides.updateSlides();
	};

	return {
		init: init
	};

}) (VISH);
