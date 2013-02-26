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
		//Initialize
	};

	/*
	 * Type: slide or presentation type
	 */
	var isSlideset = function(type){
		return V.Slides.isSlideset(type);
	}

	/*
	 * Type: slide or presentation type
	 */
	var getModule = function(type){
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
	 * Nest slides into a slideset
	 */
	var prepareToNest = function(slide){
		return V.Editor.Utils.prepareSlideToNest(_getIdForSlideSet(V.Editor.getMode()),slide);
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

	var _getIdForSlideSet = function(type){
		switch(type){
			case V.Constant.FLASHCARD:
				return V.Editor.Flashcard.Creator.getId();
				break;
			case V.Constant.VTOUR:
				return V.Editor.VirtualTour.Creator.getId();
				break;
			default:
				return null;
		}
	}

	return {
		init 				: init,
		isSlideset			: isSlideset,
		getModule			: getModule,
		prepareToNest		: prepareToNest,
		undoNestedSlides	: undoNestedSlides
	};

}) (VISH, jQuery);