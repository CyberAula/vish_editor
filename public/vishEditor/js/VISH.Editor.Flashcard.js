VISH.Editor.Flashcard = (function(V,$,undefined){

	
	var switchToFlashcard = function(){
		//first action, set excursion type to "flashcard"
		V.Editor.setExcursionType("flashcard");
		
		//hide slides
		V.Editor.Utils.hideSlides();

		//show flashcard background, should be an image with help
		$("#flashcard-background").show();
		
		$( "#flashcard-background").droppable();  //to accept the pois
		
		//change thumbnail onclick event (preview slide instead of go to edit it)
		//it will change itself depending on excursionType, also remove drag and drop to order slides
		//also a _redrawPois functions is passed to show the pois, do them draggables, etc
		V.Editor.Thumbnails.redrawThumbnails(_redrawPois);

		VISH.Editor.Tools.init();
		
	};


	//ALL THIS ACTIONS WILL HAVE TO BE CALLED AFTER THE THUMBNAILS HAVE BEEN REWRITTEN
	var _redrawPois = function(){
		//show draggable items to create the flashcard
		$(".fc_draggable_arrow").show();
		//apply them the style to get the previous position
		_applyStyleToPois();

		$(".fc_draggable_arrow").draggable({
			stop: function(event, ui) { console.log("start drag");},
			revert: "invalid",   //poi will return to original position if not dropped on the background
			stop: function(event, ui) { //change the moved attribute of the poi
				//check if inside background
				if($(event.srcElement).offset().top > 100 && $(event.srcElement).offset().top < 700 && $(event.srcElement).offset().left > 55 && $(event.srcElement).offset().left < 855){
					$(event.srcElement).attr("moved", "true");
				}
				else{
					$(event.srcElement).attr("moved", "false");
				}
			}
		});
		$(".carrousel_element_single_row_slides").droppable();
		$(".image_carousel").css("overflow", "visible");
		$("#menubar").css("z-index", "2000");
		$(".fc_draggable_arrow").css("z-index", "2000");
	};


	var _applyStyleToPois = function(){
		var excursion = V.Editor.getExcursion();
		if(excursion && excursion.background && excursion.background.pois){
			$.each(excursion.background.pois, function(index, value) { 
  				console.log("val" + value);
			});
		}
	};

	/*
	 * returns an array of pois
	 */
	var savePois = function(){
		var pois = [];
		$(".fc_draggable_arrow[moved='true']").each(function(index,s){
			pois[index]= {};
			pois[index].id = $(s).attr('id');
			pois[index].x = $(s).offset().left - 55;
			pois[index].y = $(s).offset().top - 75;
			pois[index].slide_id = $(s).attr('slide_id');
		});
		return pois;
	};

	var removePois = function(){
		$(".fc_draggable_arrow").hide();
	};

	return {
		removePois			: removePois,
		savePois			: savePois,
		switchToFlashcard	: switchToFlashcard
	};

}) (VISH, jQuery);