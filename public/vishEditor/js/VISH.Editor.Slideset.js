/*
 * Utils for Slideset
 * Common functionalities for:
 * -> Flashcards
 * -> Virtual Tours
 */
VISH.Editor.Slideset = (function(V,$,undefined){

	var initialized = false;

	var init = function(){
		if(initialized){
			return;
		}
		//Initialize module

		initialized = true;
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

	/*
	 * Update UI when enter in a slideset
	 */
	var onEnterSlideset = function(slideset){
		var slidesetCreator = getCreatorModule($(slideset).attr("type"));
		if(typeof slidesetCreator.loadSlideset == "function"){
			slidesetCreator.loadSlideset(slideset);
		}
	}

	/*
	 * Update UI when leave from a slideset
	 */
	var onLeaveSlideset = function(slideset){
		var slidesetCreator = getCreatorModule($(slideset).attr("type"));
		if(typeof slidesetCreator.unloadSlideset == "function"){
			slidesetCreator.unloadSlideset(slideset);
		}
	}

	/*
	 * Module to create slidesets
	 * Obj: slide or slide type
	 */
	var getCreatorModule = function(obj){
		type = _getTypeIfPresent(obj);
		switch(type){
			case V.Constant.FLASHCARD:
				return V.Editor.Flashcard.Creator;
				break;
			case V.Constant.VTOUR:
				return V.Editor.VirtualTour.Creator;
				break;
			default:
				return null;
		}
	}

	/*
	 * Module to insert and manage the inserted slidesets
	 * Not use in the creator process
	 */
	var getModule = function(type){
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




	////////////////
	// DEPRECATED
	////////////////

	/*
	 * Nest slides into a slideset
	 */
	var prepareToNest = function(subslide){
		//TODO: get real slidesetId
		return V.Editor.Utils.prepareSlideToNest("slidesetId",subslide);
	}

	/*
	 * Revert the nest of the slides into a slideset
	 */
	var undoNestedSlides = function(slideset){
		slideset.slides = _undoNestedSlides(slideset.id,slideset.slides);
		slideset.pois = _undoNestedPois(slideset.id,slideset.pois);
		return slideset;
	}

	var _undoNestedSlides = function(slidesetId,slides){
		if(slides){
			var sl = slides.length;
			for(var j=0; j<sl; j++){
				slides[j] = V.Editor.Utils.undoNestedSlide(slidesetId,slides[j]);
			}
		}
		return slides;
	}

	var _undoNestedPois = function(slidesetId,pois){
		if(pois){
			var lp = pois.length;
			for(var k=0; k<lp; k++){
				pois[k].id = pois[k].id.replace(slidesetId+"_","");
				pois[k].slide_id = pois[k].slide_id.replace(slidesetId+"_","");
			}
		}
		return pois;
	}

	return {
		init 				: init,
		isSlideset			: isSlideset,
		getCreatorModule	: getCreatorModule,
		getModule			: getModule,
		onEnterSlideset		: onEnterSlideset,
		onLeaveSlideset		: onLeaveSlideset,
		prepareToNest		: prepareToNest,
		undoNestedSlides	: undoNestedSlides
	};

}) (VISH, jQuery);