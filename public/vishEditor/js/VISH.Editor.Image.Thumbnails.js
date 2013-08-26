VISH.Editor.Image.Thumbnails = (function(V,$,undefined){
	
	var carrouselDivId = "tab_pic_thumbnails_carrousel";
	var dataLoaded = false;
	
	var init = function() {
	};
	
	var onLoadTab = function() {
		if(!dataLoaded){
			_requestInitialData();
		}
	};
	
	/*
	 * Request inicial data to the server.
	 */
	var _requestInitialData = function() {
		_prepareRequest();
		V.Editor.API.requestThumbnails(_onDataReceived,_onAPIError);
	};
	
	var _prepareRequest = function(){
		//Clean previous carrousel
		V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
		$("#" + carrouselDivId).hide();
		V.Utils.Loader.startLoadingInContainer($("#"+carrouselDivId));
	}

	/*
	 * Fill carrousel div with server data.
	 */
	var _onDataReceived = function(data) {
		if(dataLoaded){
			return;
		} else {
			dataLoaded = true;
		}

		var carrouselImages = [];
		var content = "";

		if((!data.pictures)||(data.pictures.length==0)){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'> No results found </p>");
			$("#" + carrouselDivId).show();
			return;
		}
		
		$.each(data.pictures, function(index, image) {
			var myImg = $("<img src='" + image.src + "' title='"+image.title+"' >")
			carrouselImages.push(myImg);
		});

		var options = {};
		options.callback = _onImagesLoaded;
		options.order = true;
		V.Utils.Loader.loadImagesOnContainer(carrouselImages,carrouselDivId,options);
	};
	
	var _onImagesLoaded = function(){
		V.Utils.Loader.stopLoadingInContainer($("#"+carrouselDivId));
		$("#" + carrouselDivId).show();
		var options = new Array();
		options['rows'] = 3;
		options['callback'] = _onClickCarrouselElement;
		options['rowItems'] = 5;
		options['scrollItems'] = 5;
		options['styleClass'] = "thumbnails";
		V.Editor.Carrousel.createCarrousel(carrouselDivId, options);
	}
	
	var _onAPIError = function() {
		V.Debugging.log("API error");
	};
	
	var _onClickCarrouselElement = function(event) {
		var image_url = $(event.target).attr("src");
		V.Editor.Image.addContent(image_url);
	};

	return {
		init 					: init,
		onLoadTab 				: onLoadTab
	};

}) (VISH, jQuery);
