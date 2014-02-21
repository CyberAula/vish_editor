VISH.Slideset = (function(V,$,undefined){

	var _modules;
	var initialized = false;

	var init = function(){
		if(initialized){
			return;
		}
		//Initialize module
		_modules = {};
		_modules[V.Constant.FLASHCARD] = V.Flashcard;
		_modules[V.Constant.VTOUR] = V.VirtualTour;
		_modules[V.Constant.EVIDEO] = V.EVideo;

		for(var slidesetType in _modules){
			var viewerModule = _modules[slidesetType];
			if((typeof viewerModule != "undefined")&&(typeof viewerModule.init == "function")){
				viewerModule.init();
			} 
		}

		initialized = true;
	};

	/*
	 * Module to create slidesets
	 * Obj: slide or slide type
	 */
	var getViewerModule = function(obj){
		return _modules[getSlidesetType(obj)];
	};

	/*
	 * Obj: slide or slide type
	 */
	var isSlideset = function(obj){
		type = getSlidesetType(obj);
		return _isSlidesetType(type);
	};

	var _isSlidesetType = function(type){
		switch(type){
			case V.Constant.FLASHCARD:
			case V.Constant.VTOUR:
			case V.Constant.EVIDEO:
				return true;
			default:
				return false;
		}
	};

	var getSlidesetType = function(obj){
		if(typeof obj == "string"){
			return obj;
		} else if(typeof obj == "object"){
			return $(obj).attr("type");
		} else if((typeof obj != "undefined")&&(typeof obj.type == "string")){
			return obj.type;
		}
		return undefined;
	};

	/////////////////
	// Callbacks
	////////////////

	var draw = function(slidesetJSON){
		var slidesetViewer = getViewerModule(slidesetJSON.type);
		if(typeof slidesetViewer.draw == "function"){
			slidesetViewer.draw(slidesetJSON);
		}
	};

	var onEnterSlideset = function(slideset){
		//Look for opened subslides
		var openSubslides = $(slideset).children("article.show_in_smartcard");
		if(openSubslides.length===1){
			var openSubslide = openSubslides[0];
			var subSlideId = $(openSubslide).attr("id");
			V.Slides.triggerEnterEventById(subSlideId);
		}

		var slidesetViewer = getViewerModule($(slideset).attr("type"));
		if(typeof slidesetViewer.onEnterSlideset == "function"){
			slidesetViewer.onEnterSlideset(slideset);
		}
	};

	var onLeaveSlideset = function(slideset){
		//Look for opened subslides
		var openSubslides = $(slideset).children("article.show_in_smartcard");
		if(openSubslides.length===1){
			var openSubslide = openSubslides[0];
			var subSlideId = $(openSubslide).attr("id");
			V.Slides.triggerLeaveEventById(subSlideId);
		}
		
		var slidesetViewer = getViewerModule($(slideset).attr("type"));
		if(typeof slidesetViewer.onLeaveSlideset == "function"){
			slidesetViewer.onLeaveSlideset(slideset);
		}
	};

	var afterSetupSize = function(increaseW,increaseH){
		for(var slidesetType in _modules){
			var viewerModule = _modules[slidesetType];
			if((typeof viewerModule != "undefined")&&(typeof viewerModule.afterSetupSize == "function")){
				viewerModule.afterSetupSize(increaseW,increaseH);
			} 
		}
	};

	///////////////
	// Events
	///////////////

	var onCloseSubslideClicked = function(event){
		var close_slide_id = event.target.id.substring(5); //the id is close3
		V.Slides.closeSubslide(close_slide_id,true);
	};

	return {
		init 					: init,
		getViewerModule			: getViewerModule,
		isSlideset				: isSlideset,
		getSlidesetType			: getSlidesetType,
		draw					: draw,
		onEnterSlideset			: onEnterSlideset,
		onLeaveSlideset			: onLeaveSlideset,
		onCloseSubslideClicked	: onCloseSubslideClicked,
		afterSetupSize			: afterSetupSize
	};

}) (VISH, jQuery);