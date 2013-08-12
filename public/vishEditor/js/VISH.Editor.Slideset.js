/*
 * Utils for Slideset
 * Common functionalities for:
 * -> Flashcards
 * -> Virtual Tours
 */
VISH.Editor.Slideset = (function(V,$,undefined){

	var initialized = false;

	//Point to the current subslide
	var currentSubslide;

	var init = function(){
		if(initialized){
			return;
		}
		//Initialize module

		initialized = true;
	};

	/*
	 * Module to create slidesets
	 * Obj: slide or slide type
	 */
	var getCreatorModule = function(obj){
		type = _getTypeIfPresent(obj);
		switch(type){
			case V.Constant.FLASHCARD:
				return V.Editor.Flashcard;
				break;
			case V.Constant.VTOUR:
				return V.Editor.VirtualTour;
				break;
			default:
				return null;
		}
	}

	/*
	 * slideset can be the object itself or its type
	 */
	var getDummy = function(slideset,options){
		var slidesetCreator = getCreatorModule(slideset);
		if(typeof slidesetCreator.getDummy == "function"){
			if((!options)||(typeof options.slidesetId != "string")){
				var slidesetId = V.Utils.getId("article");
			} else {
				var slidesetId = options.slidesetId;
			}		
			return slidesetCreator.getDummy(slidesetId,options);
		}
	};

	/*
	 * Obj: slide or slide type
	 */
	var isSlideset = function(obj){
		type = _getTypeIfPresent(obj);
		return V.Slides.isSlideset(type);
	}

	var _getTypeIfPresent = function(obj){
		if(typeof obj == "string"){
			return obj;
		} else if(typeof obj == "object"){
			return $(obj).attr("type");
		}
		return undefined;
	}

	var getCurrentSubslide = function(){
		return currentSubslide;
	};

	var setCurrentSubslide = function(newSubslide){
		currentSubslide = newSubslide;
	};


	/////////////////
	// Callbacks
	////////////////

	/*
	 * Update UI when enter in a slideset
	 */
	var onEnterSlideset = function(slideset){
		updateThumbnails(slideset);
		$("#bottomside").show();
		
		var slidesetCreator = getCreatorModule($(slideset).attr("type"));
		var slidesetId = $(slideset).attr("id");
		var subslides = $("#" + slidesetId + " > article");
		V.Editor.Thumbnails.drawSlidesetThumbnails(subslides,function(){
			if(typeof slidesetCreator.onEnterSlideset == "function"){
				slidesetCreator.onEnterSlideset(slideset);
			}
			//Subslides Thumbnails drawed succesfully
			openSlideset(slideset);
		});

		//Success callback is not called when subslides are 0
		if(subslides.length === 0) {
			if(typeof slidesetCreator.onEnterSlideset == "function"){
				slidesetCreator.onEnterSlideset(slideset);
			}
			openSlideset(slideset);
		}
	}

	/*
	 * Update UI when leave from a slideset
	 */
	var onLeaveSlideset = function(slideset){
		closeSlideset(slideset);

		var currentSubslide = getCurrentSubslide();
		if(currentSubslide){
			closeSubslide(currentSubslide);
		}

		$("#bottomside").hide();
		$("#subslide_selected > img").attr("src","");

		var slidesetCreator = getCreatorModule($(slideset).attr("type"));
		if(typeof slidesetCreator.onLeaveSlideset == "function"){
			slidesetCreator.onLeaveSlideset(slideset);
		}
	}

	var openSlideset = function(slideset){
		//Show slideset delete and help buttons
		_showSlideButtons(slideset);

		var currentSubslide = getCurrentSubslide();
		if(currentSubslide){
			closeSubslide(currentSubslide);
		}

		V.Editor.Tools.loadToolsForSlide(slideset);

		//Load
		var slidesetCreator = getCreatorModule($(slideset).attr("type"));
		if(typeof slidesetCreator.loadSlideset == "function"){
			slidesetCreator.loadSlideset(slideset);
		}
	}

	var closeSlideset = function(slideset){
		//Hide slideset delete and help buttons
		_hideSlideButtons(slideset);

		//Unload slideset
		var slidesetCreator = getCreatorModule($(slideset).attr("type"));

		if(typeof slidesetCreator.unloadSlideset == "function"){
			slidesetCreator.unloadSlideset(slideset);
		}
	}

	var beforeCreateSlidesetThumbnails = function(){
		var slideset = V.Slides.getCurrentSlide();
		if(isSlideset(slideset)){
			var slidesetCreator = getCreatorModule(slideset);
			if(typeof slidesetCreator.beforeCreateSlidesetThumbnails == "function"){
				slidesetCreator.beforeCreateSlidesetThumbnails(slideset);
			}
		}
	}


	/////////////////
	// Methods
	////////////////

	var openSubslideWithNumber = function(subslideNumber){
		var slideset = V.Slides.getCurrentSlide();
		var subslides = $(slideset).find("article");
		var subslide = subslides[subslideNumber-1];
		openSubslide(subslide);
	}

	var openSubslide = function(subslide){
		var currentSubslide = getCurrentSubslide();

		if(currentSubslide){
			closeSubslide(currentSubslide);
		} else {
			var slideset = $(subslide).parent();
			closeSlideset(slideset);
		}

		setCurrentSubslide(subslide);
		_showSubslide(subslide);
		V.Editor.Thumbnails.selectSubslideThumbnail($(subslide).attr("slidenumber"));
		V.Slides.triggerEnterEventById($(subslide).attr("id"));
	}

	var _showSubslide = function(subslide){
		$(subslide).css("display","block");
	}

	var _hideSubslide = function(subslide){
		$(subslide).css("display","none");
	}

	var closeSubslideWithNumber = function(subslideNumber){
		var slideset = V.Slides.getCurrentSlide();
		var subslides = $(slideset).find("article");
		var subslide = subslides[subslideNumber-1];
		closeSubslide(subslide);
	}

	var closeSubslide = function(subslide){
		setCurrentSubslide(null);
		V.Editor.Thumbnails.selectSubslideThumbnail(null);
		_hideSubslide(subslide);
		V.Slides.triggerLeaveEventById($(subslide).attr("id"));
	}

	var _showSlideButtons = function(slide){
		$(slide).find("div.delete_slide:first").show();
		$(slide).find("img.help_in_slide:first").show();
	}

	var _hideSlideButtons = function(slide){
		$(slide).find("div.delete_slide:first").hide();
		$(slide).find("img.help_in_slide:first").hide();
	}

	var updateThumbnails = function(slideset){
		var thumbnailURL = V.Editor.Thumbnails.getThumbnailURL(slideset);
		$("#subslide_selected > img").attr("src",thumbnailURL);
		var slideThumbnail = V.Editor.Thumbnails.getThumbnailForSlide(slideset);
		$(slideThumbnail).attr("src",thumbnailURL);
	}


	/////////////////
	// Events
	////////////////

	var onClickOpenSlideset = function(){
		var slideset = V.Slides.getCurrentSlide();
		openSlideset(slideset);
	}

	return {
		init 					: init,
		isSlideset				: isSlideset,
		getCreatorModule		: getCreatorModule,
		getDummy				: getDummy,
		onEnterSlideset			: onEnterSlideset,
		onLeaveSlideset			: onLeaveSlideset,
		openSlideset			: openSlideset,
		closeSlideset			: closeSlideset,
		getCurrentSubslide		: getCurrentSubslide,
		beforeCreateSlidesetThumbnails	: beforeCreateSlidesetThumbnails,
		openSubslideWithNumber 	: openSubslideWithNumber,
		openSubslide			: openSubslide,
		closeSubslideWithNumber	: closeSubslideWithNumber,
		closeSubslide 			: closeSubslide,
		updateThumbnails		: updateThumbnails,
		onClickOpenSlideset		: onClickOpenSlideset
	};

}) (VISH, jQuery);