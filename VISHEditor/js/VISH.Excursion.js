VISH.Excursion = (function(V,undefined){
	
	var init = function(slides){
		
		V.Renderer.init();

		for(var i=0;i<slides.length;i++){
			V.Renderer.renderSlide(slides[i]);
		}

		_finishRenderer();
	}

	var _finishRenderer = function(){
		$.getScript('./js/slides.js',function(){
			var evt = document.createEvent("Event");
			evt.initEvent("OURDOMContentLoaded", false, true); // event type,bubbling,cancelable
			document.dispatchEvent(evt);	
		});
	};

	return {
		init: init
	};

}) (VISH);