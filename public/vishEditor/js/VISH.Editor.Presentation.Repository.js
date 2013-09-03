VISH.Editor.Presentation.Repository = (function(V,$,undefined){
	
	var containerDivId = "tab_presentations_repo_content";
	var carrouselDivId = "tab_presentations_repo_content_carrousel";
	var previewDivId = "tab_presentations_repo_content_preview";
	var previewButton;
	var myInput;

	var timestampLastSearch;

	//Store video metadata
	var currentPresentations = new Array();
	var selectedPres = null;


	var init = function(){
		myInput = $("#" + containerDivId).find("input[type='search']");
		$(myInput).watermark(V.Editor.I18n.getTrans("i.SearchContent"));
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
				_requestData($(myInput).val());
				$(myInput).blur();
			}
		});

		previewButton = $("#" + previewDivId).find("button.okButton2");
		$(previewButton).click(function(){
			if(selectedPres){
				V.Editor.Presentation.previewPresentation(selectedPres);
			}
		})
	};

	var beforeLoadTab = function(){
		_cleanSearch();
	}
	
	var onLoadTab = function(){
		
	};
	
	var _requestData = function(text){
		_prepareRequest();
		V.Editor.API.requestExcursions(text, _onDataReceived, _onAPIError);
	};

	var _prepareRequest = function(){
		_cleanCarrousel();
		_cleanObjectMetadata();
		V.Utils.Loader.startLoadingInContainer($("#"+carrouselDivId),{style: "loading_presentation_carrousel"});
		$(myInput).attr("disabled","true");
		timestampLastSearch = Date.now();
	}

	var _cleanSearch = function(){
		timestampLastSearch = undefined;
		$(myInput).val("");
		$(myInput).removeAttr("disabled");
		_cleanObjectMetadata();
		_cleanCarrousel();
	}

	var _cleanCarrousel = function(){
		$("#" + carrouselDivId).hide();
		V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
	}
	
	var _onDataReceived = function(data) {
		if(!_isValidResult()){
			return;
		}

		//The received data has an array called "videos"
		if((!data)||(!data.excursions)||(data.excursions.length==0)){
			_onSearchFinished();
			_drawData(true);
			return;
		}

		var carrouselImages = [];
		currentExcursions = new Array();
		$.each(data.excursions, function(index, pres){
			var myImg = $("<img excursionId ='"+pres.id+"'' src=" + pres.avatar + " />");
			carrouselImages.push(myImg);
			currentExcursions[pres.id] = pres;
		});

		var options = {};
		options.callback = _onImagesLoaded;
		V.Utils.Loader.loadImagesOnContainer(carrouselImages,carrouselDivId,options);
	};


	var _onImagesLoaded = function(){
		_onSearchFinished();
		_drawData();
	}

	var _onSearchFinished = function(){
		V.Utils.Loader.stopLoadingInContainer($("#"+carrouselDivId));
		$(myInput).removeAttr("disabled");
	}

	var _drawData = function(noResults){
		$("#" + carrouselDivId).show();

		if(!_isValidResult()){
			//We need to clean because data has been loaded by V.Utils.Loader
			_cleanCarrousel();
			return;
		}

		$("#" + containerDivId).addClass("temp_shown");
		$("#" + carrouselDivId).addClass("temp_shown");


		if(noResults===true){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'>" + "No results found" + "</p>");
		} else if(noResults===false){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'>" + "Error connecting to ViSH server" + "</p>");
		} else {
			var options = new Array();
			options.rows = 1;
			options.callback = _onClickCarrouselElement;
			options.rowItems = 5;
			options.scrollItems = 5;
			options.width = 800;
			options.styleClass = "presentation_repository";
			options.afterCreateCarruselFunction = function(){
				//We need to wait even a little more that afterCreate callback
				setTimeout(function(){
					$("#" + containerDivId).removeClass("temp_shown");
					$("#" + carrouselDivId).removeClass("temp_shown");
				},100);
			}
			V.Editor.Carrousel.createCarrousel(carrouselDivId, options);
		}
	}
	
	var _onAPIError = function(){
		if(_isValidResult()){
			_onSearchFinished();
			_drawData(false);
		}
	};
	
	var _onClickCarrouselElement = function(event){
		var excursionId = $(event.target).attr("excursionId");
		if(excursionId){
			$(".excursionSelectedInCarrousel").removeClass("excursionSelectedInCarrousel");
			$(event.target).addClass("excursionSelectedInCarrousel");
			selectedPres = currentExcursions[excursionId];
			_renderObjectMetadata(selectedPres);
		}
	};

	var _isValidResult = function(){
		if(typeof timestampLastSearch == "undefined"){
			//Old search (not valid).
			return false;
		}

		var isVisible = $("#" + carrouselDivId).is(":visible");
		if(!isVisible){
			return false;
		}

		return true;
	}


	/* Preview */

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
		beforeLoadTab 			: beforeLoadTab,
		onLoadTab 				: onLoadTab
	};

}) (VISH, jQuery);
