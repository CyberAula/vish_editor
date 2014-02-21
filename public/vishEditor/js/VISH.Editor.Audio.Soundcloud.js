VISH.Editor.Audio.Soundcloud = (function(V,$,undefined){
	
	var containerDivId = "tab_audio_soundcloud_content";
	var carrouselDivId = "tab_audio_soundcloud_content_carrousel";
	var previewDivId = "tab_audio_soundcloud_content_preview";
	var myInput;
	var timestampLastSearch;

	//Store audio metadata
	var currentAudios = new Array();
	var selectedAudio = null;

	var init = function(){
		myInput = $("#" + containerDivId).find("input[type='search']");
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
	};
	
	var onLoadTab = function(){
		
	};
	
	var _requestData = function(text){
		_prepareRequest();
		_searchInSoundcloud(text);
	};

	var _prepareRequest = function(){
		_cleanCarrousel();
		_cleanAudioPreview();
		V.Utils.Loader.startLoadingInContainer($("#"+carrouselDivId));
		$(myInput).attr("disabled","true");
		timestampLastSearch = Date.now();
	};
	
	var _cleanSearch = function(){
		timestampLastSearch = undefined;
		$(myInput).val("");
		$(myInput).removeAttr("disabled");
		_cleanAudioPreview();
		_cleanCarrousel();
	};

	var _cleanCarrousel = function(){
		$("#" + carrouselDivId).hide();
		V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
	};

	var _searchInSoundcloud = function(text){
		$.getJSON("http://api.soundcloud.com/tracks?callback=?",{
			consumer_key: 'bb5aebd03b5d55670ba8fa5b5c3a3da5',
			q: text,
			format: "json"
		},
		function(data) {
			_onDataReceived(data);
		}).error(function(){
			_onAPIError();
		}); 
	};

	var _onDataReceived = function(data){
		if(!_isValidResult()){
			return;
		}

		if((!data)||(data.length==0)){
			_onSearchFinished();
			_drawData(true);
			return;
		}

		currentAudios = new Array();
		var carrouselImages = [];
		var carrouselImagesTitles = [];

		$.each(data, function(i, item){
			var audio = item.uri;
			var title = item.title;
			var author = item.user.username;
			var subtitle = item.description;


			var audioId = item.id;
			currentAudios[audioId] = new Object();
			// Se mantiene igual
			currentAudios[audioId].id = audioId;
			currentAudios[audioId].title = title;
			currentAudios[audioId].author = author;
			currentAudios[audioId].subtitle = subtitle;

			//var image_url = item.artwork_url;
			if(item.artwork_url!= null){
				image_url = item.artwork_url;
			} else {
				image_url = 'http://www.wpclipart.com/computer/disks/cd_grey.png';
			}
			var myImg = $("<img audioId='"+audioId+"' src='"+image_url+"' title='"+title+"'/>");
			carrouselImages.push(myImg);
			carrouselImagesTitles.push(title);
		});
			
		var options = {};
		options.titleArray = carrouselImagesTitles;
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

		V.Editor.Utils.addTmpShown([$("#" + containerDivId),$("#" + carrouselDivId)]);

		if(noResults===true){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'>" + V.I18n.getTrans("i.Noresultsfound") + "</p>");
			V.Editor.Utils.removeTmpShown([$("#" + containerDivId),$("#" + carrouselDivId)]);
		} else if(noResults===false){
			$("#" + carrouselDivId).html("<p class='carrouselNoResults'>" + V.I18n.getTrans("i.errorYoutubeConnection") + "</p>");
			V.Editor.Utils.removeTmpShown([$("#" + containerDivId),$("#" + carrouselDivId)]);
		} else {
			var options = new Array();
			options.rows = 1;
			options.callback = _onClickCarrouselElement;
			options.rowItems = 5;
			options.scrollItems = 5;	
			options.styleClass = "title";
			options.afterCreateCarruselFunction = function(){
				//We need to wait even a little more that afterCreate callback
				setTimeout(function(){
					V.Editor.Utils.removeTmpShown([$("#" + containerDivId),$("#" + carrouselDivId)]);
				},100);
			}
			V.Editor.Carrousel.createCarrousel(carrouselDivId, options);
		}
	};

	var addSelectedAudio = function() {
		if(selectedAudio != null){
			V.Editor.Object.drawObject(_generateWrapper(selectedAudio.id));
			$.fancybox.close();
		}
	};

	var _onAPIError = function(){
		if(_isValidResult()){
			_onSearchFinished();
			_drawData(false);
		}
	};
	
	var _onClickCarrouselElement = function(event) {
		var audioId = $(event.target).attr("audioId");
		var renderedPreviewAudio = _generatePreviewWrapper(audioId);
		_renderAudioPreview(renderedPreviewAudio, currentAudios[audioId]);
		selectedAudio = currentAudios[audioId];
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


	/* Audio Preview */
  
	var _renderAudioPreview = function(renderedIframe, audio) {
		var audioArea = $("#" + previewDivId).find("#tab_audio_soundcloud_content_preview_audio");
		var metadataArea = $("#" + previewDivId).find("#tab_audio_soundcloud_content_preview_metadata");
		var button = $("#" + previewDivId).find(".okButton");
		$(audioArea).html("");
		$(metadataArea).html("");
		if((renderedIframe) && (audio)){
			$(audioArea).append(renderedIframe);
			var table = V.Editor.Utils.generateTable({title:audio.title, author:audio.author, description:audio.subtitle});
			$(metadataArea).html(table);
			$(button).show();
		}
	};
  
	var _cleanAudioPreview = function(){
		var audioArea = $("#" + previewDivId).find("#tab_audio_soundcloud_content_preview_audio");
		var metadataArea = $("#" + previewDivId).find("#tab_audio_soundcloud_content_preview_metadata");
		var button = $("#" + previewDivId).find(".okButton");
		$(audioArea).html("");
		$(metadataArea).html("");
		$(button).hide();
	};

	var _generateWrapper = function(audioId){
		var audio_embedded = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/"+ audioId;
		var wrapper = "<iframe src='"+audio_embedded+"?wmode=opaque' frameborder='0'></iframe>";
		return wrapper;
	};
 
	var _generatePreviewWrapper = function(audioId){
		var audio_embedded = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/"+ audioId;
		var wrapper = '<iframe class="objectPreview" type="text/html" src="'+audio_embedded+'?wmode=opaque" frameborder="0"></iframe>';
		return wrapper;
	};

  return {
		init		  								: init,
		beforeLoadTab								: beforeLoadTab,
		onLoadTab	  								: onLoadTab,
		addSelectedAudio							: addSelectedAudio
  };

}) (VISH, jQuery);
