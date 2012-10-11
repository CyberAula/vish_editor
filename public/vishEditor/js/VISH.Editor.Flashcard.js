VISH.Editor.Flashcard = (function(V,$,undefined){

	var loadFlashcard = function(presentation){
		//first action, set presentation type to "flashcard"
		V.Editor.setPresentationType("flashcard");
		
		//hide slides
		V.Editor.Utils.hideSlides();

		//show flashcard background, should be an image with help by default
		$("#flashcard-background").show();
		if(presentation){
			//if we are editing an presentation
			$("#flashcard-background").css("background-image", presentation.background.src);
			$("#fc_change_bg_big").hide();
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
					
				}
				else{
					$(event.target).attr("moved", "false");
					//change to position relative so it moves with the carrusel
					var old_pos = $(event.target).offset();
					$(event.target).css("top", (old_pos.top +30) + "px");
					$(event.target).css("left", (old_pos.left -16) + "px");
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
		if(presentation && presentation.background && presentation.background.pois){
			$.each(presentation.background.pois, function(index, val) { 
  				$("#" + val.id).css("position", "fixed");
  				$("#" + val.id).offset({ top: 600*parseInt(val.y)/100 + 75, left: 800*parseInt(val.x)/100 + 55});
  				$("#" + val.id).attr("moved", "true");
			});
		}
	};

	/*
	 * returns an array of pois
	 */
	var savePois = function(){
		var pois = [];
		$(".draggable_arrow_div[moved='true']").each(function(index,s){
			pois[index]= {};
			pois[index].id = $(s).attr('id');
			pois[index].x = 100*($(s).offset().left - 55)/800; //to be relative to his parent, the flashcard-background
			pois[index].y = 100*($(s).offset().top - 75)/600; //to be relative to his parent, the flashcard-background
			pois[index].slide_id = $(s).attr('slide_id');
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

	return {
		hasChangedBackground : hasChangedBackground,
		hasPoiInBackground	 : hasPoiInBackground,
		loadFlashcard		 : loadFlashcard,
		redrawPois 			 : redrawPois,
		removePois			 : removePois,
		savePois			 : savePois,
		switchToFlashcard	 : switchToFlashcard,
		onBackgroundSelected	: onBackgroundSelected
	};

}) (VISH, jQuery);