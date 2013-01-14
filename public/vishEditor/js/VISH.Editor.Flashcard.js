VISH.Editor.Flashcard = (function(V,$,undefined){

	//Point to current flashcard.
	//Singleton: Only one flashcard can be edited in a Vish Editor instance.
	var flashcardId;

	//Var to store the JSON of the inserted flashcards
	var myFlashcards;
	// myFlashcard = myFlashcards['flashcardIdInMyPresentation']

	var init = function(){
		VISH.Editor.Flashcard.Repository.init();
		flashcardId = null;
		myFlashcards = new Array();
	};

	var addFlashcard = function(fc){
		if(typeof myFlashcards !== "undefined"){
			myFlashcards[fc.id] = fc;
		}
	}

	var getFlashcard = function(id){
		if(typeof myFlashcards !== "undefined"){
			return myFlashcards[id];
		}
	}

	var loadFlashcard = function(presentation){
		//first action, set presentation type to "flashcard"
		V.Editor.setPresentationType(VISH.Constant.FLASHCARD);
		
		//hide slides
		V.Editor.Slides.hideSlides();

		//show flashcard background, should be an image with help by default
		$("#flashcard-background").show();
		if(presentation){
			//if we are editing a presentation
			$("#flashcard-background").css("background-image", presentation.slides[0].background);
			$("#fc_change_bg_big").hide();
			flashcardId = presentation.slides[0].id;
			$("#flashcard-background").attr("flashcard_id", flashcardId);
		} else {
			if(!getCurrentFlashcardId()){
				flashcardId = VISH.Utils.getId("article");
			}
			$("#flashcard-background").attr("flashcard_id", getCurrentFlashcardId());
		}
		$("#flashcard-background").droppable();  //to accept the pois
	};

	var switchToFlashcard = function(){
		loadFlashcard();
		//change thumbnail onclick event (preview slide instead of go to edit it)
		//it will change itself depending on presentationType, also remove drag and drop to order slides
		//also a _redrawPois functions is passed to show the pois, do them draggables, etc
		V.Editor.Thumbnails.redrawThumbnails();
		VISH.Editor.Tools.init();
	};

	var onBackgroundSelected = function(contentToAdd){
		$("#flashcard-background").css("background-image", "url("+contentToAdd+")");
		$("#fc_change_bg_big").hide();
		$.fancybox.close();
	}


	//ALL THIS ACTIONS WILL HAVE TO BE CALLED AFTER THE THUMBNAILS HAVE BEEN REWRITTEN
	var redrawPois = function(){
		//show draggable items to create the flashcard
		$(".draggable_arrow_div").show();
		//apply them the style to get the previous position
		_applyStyleToPois();

		$(".draggable_arrow_div").draggable({
			revert: "invalid",   //poi will return to original position if not dropped on the background
			stop: function(event, ui) { //change the moved attribute of the poi, and change it to position absolute
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
					//change to position relative so it moves with the carrusel
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
		var presentation = V.Editor.getPresentation();
		if(presentation && presentation.slides && presentation.slides[0] && presentation.slides[0].pois){
			$.each(presentation.slides[0].pois, function(index, val) { 
  				$("#" + val.id).css("position", "fixed");
  				$("#" + val.id).offset({ top: 600*parseInt(val.y)/100 + 75, left: 800*parseInt(val.x)/100 + 55});
  				$("#" + val.id).attr("moved", "true");
			});
		}
	};

	/*
	 * Returns an array of pois
	 */
	var savePois = function(){
		var pois = [];
		$(".draggable_arrow_div[moved='true']").each(function(index,s){
			pois[index]= {};
			pois[index].id = VISH.Utils.getId(getCurrentFlashcardId()+"_"+s.id,true);
			pois[index].x = (100*($(s).offset().left - 55)/800).toString(); //to be relative to his parent, the flashcard-background
			pois[index].y = (100*($(s).offset().top - 75)/600).toString(); //to be relative to his parent, the flashcard-background
			pois[index].slide_id = VISH.Utils.getId(getCurrentFlashcardId()+"_"+$(s).attr('slide_id'),true);
		});
		return pois;
	};

	var removePois = function(){
		$(".draggable_arrow_div").hide();
	};

	var hasPoiInBackground = function(){
		return $(".draggable_arrow_div[moved='true']").length > 0;
	};

	var hasChangedBackground = function(){
		if($("#flashcard-background").css("background-image").indexOf("flashcard_initial_background.jpg") != -1){
			return false;
		}
		else{
			return true;
		}
	};

	var getCurrentFlashcardId = function(){
		return flashcardId;
	}

	var prepareToNestInFlashcard = function(slide){
		return VISH.Editor.Utils.prepareSlideToNest(getCurrentFlashcardId(),slide);
	}

	var undoNestedSlidesInFlashcard = function(fc){
		fc.slides = _undoNestedSlides(fc.id,fc.slides);
		fc.pois = _undoNestedPois(fc.id,fc.pois);
		return fc;
	}

	var _undoNestedSlides = function(fcId,slides){
		for(var j=0; j<slides.length; j++){
			slides[j] = VISH.Editor.Utils.undoNestedSlide(fcId,slides[j]);
		}
		return slides;
	}

	var _undoNestedPois = function(fcId,pois){
		for(var k=0; k<pois.length; k++){
			pois[k].id = pois[k].id.replace(fcId+"_","");
			pois[k].slide_id = pois[k].slide_id.replace(fcId+"_","");
		}
		return pois;
	}

	var hasFlascards = function(){
		return $("section.slides > .flashcard_slide[type='flashcard']").length>0;
	}

	return {
		init 				 	: init,
		addFlashcard 			: addFlashcard,
		getFlashcard 			: getFlashcard,
		getCurrentFlashcardId 	: getCurrentFlashcardId,
		prepareToNestInFlashcard : prepareToNestInFlashcard,
		undoNestedSlidesInFlashcard : undoNestedSlidesInFlashcard,
		hasChangedBackground 	: hasChangedBackground,
		hasPoiInBackground	 	: hasPoiInBackground,
		loadFlashcard		 	: loadFlashcard,
		redrawPois 			 	: redrawPois,
		removePois			 	: removePois,
		savePois			 	: savePois,
		switchToFlashcard	 	: switchToFlashcard,
		onBackgroundSelected	: onBackgroundSelected,
		hasFlascards 			: hasFlascards
	};

}) (VISH, jQuery);