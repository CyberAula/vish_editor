VISH.Presentation = (function(V,undefined){
	var mySlides = null;
	
	/**
	 * Function to initialize the presentation
	 * Initialize renderer and call it to render each slide
	 */
	var init = function(slides,callback){
		mySlides = slides;
		V.Renderer.init();

		for(var i=0;i<slides.length;i++){
			V.Renderer.renderSlide(slides[i]);
		}

		if(typeof callback == "function"){
			callback();
		}
	};


	return {
		init: init
	};

}) (VISH);
