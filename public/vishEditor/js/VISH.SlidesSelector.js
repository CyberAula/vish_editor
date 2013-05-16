VISH.SlidesSelector = (function(V,$,undefined){
	
	var initialized = false;
	var countIndex;
	var acceptButton;
	var nSlides;
	var slides;

	/*
	 * Use for preview a presentation and select the slides to import into an existing presentation
	 */
	var init = function(){
		if(!initialized){
			countIndex = $("#ssbsp");
			acceptButton = $("#ssbaccept");
			nSlides = V.Slides.getSlidesQuantity();
			slides = [nSlides];
			_acceptAll();
			_updateIndex();

			//Select All
			$("#ssbAll").click(function(event){
				_acceptAll();
				_updateInterface(V.Slides.getCurrentSlideNumber());
				_updateIndex();
			});

			//Unselect All
			$("#ssbuAll").click(function(event){
				_denyAll();
				_updateInterface(V.Slides.getCurrentSlideNumber());
				_updateIndex();
			});

			//Accept and Deny
			$(acceptButton).click(function(event){
				var aIndex = V.Slides.getCurrentSlideNumber()-1;
				if(slides[aIndex] === true){
					//Deny
					slides[aIndex] = false;
				} else {
					//Accept
					slides[aIndex] = true;
				}
				_updateInterface(V.Slides.getCurrentSlideNumber());
				_updateIndex();
			});

			//Done
			$("#ssbdone").click(function(event){
				// V.Debugging.log("Viewer Done: Slides aceptadas");
				// V.Debugging.log(_getAcceptedSlides());
				var params = new Object();
				params.acceptedSlides = _getAcceptedSlides();
				params.JSON = V.SlideManager.getCurrentPresentation();
				V.Messenger.notifyEventByMessage(V.Constant.Event.onSelectedSlides,params);
			});

			V.EventsNotifier.registerCallback(V.Constant.Event.onGoToSlide, function(params){ 
				_updateInterface(params.slideNumber);
			});

			initialized = true;
		}
	};


	_acceptAll = function(){
		for(var i=0; i<nSlides; i++){
			slides[i] = true;
		}
	}

	_denyAll = function(){
		for(var i=0; i<nSlides; i++){
			slides[i] = false;
		}
	}

	_updateIndex = function(){
		var nAcceptedSlides = _getAcceptedSlides().length;
		$(countIndex).html("+"+nAcceptedSlides);
	}

	_getAcceptedSlides = function(){
		var aSlides = [];
		for(var i=0; i<nSlides; i++){
			if(slides[i]){
				aSlides.push(i+1);
			}
		}
		return aSlides;
	}

	_updateInterface = function(slideNumber){
		if(slides[slideNumber-1] === true){
			$(acceptButton).html("Deny");
		} else {
			$(acceptButton).html("Accept");
		}
	}


	return {
		init   : init
	};

}) (VISH,jQuery);