VISH.Editor.Flashcard = (function(V,$,undefined){

	var init = function(){
		$(document).on("click", "#flashcard_button", _onFlashcardButtonClicked );
	};


	var _onFlashcardButtonClicked = function(){
		//first action, set excursion type to "flashcard"
		V.Editor.setExcursionType("flashcard");
		
		//hide slides
		V.Editor.Utils.hideSlides();

		//show flashcard background, should be an image with help
		$("#flashcard-background").show();
		
		$( "#flashcard-background" ).droppable();  //to accept the pois
		
		//change thumbnail onclick event (preview slide instead of go to edit it)
		//it will change itself depending on excursionType, also remove drag and drop to order slides
		//also a _redrawPois functions is passed to show the pois, do them draggables, etc
		V.Editor.Thumbnails.redrawThumbnails(_redrawPois);

		//show change background button
		
		//cuando se salva en el vish.editor.js puedo recorrer todos los poiX y ver su offset(), que da la posicion en el iframe
		//con eso calculo su posición final en el background
	};

	var _redrawPois = function(){
		console.log("_redrawPois");
		$(".fc_draggable_arrow").show();
		//show draggable items to create the flashcard
		//ALL THIS ACTIONS WILL HAVE TO BE CALLED AFTER THE THUMBNAILS HAVE BEEN REWRITTEN
		//var también si se pudiese hacer appendTo al background y así poder calcular facil la posición final
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

	/*
	 * returns an array of pois
	 */
	var savePois = function(){
		var pois = [];
		$(".fc_draggable_arrow [moved='true']").each(function(index,s){
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
		init 				: init,
		removePois			: removePois,
		savePois			: savePois
	};

}) (VISH, jQuery);