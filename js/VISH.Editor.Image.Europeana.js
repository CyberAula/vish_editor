VISH.Editor.Image.Europeana = (function(V,$,undefined){
	
	var containerDivId = "tab_pic_europeana_content";
	var carrouselDivId = "tab_pic_europeana_content_carrousel";
	var myInput;
	var timestampLastSearch;

	var europeanaImgBlackList = ["http://www.limburgserfgoed.nl/beeld/icon_book_100x100.png"];
	var maxObjectsToShow = 30;

	var init = function(){
		myInput = $("#tab_pic_europeana_content").find("input[type='search']");
		$(myInput).vewatermark(V.I18n.getTrans("i.SearchContent"));
		$(myInput).keydown(function(event){
			if(event.keyCode == 13) {
				_requestData($(myInput).val());
				$(myInput).blur();
			}
		});
	};
	
	var beforeLoadTab = function(){
		_cleanSearch();
	}
	
	var onLoadTab = function(){
	};

	var _requestData = function(text){
		_prepareRequest();
		_searchInEuropeana(text);
	};

	var _prepareRequest = function(){
		_cleanCarrousel();
		V.Utils.Loader.startLoadingInContainer($("#"+carrouselDivId));
		$(myInput).attr("disabled","true");
		timestampLastSearch = Date.now();
	}

	var _cleanSearch = function(){
		timestampLastSearch = undefined;
		$(myInput).val("");
		$(myInput).removeAttr("disabled");
		_cleanCarrousel();
	}

	var _cleanCarrousel = function(){
		$("#" + carrouselDivId).hide();
		V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
	}

	var _searchInEuropeana = function(text){
		var text = text || "*";
		var urlEuropeana = "http://www.europeana.eu/api/v2/search.json?wskey=" + V.Configuration.getConfiguration()["EuropeanaAPIKEY"] + "&query=" + text + "&qf=TYPE:IMAGE&profile=RICH&media=true&rows=100&qf=IMAGE_SIZE:small&callback=VISH.Editor.Image.Europeana.onEuropeanaSearchCallback";
		urlEuropeana = V.Utils.checkUrlProtocol(urlEuropeana);
		$("#europeana_search_call").remove();
		$("head").append('<script id="europeana_search_call" src="' + urlEuropeana + '"></script>');
	};

	var onEuropeanaSearchCallback = function(data){
		if((data)&&(data.success===true)&&(data.items instanceof Array)){
			_onDataReceived(data);
		} else {
			_onAPIError();
		}
	};

	var _getEuropeanaItemData = function(europeanaItem){
		var data = {};
		if(typeof europeanaItem == "object"){
			if((europeanaItem.title instanceof Array)&&(europeanaItem.title.length > 0)){
				data.title = europeanaItem.title[0];
			}
			if((europeanaItem.edmIsShownBy instanceof Array)&&(europeanaItem.edmIsShownBy.length > 0)){
				data.src = europeanaItem.edmIsShownBy[0];
			}
		}
		return data;
	};

	var _onDataReceived = function(data){
		if(!_isValidResult()){
			return;
		}

		//The received data has an array called "items"
		if((!data)||(!data.items)||(data.items.length==0)){
			_onSearchFinished();
			_drawData(true);
			return;
		}
		var europeanaImgs = [];
		$.each(data.items, function(index, item) {
			var europeanaItemData = _getEuropeanaItemData(item);
			if((typeof europeanaItemData.title == "string")&&(typeof europeanaItemData.src == "string")){
				if(europeanaImgBlackList.indexOf(europeanaItemData.src)==-1){
					europeanaImgs.push(europeanaItemData);
				}
			}
		});

		if(europeanaImgs.length==0){
			_onSearchFinished();
			_drawData(true);
			return;
		} else if(europeanaImgs.length > maxObjectsToShow){
			europeanaImgs = europeanaImgs.slice(0,maxObjectsToShow);
		}

		//data.images is an array with the results
		var carrouselImages = [];
		$.each(europeanaImgs, function(index, item) {
			var myImg = $("<img src='" + item.src +"' title='" + item.title + "'/>");
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
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'>" + V.I18n.getTrans("i.errorEuropeanaConnection") + "</p>");
			V.Utils.removeTempShown([$("#" + containerDivId),$("#" + carrouselDivId)]);
		} else {
			var options = new Array();
			options['rows'] = 2;
			options['callback'] = _onClickCarrouselElement;
			options['rowItems'] = 4;
			options['scrollItems'] = 4;
			options.afterCreateCarruselFunction = function(){
				//We need to wait even a little more that afterCreate callback
				setTimeout(function(){
					V.Utils.removeTempShown([$("#" + containerDivId),$("#" + carrouselDivId)]);
				},100);
			};
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
		var image_url = $(event.target).attr("src");
		V.Editor.Image.addContent(image_url);
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
	
	return {
		init 						: init,
		beforeLoadTab				: beforeLoadTab,
		onLoadTab					: onLoadTab,
		onEuropeanaSearchCallback	: onEuropeanaSearchCallback
	};

}) (VISH, jQuery);