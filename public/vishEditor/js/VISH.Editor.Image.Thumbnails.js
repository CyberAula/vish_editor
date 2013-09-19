VISH.Editor.Image.Thumbnails = (function(V,$,undefined){
	
	var containerDivId = "tab_pic_thumbnails_content";
	var carrouselDivId = "tab_pic_thumbnails_carrousel";
	var thumbnailsData;
	var thumbnailsRequested = false;
	var dataDrawed = false;
	
	var init = function() {
	};
	
	var beforeLoadTab = function(){
	}

	var onLoadTab = function(){
		//Give time the fancybox to effectively show the carrousel
		setTimeout(function(){
			if(!thumbnailsRequested){
				thumbnailsRequested = true;
				_requestInitialData();
			} else if(dataDrawed === false){
				_prepareRequest();
				//data received but not drawed, draw it
				_loadData(thumbnailsData);
			}
		},1000);
	};
	
	var _requestInitialData = function(){
		_prepareRequest();
		V.Editor.API.requestThumbnails(_onDataReceived,_onAPIError);
	};

	var _prepareRequest = function(){
		_cleanCarrousel();
		V.Utils.Loader.startLoadingInContainer($("#"+carrouselDivId));
	}

	var _cleanCarrousel = function(){
		V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
		$("#" + carrouselDivId).hide();
	}

	var _onDataReceived = function(data){
		if(thumbnailsData){
			return;
		} else {
			thumbnailsData = data;
			_loadData(data);
		}
	};

	var _loadData = function(data){
		//Ensure that carrousel is visible before drawing it
		if(!_isValidResult()){
			return;
		}

		if((!data.pictures)||(data.pictures.length==0)){
			_onSearchFinished();
			_drawData(true);
			return;
		}
		
		var carrouselImages = [];
		$.each(data.pictures, function(index, image) {
			var myImg = $("<img src='" + image.src + "' title='"+image.title+"' >")
			carrouselImages.push(myImg);
		});

		var options = {};
		options.callback = _onImagesLoaded;
		options.order = true;
		V.Utils.Loader.loadImagesOnContainer(carrouselImages,carrouselDivId,options);
	}
	
	var _onImagesLoaded = function(){
		_onSearchFinished();
		_drawData();
	}

	var _onSearchFinished = function(){
		V.Utils.Loader.stopLoadingInContainer($("#"+carrouselDivId));
	}

	var _drawData = function(noResults){
		$("#" + carrouselDivId).show();

		if(!_isValidResult()){
			//We need to clean because data has been loaded by V.Utils.Loader
			_cleanCarrousel();
			return;
		}

		V.Editor.Utils.addTmpShown([$("#" + containerDivId),$("#" + carrouselDivId)]);

		if(noResults===true){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'>" + V.I18n.getTrans("i.Noresultsfound") + "</p>");
			V.Editor.Utils.removeTmpShown([$("#" + containerDivId),$("#" + carrouselDivId)]);
		} else if(noResults===false){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'>" + V.I18n.getTrans("i.errorViSHConnection") + "</p>");
			V.Editor.Utils.removeTmpShown([$("#" + containerDivId),$("#" + carrouselDivId)]);
		} else {
			var options = new Array();
			options.rows = 3;
			options.callback = _onClickCarrouselElement;
			options.rowItems = 5;
			options.scrollItems = 5;
			options.styleClass = "thumbnails";
			options.afterCreateCarruselFunction = function(){
				//We need to wait even a little more that afterCreate callback
				setTimeout(function(){
					V.Editor.Utils.removeTmpShown([$("#" + containerDivId),$("#" + carrouselDivId)]);
				},100);
			}
			V.Editor.Carrousel.createCarrousel(carrouselDivId, options);
		}
		dataDrawed = true;
	}
	
	var _onAPIError = function(){
		if(_isValidResult()){
			_onSearchFinished();
			_drawData(false);
		}
	};
	
	var _onClickCarrouselElement = function(event) {
		var image_url = $(event.target).attr("src");
		V.Editor.Image.addContent(image_url);
	};

	var _isValidResult = function(){
		var isVisible = $("#" + carrouselDivId).is(":visible");
		if(!isVisible){
			return false;
		}

		return true;
	}

	return {
		init 					: init,
		beforeLoadTab			: beforeLoadTab,
		onLoadTab 				: onLoadTab
	};

}) (VISH, jQuery);
