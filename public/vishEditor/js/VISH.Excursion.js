VISH.Excursion = (function(V,undefined){
	var mySlides = null;
	
	/**
	 * Function to initialize the excursion
	 * Initialize renderer and call it to render each slide
	 */
	var init = function(slides){
		
		mySlides = slides;		
		V.Renderer.init();

		for(var i=0;i<slides.length;i++){
			V.Renderer.renderSlide(slides[i]);			
		}
		//TODO preload all content of the excursion

		_finishRenderer();
	};

	/**
	 * Private function called when we have finished rendering the slides (the html now have everything and the slides.js can be started)
	 * Cover all the slides array to preload the flashcards content
	 * Finally dispatch the event OURDOMContentLoaded that will start the slides.js script adding all the keys events and everything for the presentation to run
	 */
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
				
				/*
				*it is added some functions later the elements be loaded 
				*  */
				else if(mySlides[i].elements[num].type === "mcquestion") {
 
					
				    //param number of slide? and number of elements 
					VISH.Quiz.enableInteraction(mySlides[i].id.toString(), mySlides[i].elements[num].options.length);
					
					
				}
				else if (mySlides[i].elements[num].type === "truefalsequestion") {
				//number of slide and number of true/false questions 
				VISH.Quiz.enableTrueFalseInteraction(mySlides[i].id.toString(), mySlides[i].elements[num].questions.length);
					
				}
			}
		}
		
		V.VideoPlayer.setVideoTagEvents();
		
		V.SlideManager.addEnterLeaveEvents();
		
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
