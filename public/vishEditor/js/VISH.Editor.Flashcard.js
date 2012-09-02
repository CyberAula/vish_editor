VISH.Editor.Flashcard = (function(V,$,undefined){

	var init = function(){
		$(document).on("click", "#flashcard_button", _onFlashcardButtonClicked );
	};


	var _onFlashcardButtonClicked = function(){
		//first action, set excursion type to "flashcard"
		V.Editor.setExcursionType("flashcard");
		
		//hide slides
		V.Editor.Utils.hideSlides();

		//change thumbnail onclick event (preview slide instead of go to edit it)
		//it will change itself depending on excursionType
		V.Editor.Thumbnails.redrawThumbnails();

		//show flashcard background, should be an image with help
		$("#flashcard-background").show();

		//show change background button

		//show draggable items to create the flashcard
		//THIS ACTION WILL HAVE TO BE CALLED AFTER THE THUMBNAILS HAVE BEEN REWRITTEN
		//var también si se pudiese hacer appendTo al background y así poder calcular facil la posición final
		$("#poi1").draggable();
		$(".image_carousel").css("overflow", "auto");

		
		
	};

	return {
		init 				: init
	};

}) (VISH, jQuery);