VISH.Editor.Flashcard.Repository = (function(V,$,undefined){
	
	
	var carrouselDivId = "tab_flashcards_repo_content_carrousel";
	var previewDivId = "tab_flashcards_repo_content_preview";
	var currentFlashcards = new Array();
	var selectedFlashcard = null;
	
	var init = function() {
		var myInput = $("#tab_flashcards_repo_content").find("input[type='search']");
		$(myInput).watermark(VISH.Editor.I18n.getTrans("i.SearchContent"));
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
				_requestData($(myInput).val());
				$(myInput).blur();
			}
		});
	};	
	
	var onLoadTab = function() {
		var previousSearch = ($("#tab_flashcards_repo_content").find("input[type='search']").val() != "");
		if(!previousSearch) {
			_requestInitialData();
		}
	};
	
	/*
	 * Request inicial data to the server.
	 */
	var _requestInitialData = function() {
		VISH.Editor.API.requestRecomendedFlashcards(_onDataReceived, _onAPIError);
	};
	
	/*
	 * Request data to the server.
	 */
	var _requestData = function(text) {
		VISH.Editor.API.requestFlashcards(text, _onDataReceived, _onAPIError);
	};
	
	/*
	 * Fill tab_pic_repo_content_carrousel div with server data.
	 */
	var _onDataReceived = function(data) {
		//Clean previous content
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);
		$("#" + carrouselDivId).hide();

		//Clean previous Images
		currentFlashcards = new Array();
		var carrouselImages = [];

		var content = "";

		//the received data has an array called "flashcards", see VISH.Samples.API.imageList for an example
		if((!data.flashcards)||(data.flashcards.length==0)){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'> No results found </p>");
			$("#" + carrouselDivId).show();
			return;
		} 
		
		//data.images is an array with the results
		$.each(data.flashcards, function(index, fc) {
			var myImg = $("<img flashcardid ='"+fc.id+"'' src=" + V.Utils.getSrcFromCSS(fc.slides[0].background) + " >")
			carrouselImages.push(myImg);
			currentFlashcards[fc.id] = fc;
		});
		VISH.Utils.loader.loadImagesOnCarrousel(carrouselImages,_onImagesLoaded,carrouselDivId);
	};
	
	var _onImagesLoaded = function(){
		$("#" + carrouselDivId).show();
		var options = new Array();
		options['rows'] = 1;
		options['callback'] = _onClickCarrouselElement;
		options['rowItems'] = 4;
		options['scrollItems'] = 4;
		VISH.Editor.Carrousel.createCarrousel(carrouselDivId, options);
	}
	
	var _onAPIError = function() {
		VISH.Debugging.log("API error");
	};
	
	var _onClickCarrouselElement = function(event) {
		var flashcardid = $(event.target).attr("flashcardid");
		if(flashcardid){
			var selectedFc = currentFlashcards[flashcardid];
			V.Flashcard.init();
			V.Renderer.init();
			V.Renderer.renderSlide(selectedFc.slides[0], "", "<div class='delete_slide'></div>");
			V.Editor.Utils.redrawSlides();
			VISH.Editor.Thumbnails.redrawThumbnails();
			V.Editor.Events.bindEventsForFlashcard(selectedFc.slides[0]);
			V.Slides.lastSlide();  //important to get the browser to draw everything
			$.fancybox.close();
		}
	};
		


	return {
		init 					    : init,
		onLoadTab 				: onLoadTab
	};

}) (VISH, jQuery);
