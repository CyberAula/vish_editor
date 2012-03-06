VISH.Excursion = (function(V,undefined){
	var mySlides = null;
	
	var init = function(slides){
		mySlides = slides;		
		V.Renderer.init();

		for(var i=0;i<slides.length;i++){
			V.Renderer.renderSlide(slides[i]);			
		}
		//TODO preload all content of the excursion

		_finishRenderer();
	};

	var _finishRenderer = function(){		
		for(var i=0;i<mySlides.length;i++){
			for(var num=0;num<mySlides[i].elements.length;num++){
				if(mySlides[i].elements[num].type === "flashcard"){					
					var flashcard = JSON.parse(mySlides[i].elements[num].jsoncontent);
					//uncomment when it is only one script
					//$.getScript(mySlides[i].elements[num].js,function(){
						//preload content for the flashcard
						V.Mods.fc.loader.init(flashcard);
					//});
				}
			}
		}
		
		
		//$.getScript('js/slides.js',function(){
		var evt = document.createEvent("Event");
		evt.initEvent("OURDOMContentLoaded", false, true); // event type,bubbling,cancelable
		document.dispatchEvent(evt);	
		//});		
	};

	return {
		init: init
	};

}) (VISH);
