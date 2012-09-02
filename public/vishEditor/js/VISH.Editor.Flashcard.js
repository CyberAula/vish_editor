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
		//ALL THIS ACTIONS WILL HAVE TO BE CALLED AFTER THE THUMBNAILS HAVE BEEN REWRITTEN
		//var también si se pudiese hacer appendTo al background y así poder calcular facil la posición final
		$("#poi1").draggable();
		$(".image_carousel").css("overflow", "visible");
		$("#menubar").css("z-index", "2000");
		
		//cuando se salva en el vish.editor.js puedo recorrer todos los poiX y ver su offset(), que da la posicion en el iframe
		//con eso calculo su posición final en el background
	};

	return {
		init 				: init
	};

}) (VISH, jQuery);