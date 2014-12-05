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
		$(myInput).vewatermark(V.I18n.getTrans("i.SearchContent"));
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
				_requestData($(myInput).val());
				$(myInput).blur();
			}
		});

		previewButton = $("#" + previewDivId).find("button.okButton2");
		$(previewButton).click(function(){
			if((selectedPres)&&(selectedPres["loModel"])){
				V.Editor.Presentation.previewPresentation(selectedPres["loModel"]);
			}
		})
	};

	var beforeLoadTab = function(){
		_cleanSearch();
	};
	
	var onLoadTab = function(){
	};
	
	var _requestData = function(text){
		_prepareRequest();
		V.Editor.API.requestPresentations(text,_onDataReceived,_onAPIError);
	};

	var _prepareRequest = function(){
		_cleanCarrousel();
		_cleanObjectMetadata();
		V.Utils.Loader.startLoadingInContainer($("#"+carrouselDivId),{style: "loading_presentation_carrousel"});
		$(myInput).attr("disabled","true");
		timestampLastSearch = Date.now();
	};

	var _cleanSearch = function(){
		timestampLastSearch = undefined;
		$(myInput).val("");
		$(myInput).removeAttr("disabled");
		_cleanObjectMetadata();
		_cleanCarrousel();
	};

	var _cleanCarrousel = function(){
		$("#" + carrouselDivId).hide();
		V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
	};
	
	var _onDataReceived = function(data) {
		if(!_isValidResult()){
			return;
		}

		//The received data is an array of presentations
		if((!data)||(data.length==0)){
			_onSearchFinished();
			_drawData(true);
			return;
		}

		var carrouselImages = [];
		currentPresentations = new Array();
		$.each(data, function(index, pres){
			if(typeof pres != "undefined"){
				var presId = "presentationCarrousel_" + index;
				if(typeof pres.avatar_url == "undefined"){
					pres.avatar_url = V.ImagesPath + "icons/defaultAvatar.png";
				}
				var myImg = $("<img presentationId ='"+presId+"'' src=" + pres.avatar_url + " />");
				carrouselImages.push(myImg);
				currentPresentations[presId] = pres;
			}
		});

		var options = {};
		options.callback = _onImagesLoaded;
		V.Utils.Loader.loadImagesOnContainer(carrouselImages,carrouselDivId,options);
	};


	var _onImagesLoaded = function(){
		_onSearchFinished();
		_drawData();
	};

	var _onSearchFinished = function(){
		V.Utils.Loader.stopLoadingInContainer($("#"+carrouselDivId));
		$(myInput).removeAttr("disabled");
	};

	var _drawData = function(noResults){
		$("#" + carrouselDivId).show();

		if(!_isValidResult()){
			//We need to clean because data has been loaded by V.Utils.Loader
			_cleanCarrousel();
			return;
		}

		V.Utils.addTempShown([$("#" + containerDivId),$("#" + carrouselDivId)]);

		if(noResults===true){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'>" + V.I18n.getTrans("i.Noresultsfound") + "</p>");
			V.Utils.removeTempShown([$("#" + containerDivId),$("#" + carrouselDivId)]);
		} else if(noResults===false){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'>" + V.I18n.getTrans("i.errorViSHConnection") + "</p>");
			V.Utils.removeTempShown([$("#" + containerDivId),$("#" + carrouselDivId)]);
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
					V.Utils.removeTempShown([$("#" + containerDivId),$("#" + carrouselDivId)]);
				},100);
			}
			V.Editor.Carrousel.createCarrousel(carrouselDivId, options);
		}
	};
	
	var _onAPIError = function(){
		if(_isValidResult()){
			_onSearchFinished();
			_drawData(false);
		}
	};
	
	var _onClickCarrouselElement = function(event){
		var presentationId = $(event.target).attr("presentationId");
		if(presentationId){
			$(".excursionSelectedInCarrousel").removeClass("excursionSelectedInCarrousel");
			$(event.target).addClass("excursionSelectedInCarrousel");
			selectedPres = currentPresentations[presentationId];
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
	};


	/* Preview */

	var _renderObjectMetadata = function(object){
		var metadataArea = $("#" + previewDivId).find("div.content_preview_metadata");
		$(metadataArea).html("");
		if(object){
			var presAuthor = (typeof object.author == "object") ? object.author.name : ((typeof object.author == "string") ? object.author : "");
			var table = V.Editor.Utils.generateTable({title:object.title, author:presAuthor, description:object.description, tableClass:"metadata metadata_presentation"});
			$(metadataArea).html(table);
			$(previewButton).show();
		}
	};
	
	var _cleanObjectMetadata = function(){
		var metadataArea = $("#" + previewDivId).find("div.content_preview_metadata");
		$(metadataArea).html("");
		$(previewButton).hide();
	};

	return {
		init 					: init,
		beforeLoadTab 			: beforeLoadTab,
		onLoadTab 				: onLoadTab
	};

}) (VISH, jQuery);
