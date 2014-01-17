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
			_preloadImages();
			countIndex = $("#ssbsp");
			acceptButton = $("#ssbaccept");
			nSlides = V.Slides.getSlidesQuantity();
			slides = [nSlides];
			_acceptAll();
			_updateIndex();
			_updateAllInterface("accept");

			//Select All
			$("#ssbAll").click(function(event){
				_acceptAll();
				_updateAllInterface("accept");
				_updateButtonValue(V.Slides.getCurrentSlideNumber());
				_updateIndex();
			});

			//Unselect All
			$("#ssbuAll").click(function(event){
				_denyAll();
				_updateAllInterface("deny");
				_updateButtonValue(V.Slides.getCurrentSlideNumber());
				_updateIndex();
			});

			//Accept and Deny
			$(acceptButton).click(function(event){
				var aIndex = V.Slides.getCurrentSlideNumber()-1;
				if(slides[aIndex] === true){
					//Deny
					slides[aIndex] = false;
					_updateOneInterface(V.Slides.getCurrentSlide(), "deny");
				} else {
					//Accept
					slides[aIndex] = true;
					_updateOneInterface(V.Slides.getCurrentSlide(), "accept");
				}
				$("#ssbAll").removeClass("selected_inactive");
				$("#ssbuAll").removeClass("selected_inactive");
				_updateButtonValue(V.Slides.getCurrentSlideNumber());
				_updateIndex();
			});

			//Done
			$("#ssbdone").click(function(event){
				// V.Debugging.log("Viewer Done: Slides aceptadas");
				// V.Debugging.log(_getAcceptedSlides());
				var params = new Object();
				params.acceptedSlides = _getAcceptedSlides();
				params.JSON = V.Viewer.getCurrentPresentation();
				V.Messenger.notifyEventByMessage(V.Constant.Event.onSelectedSlides,params);
			});

			V.EventsNotifier.registerCallback(V.Constant.Event.onGoToSlide, function(params){ 
				_updateButtonValue(params.slideNumber);
			});

			initialized = true;
		}
	};

	_preloadImages = function(){
		$("li.addslidestut img[srctoload]").each(function(index,img){
			$(img).attr("src",$(img).attr("srctoload"));
		});
	};

	_acceptAll = function(){
		for(var i=0; i<nSlides; i++){
			slides[i] = true;
		}
	};

	_denyAll = function(){
		for(var i=0; i<nSlides; i++){
			slides[i] = false;
		}
	};

	_updateIndex = function(){
		var nAcceptedSlides = _getAcceptedSlides().length;
		$(countIndex).html("+"+nAcceptedSlides);
		if(nAcceptedSlides===0){
			$(countIndex).removeClass("selected_n_slides");
			$(countIndex).addClass("selected_zero_slides");
		}
		else{
			$(countIndex).removeClass("selected_zero_slides");
			$(countIndex).addClass("selected_n_slides");
		} 
		$(countIndex).addClass("addslidetrans");
		$(countIndex).addClass("addslidetrans2");
		setTimeout(function(){
			$(countIndex).removeClass("addslidetrans");
			$(countIndex).removeClass("addslidetrans2");
		},800);
	};

	_getAcceptedSlides = function(){
		var aSlides = [];
		for(var i=0; i<nSlides; i++){
			if(slides[i]){
				aSlides.push(i+1);
			}
		}
		return aSlides;
	};

	//params: status can be "accept" or "deny"
	_updateAllInterface = function(status){
		if(status==="accept"){
			$("#ssbAll").addClass("selected_inactive");
			$("#ssbuAll").removeClass("selected_inactive");
		}else{
			$("#ssbuAll").addClass("selected_inactive");
			$("#ssbAll").removeClass("selected_inactive");
		}
		var all_slides = V.Slides.getSlides();
		for (var i = 0; i < all_slides.length; i++) {
			_updateOneInterface(all_slides[i], status);
		};
	};

	//params: the_slide is the slide element, status can be "accept" or "deny"
	_updateOneInterface = function(the_slide, status){
		$(the_slide).removeClass("selected_accept");
		$(the_slide).removeClass("selected_deny");
		$(the_slide).addClass("selected_"+status);
	};

	_updateButtonValue = function(slideNumber){
		var img = $(acceptButton).find("table tr td:nth-child(1) img");
		var span = $(acceptButton).find("table tr td:nth-child(2) span");
		if(slides[slideNumber-1] === true){
			$(img).attr("src",V.ImagesPath+ "quiz/checkbox_wrong.png");
			$(span).text(V.I18n.getTrans("i.UnselectSlide"));
		} else {
			$(img).attr("src",V.ImagesPath+ "quiz/checkbox_checked.png");
			$(span).text(V.I18n.getTrans("i.SelectSlide"));
		}
	};


	return {
		init   : init
	};

}) (VISH,jQuery);