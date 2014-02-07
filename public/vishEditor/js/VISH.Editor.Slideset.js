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
		type = V.Slideset.getSlidesetType(obj);
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
	};

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

	var getCurrentSubslide = function(){
		return currentSubslide;
	};

	var setCurrentSubslide = function(newSubslide){
		currentSubslide = newSubslide;
	};

	var getSubslidesQuantity = function(slideset){
		return $(slideset).children("article").length;
	};


	/////////////////
	// Callbacks
	////////////////

	/*
	 * Update UI when enter in a slideset
	 */
	var onEnterSlideset = function(slideset){
		V.Editor.Slides.updateThumbnail(slideset);
		$("#bottomside").show();
		
		var slidesetCreator = getCreatorModule($(slideset).attr("type"));
		var slidesetId = $(slideset).attr("id");
		var subslides = $("#" + slidesetId + " > article");

		if(typeof slidesetCreator.onEnterSlideset == "function"){
			slidesetCreator.onEnterSlideset(slideset);
		}
		openSlideset(slideset);

		V.Editor.Thumbnails.drawSlidesetThumbnails(subslides,function(){
			//Subslides Thumbnails drawed succesfully
		});
	};

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
		$("#slideset_selected > img").attr("src","");

		var slidesetCreator = getCreatorModule($(slideset).attr("type"));
		if(typeof slidesetCreator.onLeaveSlideset == "function"){
			slidesetCreator.onLeaveSlideset(slideset);
		}
	};

	var openSlideset = function(slideset){
		//Show slideset delete and help buttons
		_showSlideButtons(slideset);

		//Mark slideset thumbnail as selected
		$("#slideset_selected_img").addClass("selectedSlidesetThumbnail");

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
	};

	var closeSlideset = function(slideset){
		//Hide slideset delete and help buttons
		_hideSlideButtons(slideset);

		//Mark slideset thumbnail as unselected
		$("#slideset_selected_img").removeClass("selectedSlidesetThumbnail");

		//Unload slideset
		var slidesetCreator = getCreatorModule($(slideset).attr("type"));

		if(typeof slidesetCreator.unloadSlideset == "function"){
			slidesetCreator.unloadSlideset(slideset);
		}
	};

	var beforeCreateSlidesetThumbnails = function(){
		var slideset = V.Slides.getCurrentSlide();
		if(V.Slideset.isSlideset(slideset)){
			var slidesetCreator = getCreatorModule(slideset);
			if(typeof slidesetCreator.beforeCreateSlidesetThumbnails == "function"){
				slidesetCreator.beforeCreateSlidesetThumbnails(slideset);
			}
		}
	};

	var beforeRemoveSlideset = function(slideset){
		onLeaveSlideset(slideset);
		var slidesetCreator = getCreatorModule($(slideset).attr("type"));
		if(typeof slidesetCreator.beforeRemoveSlideset == "function"){
			slidesetCreator.beforeRemoveSlideset(slideset);
		}
	};

	var beforeRemoveSubslide = function(slideset,subslide){
		closeSubslide(subslide);
		var slidesetCreator = getCreatorModule($(slideset).attr("type"));
		if(typeof slidesetCreator.beforeRemoveSubslide == "function"){
			slidesetCreator.beforeRemoveSubslide(slideset,subslide);
		}
	};


	/////////////////
	// Methods
	////////////////

	var openSubslideWithNumber = function(subslideNumber){
		var slideset = V.Slides.getCurrentSlide();
		var subslides = $(slideset).find("article");
		var subslide = subslides[subslideNumber-1];
		openSubslide(subslide);
	};

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
	};

	var _showSubslide = function(subslide){
		$(subslide).css("display","block");
	};

	var _hideSubslide = function(subslide){
		$(subslide).css("display","none");
	};

	var closeSubslideWithNumber = function(subslideNumber){
		var slideset = V.Slides.getCurrentSlide();
		var subslides = $(slideset).find("article");
		var subslide = subslides[subslideNumber-1];
		closeSubslide(subslide);
	};

	var closeSubslide = function(subslide){
		setCurrentSubslide(null);
		V.Editor.Thumbnails.selectSubslideThumbnail(null);
		_hideSubslide(subslide);
		V.Slides.triggerLeaveEventById($(subslide).attr("id"));
	};

	var _showSlideButtons = function(slide){
		$(slide).find("div.delete_slide:first").show();
		$(slide).find("img.help_in_slide:first").show();
	};

	var _hideSlideButtons = function(slide){
		$(slide).find("div.delete_slide:first").hide();
		$(slide).find("img.help_in_slide:first").hide();
	};


	/////////////////
	// Events
	////////////////

	var onClickOpenSlideset = function(){
		var slideset = V.Slides.getCurrentSlide();
		openSlideset(slideset);
	};

	return {
		init 							: init,
		getCreatorModule				: getCreatorModule,
		getDummy						: getDummy,
		onEnterSlideset					: onEnterSlideset,
		onLeaveSlideset					: onLeaveSlideset,
		openSlideset					: openSlideset,
		closeSlideset					: closeSlideset,
		beforeCreateSlidesetThumbnails	: beforeCreateSlidesetThumbnails,
		beforeRemoveSlideset			: beforeRemoveSlideset,
		beforeRemoveSubslide			: beforeRemoveSubslide,
		getCurrentSubslide				: getCurrentSubslide,
		openSubslideWithNumber 			: openSubslideWithNumber,
		openSubslide					: openSubslide,
		closeSubslideWithNumber			: closeSubslideWithNumber,
		closeSubslide 					: closeSubslide,
		onClickOpenSlideset				: onClickOpenSlideset,
		getSubslidesQuantity			: getSubslidesQuantity
	};

}) (VISH, jQuery);