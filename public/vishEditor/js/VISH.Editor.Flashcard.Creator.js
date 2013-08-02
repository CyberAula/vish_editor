VISH.Editor.Flashcard.Creator = (function(V,$,undefined){

	//Point to current flashcard.
	var flashcardId;


	var init = function(){
		flashcardId = null;
	};

	var getId = function(){
		return flashcardId;
	}

	var getDummy = function(slideNumber){
		var fcId = V.Utils.getId("article");
		return "<article id='"+fcId+"' type='"+V.Constant.FLASHCARD+"' slidenumber='"+slideNumber+"'><div class='delete_slide'></div><img class='help_in_template' id='help_flashcard_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/></article>";
	}

	// /*
	//  * Load a flashcard in the creator mode
	//  * @presentation must be undefined for new flashcard, or a previous flashcard
	//  * (presentation[type='flashcard']) if we are editing an existing flashcard
	//  */
	// var loadSlideset = function(presentation){
	// 	V.Editor.setPresentationType(V.Constant.FLASHCARD);
		
	// 	V.Editor.Slides.hideSlides();

	// 	//Show flashcard background
	// 	$("#flashcard-background").show();

	// 	if(presentation){
	// 		//If we are editing an existing flashcard
	// 		var flashcard = presentation.slides[0];
	// 		flashcardId = flashcard.id;
	// 		$("#flashcard-background").attr("flashcard_id", flashcardId);
	// 		$("#flashcard-background").css("background-image", flashcard.background);
	// 		$("#fc_change_bg_big").hide();
	// 		//When we load a flashcard, we can trust in the json pois
	// 		//Otherwise, this pois may be belong to another slideset (e.g virtual tour)
	// 		trustOrgPois = true;
	// 	} else {
	// 		//Create new flashcard
	// 		if(!flashcardId){
	// 			flashcardId = V.Utils.getId("article");
	// 		}
	// 		$("#flashcard-background").attr("flashcard_id", flashcardId);
	// 	}
	// 	$("#flashcard-background").droppable();  //to accept the pois
	// };

	/*
	 * Callback from the V.Editor.Image module to add the background
	 */
	var onBackgroundSelected = function(contentToAdd){
		$("#flashcard-background").css("background-image", "url("+contentToAdd+")");
		$("#fc_change_bg_big").hide();
		$.fancybox.close();
	}

	


	////////////////////
	// Validate
	////////////////////

	/*
	 * OnValidationError: Return the id of the form to be show
	 * OnValidationSuccess:Return true
	 */
	var validateOnSave = function(){
		// if(!_hasPoiInBackground()){
		// 	return "message3_form";
		// }
		// if(!_hasChangedBackground()){
		// 	return "message4_form";
		// }
		return true;
	}


	////////////////////
	// JSON Manipulation
	////////////////////

	/*
	 * Used by VISH.Editor module to save the flashcard in a JSON file
	 */
	var getSlideHeader = function(){
		var slide = {};
		slide.id = flashcardId;
		slide.type = V.Constant.FLASHCARD;
		slide.background = $("#flashcard-background").css("background-image");
		slide.pois = getPois();
		slide.slides = [];
		return slide;
	}

	return {
		init 				 		: init,
		getDummy					: getDummy,
		onBackgroundSelected		: onBackgroundSelected
	};

}) (VISH, jQuery);