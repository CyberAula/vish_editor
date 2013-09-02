VISH.Editor.Image.Repository = (function(V,$,undefined){
	
	var containerDivId = "tab_pic_repo_content";
	var carrouselDivId = "tab_pic_repo_content_carrousel";
	var myInput;
	var timestampLastSearch;
	
	var init = function() {
		myInput = $("#tab_pic_repo_content").find("input[type='search']");
		$(myInput).watermark(V.Editor.I18n.getTrans("i.SearchContent"));
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
				_requestData($(myInput).val());
				$(myInput).blur();
			}
		});
	};

	var beforeLoadTab = function(){
		_cleanSearch();
	}
	
	var onLoadTab = function() {
		
	};
	
	/*
	 * Request data to the server.
	 */
	var _requestData = function(text) {
		_prepareRequest();
		V.Editor.API.requestImages(text, _onDataReceived, _onAPIError);
	};

	var _prepareRequest = function(){
		_cleanCarrousel();
		V.Utils.Loader.startLoadingInContainer($("#"+carrouselDivId));
		$(myInput).attr("disabled","true");
		timestampLastSearch = Date.now();
	}
	
	var _cleanSearch = function(){
		$(myInput).val("");
		$(myInput).removeAttr("disabled");
		_cleanCarrousel();
		timestampLastSearch = undefined;
	}

	var _cleanCarrousel = function(){
		$("#" + carrouselDivId).hide();
		V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
	}

	/*
	 * Fill carrousel with server data.
	 */
	var _onDataReceived = function(data) {
		if(typeof timestampLastSearch == "undefined"){
			//Old search (not valid).
			return;
		}

		//The received data has an array called "pictures", see V.Samples.API.imageList for an example
		if((!data)||(!data.pictures)||(data.pictures.length==0)){
			_onSearchFinished();
			_drawData(true);
			return;
		}

		var isVisible = $("#" + carrouselDivId).is(":visible");
		if(!isVisible){
			return;
		}

		//data.images is an array with the results
		var carrouselImages = [];
		$.each(data.pictures, function(index, image) {
			var myImg = $("<img src='" + image.src + "' title='"+image.title+"' >")
			carrouselImages.push(myImg);
		});

		var options = {};
		options.callback = _onImagesLoaded;
		V.Utils.Loader.loadImagesOnContainer(carrouselImages,carrouselDivId,options);
	}
	
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

		var isVisible = $("#" + carrouselDivId).is(":visible");
		if(!isVisible){
			return;
		}

		$("#" + containerDivId).addClass("temp_shown");
		$("#" + carrouselDivId).addClass("temp_shown");

		if(noResults===true){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'> No results found </p>");
		} else {
			var options = new Array();
			options.rows = 2;
			options.callback = _onClickCarrouselElement;
			options.rowItems = 4;
			options.scrollItems = 4;
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
	
	var _onAPIError = function() {
		V.Debugging.log("API error");
	};
	
	var _onClickCarrouselElement = function(event) {
		var image_url = $(event.target).attr("src");
		V.Editor.Image.addContent(image_url);
		_cleanSearch();
	};
			
	return {
		init 					: init,
		beforeLoadTab			: beforeLoadTab,
		onLoadTab 				: onLoadTab
	};

}) (VISH, jQuery);
