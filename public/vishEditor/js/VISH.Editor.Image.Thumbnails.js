VISH.Editor.Image.Thumbnails = (function(V,$,undefined){
	
	var containerDivId = "tab_pic_thumbnails_content";
	var carrouselDivId = "tab_pic_thumbnails_carrousel";

	// var thumbnailsData;
	var thumbnailsRequested = false;
	var dataDrawed = false;

	
	var init = function() {
	};
	
	var beforeLoadTab = function(){
	};

	var onLoadTab = function(){
		if(!thumbnailsRequested){
			thumbnailsRequested = true;
			_requestThumbnails();
		}
	};
	
	var _requestThumbnails = function(){
		_cleanCarrouselAndLoading();
		V.Editor.API.requestThumbnails(_onDataReceived,_onAPIError);
	};

	var _cleanCarrouselAndLoading = function(){
		_cleanCarrousel();
		V.Utils.Loader.startLoadingInContainer($("#"+carrouselDivId));
	};

	var _cleanCarrousel = function(){
		V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
		$("#" + carrouselDivId).hide();
	};

	var _onDataReceived = function(data){
		// if(!thumbnailsData){
		// 	thumbnailsData = data;
		// }
		_loadData(data);
	};

	var _loadData = function(data){
		if((!data.pictures)||(data.pictures.length==0)){
			_stopLoading();
			_drawData(true);
			return;
		}
		
		var carrouselImages = [];
		$.each(data.pictures, function(index, image){
			var myImg = $("<img src='" + image.src + "' title='"+image.title+"' >");
			carrouselImages.push(myImg);
		});

		var options = {};
		options.callback = _onImagesLoaded;
		options.order = true;
		V.Utils.Loader.loadImagesOnContainer(carrouselImages,carrouselDivId,options);
	};
	
	var _onImagesLoaded = function(){
		_stopLoading();
		_drawData();
	};

	var _stopLoading = function(){
		V.Utils.Loader.stopLoadingInContainer($("#"+carrouselDivId));
	};

	var _drawData = function(noResults){
		$("#" + carrouselDivId).show();

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
	};
	
	var _onAPIError = function(){
		_stopLoading();
		_drawData(false);
	};
	
	var _onClickCarrouselElement = function(event){
		var image_url = $(event.target).attr("src");
		V.Editor.Image.addContent(image_url);
	};

	var _isCarrouselVisible = function(){
		var isVisible = $("#" + carrouselDivId).is(":visible");
		if(!isVisible){
			return false;
		}

		return true;
	};

	return {
		init 					: init,
		beforeLoadTab			: beforeLoadTab,
		onLoadTab 				: onLoadTab
	};

}) (VISH, jQuery);
