VISH.Editor.Object.Repository = (function(V,$,undefined){
	
	var containerDivId = "tab_object_repo_content";
	var carrouselDivId = "tab_object_repo_content_carrousel";
	var previewDivId = "tab_object_repo_content_preview";
	var myInput;
	var timestampLastSearch;

	//Store objects metadata
	var currentObject = new Array();
	var selectedObject = null;


	var init = function(){
		myInput = $("#" + containerDivId).find("input[type='search']");
		$(myInput).vewatermark(V.I18n.getTrans("i.SearchContent"));
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
				_requestData($(myInput).val());
				$(myInput).blur();
			}
		});
	};
	
	var beforeLoadTab = function(){
		_cleanSearch();
		_cleanObjectPreview();
	};
	
	var onLoadTab = function(){
		
	};

	var _requestData = function(text){
		_prepareRequest();
		V.Editor.API.requestObjects(text, _onDataReceived, _onAPIError);
	};

	var _prepareRequest = function(){
		_cleanCarrousel();
		_cleanObjectPreview();
		V.Utils.Loader.startLoadingInContainer($("#"+carrouselDivId));
		$(myInput).attr("disabled","true");
		timestampLastSearch = Date.now();
	};

	var _cleanSearch = function(){
		timestampLastSearch = undefined;
		$(myInput).val("");
		$(myInput).removeAttr("disabled");
		_cleanObjectPreview();
		_cleanCarrousel();
	};

	var _cleanCarrousel = function(){
		$("#" + carrouselDivId).hide();
		V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
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

		currentObject = new Array();
		var carrouselImages = [];
		var carrouselImagesTitles = [];
	
		$.each(data, function(index, objectItem){
			if(typeof objectItem.object == "string"){
				objectItem.object = V.Editor.Utils.autocompleteUrls(objectItem.object);
			}

			var objectInfo = V.Object.getObjectInfo(objectItem.object);
			//Ignore type if its explicitly defined in the objectItem provided by the server API
			var objectType = (typeof objectItem.type != "undefined") ? objectItem.type : objectInfo.type;

			var imageSource = null;
			switch (objectType){
				case V.Constant.MEDIA.IMAGE:
					imageSource = V.ImagesPath + "carrousel/image.png";
					break;
				case V.Constant.MEDIA.WEB:
					if(objectInfo.wrapper=="IFRAME"){
						imageSource = V.ImagesPath + "carrousel/iframe.png";
					} else {
						imageSource = V.ImagesPath + "carrousel/object.png";
					}
					break;
				case V.Constant.MEDIA.HTML5_VIDEO:
				case V.Constant.MEDIA.YOUTUBE_VIDEO:
					imageSource = V.ImagesPath + "carrousel/video.png";
					break;
				case V.Constant.MEDIA.HTML5_AUDIO:
					imageSource = V.ImagesPath + "carrousel/audio.png";
					break;
				case V.Constant.MEDIA.FLASH:
					imageSource = V.ImagesPath + "carrousel/swf.png";
					break;

				//Special types defined by the repository
				case V.Constant.MEDIA.SCORM_PACKAGE:
					imageSource = V.ImagesPath + "carrousel/scorm.png";
					break;
				case V.Constant.MEDIA.IMS_QTI_QUIZ:
					imageSource = V.ImagesPath + "carrousel/quizxml.png";
					break;

				default:
					imageSource = V.ImagesPath + "carrousel/object.png";
			};

			var myImg = $("<img src='" + imageSource + "' objectId='" + objectItem.id + "' title='"+objectItem.title+"' objectType='" + objectType + "'>");
			carrouselImages.push(myImg);
			carrouselImagesTitles.push(objectItem.title);
			currentObject[objectItem.id]=objectItem;
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
			options.styleClass = "title";

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
		var objectId = $(event.target).attr("objectid");
		if(typeof objectId != "undefined"){
			var options = {};
			if(typeof currentObject[objectId].type != "undefined"){
				options.forceType = currentObject[objectId].type;
			}
			var renderedObject = V.Editor.Object.renderObjectPreview(currentObject[objectId].object,options);
			_renderObjectPreview(renderedObject,currentObject[objectId]);
			selectedObject = currentObject[objectId]; 
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

	var _renderObjectPreview = function(renderedObject,object){
		var objectArea = $("#" + previewDivId).find("#tab_object_repo_content_preview_object");
		var metadataArea = $("#" + previewDivId).find("#tab_object_repo_content_preview_metadata");
		$(objectArea).html("");
		$(metadataArea).html("");
		if((renderedObject)&&(object)){
			renderedObject = $(renderedObject);
			$(objectArea).append(renderedObject);

			var objectTagName = $(renderedObject)[0].tagName;
			if((objectTagName === "AUDIO")||(objectTagName === "VIDEO")){
				var objectInfo = V.Object.getObjectInfo(object.object);
				var sources = (typeof objectInfo.source == "object") ? objectInfo.source : [{src: objectInfo.source}];
				if(objectTagName == "VIDEO"){
					V.Video.HTML5.addSourcesToVideoTag(sources,renderedObject,{timestamp:true});
				} else if(objectTagName == "AUDIO"){
					V.Audio.HTML5.addSourcesToAudioTag(sources,renderedObject,{timestamp:true});
				}
			}

			var table = V.Editor.Utils.generateTable({title:object.title, author:object.author, description:object.description});
			$(metadataArea).html(table);
			$("#" + previewDivId).find(".okButton").show();
		}
	};
	
	var _cleanObjectPreview = function(){
		var objectArea = $("#" + previewDivId).find("#tab_object_repo_content_preview_object");
		var metadataArea = $("#" + previewDivId).find("#tab_object_repo_content_preview_metadata");
		$(objectArea).html("");
		$(metadataArea).html("");
		$("#" + previewDivId).find(".okButton").hide();
	};
	
	var addSelectedObject = function(){
		if(selectedObject!=null){
			var options = {};
			if(typeof selectedObject.type != "undefined"){
				options.forceType = selectedObject.type;
			}
			V.Editor.Object.drawObject(selectedObject.object,options);
			$.fancybox.close();
		}
	};
	
	return {
		init 				: init,
		beforeLoadTab		: beforeLoadTab,
		onLoadTab 			: onLoadTab,
		addSelectedObject 	: addSelectedObject
	};

}) (VISH, jQuery);
