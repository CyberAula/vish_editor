VISH.Editor.Image.Repository = (function(V,$,undefined){
	
	
	var carrouselDivId = "tab_pic_repo_content_carrousel";
	var previewDivId = "tab_pic_repo_content_preview";
	var currentImages = new Array();
	var selectedImage = null;
	
	var init = function() {
		var myInput = $("#tab_pic_repo_content").find("input[type='search']");
		$(myInput).watermark(VISH.Editor.I18n.getTrans("i.SearchContent"));
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
				_requestData($(myInput).val());
				$(myInput).blur();
			}
		});
	};	
	
	var onLoadTab = function() {
		var previousSearch = ($("#tab_pic_repo_content").find("input[type='search']").val() != "");
		if(!previousSearch) {
			_requestInitialData();
		}
	};
	
	/*
	 * Request inicial data to the server.
	 */
	var _requestInitialData = function() {
		VISH.Editor.API.requestRecomendedImages(_onDataReceived, _onAPIError);
	};
	
	/*
	 * Request data to the server.
	 */
	var _requestData = function(text) {
		VISH.Editor.API.requestImages(text, _onDataReceived, _onAPIError);
	};
	
	/*
	 * Fill tab_pic_repo_content_carrousel div with server data.
	 */
	var _onDataReceived = function(data) {
		//Clean previous content
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);
		$("#" + carrouselDivId).hide();

		//Clean previous Images
		currentImages = new Array();
		var carrouselImages = [];

		var content = "";

		//the received data has an array called "pictures", see VISH.Samples.API.imageList for an example
		if((!data.pictures)||(data.pictures.length==0)){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'> No results found </p>");
			$("#" + carrouselDivId).show();
			return
		} 
		
		//data.images is an array with the results
		$.each(data.pictures, function(index, image) {
			var myImg = $("<img src=" + image.src + " >")
			carrouselImages.push(myImg);
			currentImages[image.id] = image;
		});
		VISH.Utils.loader.loadImagesOnCarrousel(carrouselImages,_onImagesLoaded,carrouselDivId);
	};
	
	var _onImagesLoaded = function(){
		$("#" + carrouselDivId).show();
		var options = new Array();
		options['rows'] = 2;
		options['callback'] = _onClickCarrouselElement;
		options['rowItems'] = 4;
		options['scrollItems'] = 4;
		VISH.Editor.Carrousel.createCarrousel(carrouselDivId, options);
	}
	
	var _onAPIError = function() {
		VISH.Debugging.log("API error");
	};
	
	var _onClickCarrouselElement = function(event) {
		var image_url = $(event.target).attr("src");
		V.Editor.Image.addContent(image_url);
	};
			
	return {
		init 					    : init,
		onLoadTab 				: onLoadTab
	};

}) (VISH, jQuery);
