VISH.Editor.Flashcard = (function(V,$,undefined){

	var loadFlashcard = function(){
		//first action, set excursion type to "flashcard"
		V.Editor.setExcursionType("flashcard");
		
		//hide slides
		V.Editor.Utils.hideSlides();

		//show flashcard background, should be an image with help
		$("#flashcard-background").show();
		
		$("#flashcard-background").droppable();  //to accept the pois
	};

	var switchToFlashcard = function(){
		
		loadFlashcard();
		//change thumbnail onclick event (preview slide instead of go to edit it)
		//it will change itself depending on excursionType, also remove drag and drop to order slides
		//also a _redrawPois functions is passed to show the pois, do them draggables, etc
		V.Editor.Thumbnails.redrawThumbnails(redrawPois);

		VISH.Editor.Tools.init();
		
	};


	//ALL THIS ACTIONS WILL HAVE TO BE CALLED AFTER THE THUMBNAILS HAVE BEEN REWRITTEN
	var redrawPois = function(){
		//show draggable items to create the flashcard
		$(".draggable_arrow_div").show();
		//apply them the style to get the previous position
		_applyStyleToPois();

		$(".draggable_arrow_div").draggable({
			revert: "invalid",   //poi will return to original position if not dropped on the background
			stop: function(event, ui) { //change the moved attribute of the poi
				//check if inside background
				if($(event.target).offset().top > 50 && $(event.target).offset().top < 600 && $(event.target).offset().left > 55 && $(event.target).offset().left < 805){
					$(event.target).attr("moved", "true");
				}
				else{
					$(event.target).attr("moved", "false");
				}
			}
		});
		$(".carrousel_element_single_row_slides").droppable();
		$(".image_carousel").css("overflow", "visible");
		$("#menubar").css("z-index", "1075");
		$(".draggable_arrow_div").css("z-index", "1075");
	};


	var _applyStyleToPois = function(){
		var excursion = V.Editor.getExcursion();
		if(excursion && excursion.background && excursion.background.pois){
			$.each(excursion.background.pois, function(index, val) { 
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

	return {
		hasPoiInBackground	: hasPoiInBackground,
		loadFlashcard		: loadFlashcard,
		redrawPois 			: redrawPois,
		removePois			: removePois,
		savePois			: savePois,
		switchToFlashcard	: switchToFlashcard
	};

}) (VISH, jQuery);