VISH.Editor.Image.Repository = (function(V,$,undefined){
	
	
	var carrouselDivId = "tab_pic_repo_content_carrousel";
	var previewDivId = "tab_pic_repo_content_preview";
	var currentImages = new Array();
	var selectedImage = null;
	
	var init = function() {
		var myInput = $("#tab_pic_repo_content").find("input[type='search']");
		$(myInput).watermark('Search content');
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
				VISH.Editor.Image.Repository.requestData($(myInput).val());
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
		VISH.Editor.API.requestRecomendedImages(VISH.Editor.Image.Repository.onDataReceived, VISH.Editor.Image.Repository.onAPIError);
	};
	
	/*
	 * Request data to the server.
	 */
	var requestData = function(text) {
		VISH.Editor.API.requestImages(text, VISH.Editor.Image.Repository.onDataReceived, VISH.Editor.Image.Repository.onAPIError);
	};
	
	/*
	 * Fill tab_pic_repo_content_carrousel div with server data.
	 */
	var onDataReceived = function(data) {
		//Clean previous content
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);

		//Clean previous Images
		currentImages = new Array();

		var content = "";

		//the received data has an array called "pictures", see VISH.Samples.API.imageList for an example
		if(data.pictures.length==0){
			$("#" + carrouselDivId).html("No results found.");
		} 
		else{ 
			//data.images is an array with the results
			$.each(data.pictures, function(index, image) {
				content = content + "<div><img src='" + image.src + "' ></div>";
				currentImages[image.id] = image;
			});
	
			$("#" + carrouselDivId).html(content);
			VISH.Editor.Carrousel.createCarrousel(carrouselDivId, 1, VISH.Editor.Image.Repository.onClickCarrouselElement);
		}
	};
	
	var onAPIError = function() {
		console.log("API error");
		//VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);
	};
	
	var onClickCarrouselElement = function(event) {
		V.Editor.Image.drawImage($(event.target).attr("src"));
		$.fancybox.close();
	};
	
		
	return {
		init 					: init,
		onLoadTab 				: onLoadTab,
		requestData 			: requestData,
		onDataReceived 			: onDataReceived,
		onAPIError 				: onAPIError,
		onClickCarrouselElement : onClickCarrouselElement
	};

}) (VISH, jQuery);
