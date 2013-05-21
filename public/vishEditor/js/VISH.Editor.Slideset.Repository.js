VISH.Editor.Slideset.Repository = (function(V,$,undefined){
	
  	var carrouselDivId = "tab_smartcards_repo_content_carrousel";
  	var previewDivId = "tab_smartcards_repo_content_preview";

	var currentSmartcards = new Array();
	var selectedSmartcard = null;
	var myInput;
	var previewButton;

	var initialized = false;

	var init = function() {
		myInput = $("#tab_smartcards_repo_content").find("input[type='search']");
		previewButton = $("#" + previewDivId).find("button.okButton");

		if(!initialized){
			$(myInput).watermark(V.Editor.I18n.getTrans("i.SearchContent"));
			$(myInput).keydown(function(event) {
				if(event.keyCode == 13) {
					_requestData($(myInput).val());
					$(myInput).blur();
				}
			});
		
			$(previewButton).click(function(){
				if(selectedSmartcard){
					V.Editor.Presentation.previewPresentation(selectedSmartcard);
				}
			})

			initialized = true;
		}

	};
	
	var onLoadTab = function() {
		var previousSearch = ($(myInput).val() !== "");
		if(!previousSearch) {
			_cleanObjectMetadata();
			_requestInitialData();
		}
	};
	
	/*
	 * Request inicial data to the server.
	 */
	var _requestInitialData = function() {
		V.Editor.API.requestRecomendedSmartcards(_onDataReceived, _onAPIError);
	};
	
	/*
	 * Request data to the server.
	 */
	var _requestData = function(text) {
		V.Editor.API.requestSmartcards(text, _onDataReceived, _onAPIError);
	};
	
	/*
	 * Fill tab_pic_repo_content_carrousel div with server data.
	 */
	var _onDataReceived = function(data) {
		//Clean previous content
		V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
		$("#" + carrouselDivId).hide();

		//Clean previous Images
		currentSmartcards = new Array();
		var carrouselImages = [];

		var content = "";

		//the received data has an array called "flashcards", see V.Samples.API.flashcardList for an example
		if((!data.flashcards)||(data.flashcards.length==0)){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'> No results found </p>");
			$("#" + carrouselDivId).show();
			return;
		} 
		
		//data.flashcards is an array with the results
		$.each(data.flashcards, function(index, fc) {
			var myImg = $("<img flashcardid ='"+fc.id+"'' src=" + V.Utils.getSrcFromCSS(fc.slides[0].background) + " >")
			carrouselImages.push(myImg);
			currentSmartcards[fc.id] = fc;
		});
		V.Utils.Loader.loadImagesOnCarrousel(carrouselImages,_onImagesLoaded,carrouselDivId);
	};
	
	var _onImagesLoaded = function(){
		$("#" + carrouselDivId).show();
		var options = new Array();
		options['rows'] = 1;
		options['callback'] = _onClickCarrouselElement;
		options['rowItems'] = 5;
		options['scrollItems'] = 5;
		options['width'] = 800;
		options['styleClass'] = "presentation_repository";
		V.Editor.Carrousel.createCarrousel(carrouselDivId, options);
	}
	
	var _onAPIError = function() {
		V.Debugging.log("API error");
	};
	
	var _onClickCarrouselElement = function(event) {
		var smartCardId = $(event.target).attr("flashcardid");
		if(smartCardId){
			selectedSmartcard = currentSmartcards[smartCardId];
			_renderObjectMetadata(selectedSmartcard);
		}
	};

	var _renderObjectMetadata = function(object){
		var metadataArea = $("#" + previewDivId).find("div.content_preview_metadata");
		$(metadataArea).html("");
		if(object){
			var table = V.Editor.Utils.generateTable(object.author,object.title,object.description,"metadata metadata_presentation");
			$(metadataArea).html(table);
			$(previewButton).show();
		}
	}
	
	var _cleanObjectMetadata = function(){
		var metadataArea = $("#" + previewDivId).find("div.content_preview_metadata");
		$(metadataArea).html("");
		$(previewButton).hide();
	}


	return {
		init 					: init,
		onLoadTab 				: onLoadTab
	};

}) (VISH, jQuery);
