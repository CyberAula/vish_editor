VISH.Editor.Flashcard.Creator = (function(V,$,undefined){

	//Point to current flashcard.
	//Singleton: Only one flashcard can be edited in a Vish Editor instance.
	var flashcardId;
	//Point to the current pois
	var currentPois = undefined;

	//Internal
	var trustOrgPois = false;


	var init = function(){
		flashcardId = null;
	};

	var getId = function(){
		return flashcardId;
	}

	/*
	 * Switch to Flashcard creator in order to allow the creation of a new flashcard
	 * using the current slides
	 */
	var onLoadMode = function(){
		loadSlideset();
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
	var onLeaveMode = function(){
		currentPois = _getCurrentPois();
		$("#flashcard-background").hide();
	}

	/*
	 * Load a flashcard in the creator mode
	 * @presentation must be undefined for new flashcard, or a previous flashcard
	 * (presentation[type='flashcard']) if we are editing an existing flashcard
	 */
	var loadSlideset = function(presentation){
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
			//When we load a flashcard, we can trust in the json pois
			//Otherwise, this pois may be belong to another slideset (e.g virtual tour)
			trustOrgPois = true;
		} else {
			//Create new flashcard
			if(!flashcardId){
				flashcardId = V.Utils.getId("article");
			}
			$("#flashcard-background").attr("flashcard_id", flashcardId);
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
	};

	var _applyStyleToPois = function(){
		if((typeof currentPois === "undefined")&&(trustOrgPois)){
			//We are loading a flascard, get the pois from the json
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
				$("#" + val.id).offset({ top: 600*parseInt(val.y)/100 + 38, left: 800*parseInt(val.x)/100 + 48});
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
			pois[index].id = flashcardId+"_"+s.id;
			pois[index].x = (100*($(s).offset().left - 48)/800).toString(); //to be relative to his parent, the flashcard-background
			pois[index].y = (100*($(s).offset().top - 38)/600).toString(); //to be relative to his parent, the flashcard-background
			pois[index].slide_id = flashcardId+"_"+$(s).attr('slide_id');
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

	var _hidePois = function(){
		$(".draggable_arrow_div").hide();
	};

	var _hasPoiInBackground = function(){
		return $(".draggable_arrow_div[moved='true']").length > 0;
	};

	var _hasChangedBackground = function(){
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
			  	V.Editor.Preview.preview({slideNumberToPreview: parseInt($(event.target).attr("slideNumber"))});
			  break;
			default:
			  break;
		}
	 }


	////////////////////
	// Validate
	////////////////////

	/*
	 * OnValidationError: Return the id of the form to be show
	 * OnValidationSuccess:Return true
	 */
	var validateOnSave = function(){
		if(!_hasPoiInBackground()){
			return "message3_form";
		}
		if(!_hasChangedBackground()){
			return "message4_form";
		}
		return true;
	}


	////////////////////
	// JSON Manipulation
	////////////////////

	/*
	 * Used for VISH.Editor module to save the flashcard in a JSON file
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
		getId						: getId,
		onLoadMode			 		: onLoadMode,
		onLeaveMode 				: onLeaveMode,
		loadSlideset		 		: loadSlideset,
		onBackgroundSelected		: onBackgroundSelected,
		redrawPois 			 		: redrawPois,
		getPois			 			: getPois,
		onClickCarrouselElement 	: onClickCarrouselElement,
		getSlideHeader				: getSlideHeader,
		validateOnSave				: validateOnSave
	};

}) (VISH, jQuery);