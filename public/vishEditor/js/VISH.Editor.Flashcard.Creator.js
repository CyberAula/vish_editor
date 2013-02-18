VISH.Editor.Flashcard.Creator = (function(V,$,undefined){

	//Point to current flashcard.
	//Singleton: Only one flashcard can be edited in a Vish Editor instance.
	var flashcardId;
	//Point to the current pois
	var currentPois = undefined;

	var init = function(){
		flashcardId = null;
	};

	var getCurrentFlashcardId = function(){
		return flashcardId;
	}

	/*
	 * Switch to Flashcard creator in order to allow the creation of a new flashcard
	 * using the current slides
	 */
	var switchToFlashcard = function(){
		loadFlashcard();
		//change thumbnail onclick event (preview slide instead of go to edit it)
		//it will change itself depending on presentationType, also remove drag and drop to order slides
		//also a _redrawPois functions is passed to show the pois, do them draggables, etc
		V.Editor.Thumbnails.redrawThumbnails();
		V.Editor.Tools.init();
	};

	/*
	 * Method to call before leave the flashcard mode
	 * Store the current pois.
	 */
	var onLeaveFlashcardMode = function(){
		currentPois = _getCurrentPois();
		$("#flashcard-background").hide();
	}

	/*
	 * Load a flashcard in the creator mode
	 * @presentation must be undefined for new flashcard, or a previous flashcard
	 * (presentation[type='flashcard']) if we are editing an existing flashcard
	 */
	var loadFlashcard = function(presentation){
		V.Editor.setPresentationType(V.Constant.FLASHCARD);
		
		V.Editor.Slides.hideSlides();

		//Show flashcard background
		$("#flashcard-background").show();

		if(presentation){
			//If we are editing an existing flashcard
			var flashcard = presentation.slides[0];
			flashcardId = flashcard.id;
			$("#flashcard-background").attr("flashcard_id", flashcardId);
			$("#flashcard-background").css("background-image", flashcard.background);
			$("#fc_change_bg_big").hide();
		} else {
			//Create new flashcard
			if(!getCurrentFlashcardId()){
				flashcardId = V.Utils.getId("article");
			}
			$("#flashcard-background").attr("flashcard_id", getCurrentFlashcardId());
		}
		$("#flashcard-background").droppable();  //to accept the pois
	};

	/*
	 * Callback from the V.Editor.Image module to add the background
	 */
	var onBackgroundSelected = function(contentToAdd){
		$("#flashcard-background").css("background-image", "url("+contentToAdd+")");
		$("#fc_change_bg_big").hide();
		$.fancybox.close();
	}

	
	/*
	 * Redraw the pois of the flashcard
	 * This actions must be called after thumbnails have been rewritten
	 */
	var redrawPois = function(){
		//Show draggable items to create the flashcard
		$(".draggable_arrow_div").show();
		//Apply them the style to get the previous position
		_applyStyleToPois();

		$(".draggable_arrow_div").draggable({
			revert: "invalid",   //poi will return to original position if not dropped on the background
			stop: function(event, ui) { 
				//change the moved attribute of the poi, and change it to position absolute
				//check if inside background
				if($(event.target).offset().top > 50 && $(event.target).offset().top < 600 && $(event.target).offset().left > 55 && $(event.target).offset().left < 805){
					$(event.target).attr("moved", "true");
					//change to position absolute
					var old_pos = $(event.target).offset();
					$(event.target).css("position", "fixed");
					$(event.target).css("top", (old_pos.top +30) + "px");
					$(event.target).css("left", (old_pos.left -16) + "px");
				} else {
					$(event.target).attr("moved", "false");
					//change to position relative so it moves with the carrousel
					var old_pos = $(event.target).offset();
					$(event.target).css("position", "relative");
					$(event.target).css("top", "auto");
					$(event.target).css("left", "auto");
				}
			}
		});
		$(".carrousel_element_single_row_slides").droppable();
		$(".image_carousel").css("overflow", "visible");
		$("#menubar").css("z-index", "1075");
		$(".draggable_arrow_div").css("z-index", "1075");
	};

	var _applyStyleToPois = function(){
		if(typeof currentPois === "undefined"){
			//We are loading a flascard, get the pois from the flashcard
			var presentation = V.Editor.getPresentation();
			if(presentation && presentation.slides && presentation.slides[0] && presentation.slides[0].pois){
				currentPois = presentation.slides[0].pois;
			} else {
				return;
			}
		}

		if(typeof currentPois !== "undefined"){
			$.each(currentPois, function(index, val) { 
				$("#" + val.id).css("position", "fixed");
				$("#" + val.id).offset({ top: 600*parseInt(val.y)/100 + 75, left: 800*parseInt(val.x)/100 + 55});
				$("#" + val.id).attr("moved", "true");
			});
		}
	};

	/*
	 * Returns the array of pois to be stored in the JSON
	 * Pois are nested!
	 */
	var getPois = function(){
		var pois = [];
		$(".draggable_arrow_div[moved='true']").each(function(index,s){
			pois[index]= {};
			pois[index].id = V.Utils.getId(getCurrentFlashcardId()+"_"+s.id,true);
			pois[index].x = (100*($(s).offset().left - 48)/800).toString(); //to be relative to his parent, the flashcard-background
			pois[index].y = (100*($(s).offset().top - 38)/600).toString(); //to be relative to his parent, the flashcard-background
			pois[index].slide_id = V.Utils.getId(getCurrentFlashcardId()+"_"+$(s).attr('slide_id'),true);
		});
		return pois;
	};

	/*
	 * Return the current array of pois, without nesting.
	 * The id matches the id of the DOM element.
	 */
	var _getCurrentPois = function(){
		var pois = [];
		$(".draggable_arrow_div[moved='true']").each(function(index,s){
			pois[index]= {};
			pois[index].id = s.id;
			pois[index].x = (100*($(s).offset().left - 48)/800).toString(); //to be relative to his parent, the flashcard-background
			pois[index].y = (100*($(s).offset().top - 38)/600).toString(); //to be relative to his parent, the flashcard-background
			pois[index].slide_id = $(s).attr('slide_id');
		});
		return pois;
	};

	var hidePois = function(){
		$(".draggable_arrow_div").hide();
	};

	var hasPoiInBackground = function(){
		return $(".draggable_arrow_div[moved='true']").length > 0;
	};

	var hasChangedBackground = function(){
		if($("#flashcard-background").css("background-image").indexOf("flashcard_initial_background.jpg") != -1){
			return false;
		}else{
			return true;
		}
	};

	/*
	 * Carrousel onClick callback
	 */
	var onClickCarrouselElement = function(event){
		switch($(event.target).attr("action")){
			case "plus":
				V.Debugging.log("Show message warning that we are changing to presentation and change");
					$.fancybox(
						$("#message2_form").html(),
						{
							'autoDimensions'	: false,
							'scrolling'			: 'no',
							'width'         	: 550,
							'height'        	: 200,
							'showCloseButton'	: false,
							'padding' 			: 5		
						}
					);
			  break;
			case "goToSlide":
			  	V.Editor.Preview.preview({forcePresentation: true, slideNumberToPreview: parseInt($(event.target).attr("slideNumber"))});
			  break;
			default:
			  break;
		}
	 }


	////////////////////
	// JSON Manipulation
	////////////////////

	/*
	 * Prepare slide to nest into a flashcard
	 */
	var prepareToNestInFlashcard = function(slide){
		return V.Editor.Utils.prepareSlideToNest(getCurrentFlashcardId(),slide);
	}

	/*
	 * Revert the nest of the slides into a flashcard
	 */
	var undoNestedSlidesInFlashcard = function(fc){
		fc.slides = _undoNestedSlides(fc.id,fc.slides);
		fc.pois = _undoNestedPois(fc.id,fc.pois);
		return fc;
	}

	var _undoNestedSlides = function(fcId,slides){
		if(slides){
			var sl = slides.length;
			for(var j=0; j<sl; j++){
				slides[j] = V.Editor.Utils.undoNestedSlide(fcId,slides[j]);
			}
		}
		return slides;
	}

	var _undoNestedPois = function(fcId,pois){
		if(pois){
			var lp = pois.length;
			for(var k=0; k<lp; k++){
				pois[k].id = pois[k].id.replace(fcId+"_","");
				pois[k].slide_id = pois[k].slide_id.replace(fcId+"_","");
			}
		}
		return pois;
	}

	return {
		init 				 		: init,
		getCurrentFlashcardId		: getCurrentFlashcardId,
		switchToFlashcard	 		: switchToFlashcard,
		onLeaveFlashcardMode 		: onLeaveFlashcardMode,
		loadFlashcard		 		: loadFlashcard,
		onBackgroundSelected		: onBackgroundSelected,
		redrawPois 			 		: redrawPois,
		getPois			 			: getPois,
		hidePois			 		: hidePois,
		hasChangedBackground 		: hasChangedBackground,
		hasPoiInBackground	 		: hasPoiInBackground,
		onClickCarrouselElement 	: onClickCarrouselElement,
		prepareToNestInFlashcard 	: prepareToNestInFlashcard,
		undoNestedSlidesInFlashcard : undoNestedSlidesInFlashcard
	};

}) (VISH, jQuery);