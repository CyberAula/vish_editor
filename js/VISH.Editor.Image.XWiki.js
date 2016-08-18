VISH.Editor.Image.XWiki = (function(V,$,undefined){
	
	var containerDivId = "tab_pic_xwiki_content";
	var carrouselDivId = "tab_pic_xwiki_content_carrousel";
	var myInput;
	var timestampLastSearch;
	
	var init = function(){
		myInput = $("#tab_pic_xwiki_content").find("input[type='search']");
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
		_searchInXWiki(text);
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

	var _searchInXWiki = function(text){
		var config = V.Configuration.getConfiguration();
		if (!config.XWiki_url) {
			_onAPIError()
			return;
		}
		var xwikiURL = config.XWiki_url + "MOOC/Code/FindImages?tags=" + text + "&outputSyntax=plain&xpage=plain";
		xwikiURL = V.Utils.checkUrlProtocol(xwikiURL);
		$.getJSON(xwikiURL, function(data) {
			_onDataReceived(data)
		}).error(function() {
			_onAPIError()
		});
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

		//data.images is an array with the results
		var carrouselImages = [];
		$.each(data.items, function(index, item) {
			var myImg = $("<img src='" + item.media.m.replace(/_m/i, "")+"' title='"+item.title+"'/>");
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
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'>" + V.I18n.getTrans("i.errorXWikiConnection") + "</p>");
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
	}
	
	return {
		init 			: init,
		beforeLoadTab	: beforeLoadTab,
		onLoadTab		: onLoadTab
	};

}) (VISH, jQuery);
