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
			//Get type defined by the server
			var objectType;
			var imageSource = undefined;

			switch (objectItem.type){
				case "Picture":
					objectType = V.Constant.MEDIA.IMAGE;
					imageSource = V.ImagesPath + "carrousel/image.png";
					break;
				case "Link":
					objectType = V.Constant.MEDIA.WEB;
					imageSource = V.ImagesPath + "carrousel/iframe.png";
					break;
				case "Video":
					objectType = V.Constant.MEDIA.HTML5_VIDEO;
					imageSource = V.ImagesPath + "carrousel/video.png";
					objectItem.objectToDraw = V.Video.HTML5.renderVideoFromJSON(objectItem,{loadSources: true, id: V.Utils.getId(), extraClasses: ["preview_video"]});
					break;
				case "Audio":
					objectType = V.Constant.MEDIA.HTML5_AUDIO;
					imageSource = V.ImagesPath + "carrousel/audio.png";
					objectItem.objectToDraw = V.Audio.HTML5.renderAudioFromJSON(objectItem,{loadSources: true, id: V.Utils.getId()});
					break;
				case "Swf":
					objectType = V.Constant.MEDIA.FLASH;
					imageSource = V.ImagesPath + "carrousel/swf.png";
					break;
				case "Scormfile":
					objectType = V.Constant.MEDIA.SCORM_PACKAGE;
					imageSource = V.ImagesPath + "carrousel/scorm.png";
					break;
				case "Webapp":
					objectType = V.Constant.MEDIA.WEB_APP;
					imageSource = V.ImagesPath + "carrousel/webapp.png";
					break;
				case "IMS_QTI_QUIZ":
					objectType = V.Constant.MEDIA.IMS_QTI_QUIZ;
					imageSource = V.ImagesPath + "carrousel/quizxml.png";
					// objectItem.objectToDraw = ...
					break;
				default:
					//Unrecognized. Use VE object module.
					objectType = V.Object.getObjectInfo(objectItem.url_full).type;
					imageSource = V.ImagesPath + "carrousel/object.png";
			};

			objectItem.vetype = objectType;
			if(typeof objectItem.objectToDraw == "undefined"){
				objectItem.objectToDraw = objectItem.url_full;
			}
			if(typeof objectItem.avatar_url != "undefined"){
				imageSource = objectItem.avatar_url;
			}
			var objectId = "objectCarrousel_" + index;
			var myImg = $("<img src='" + imageSource + "' objectId='" + objectId + "' title='"+objectItem.title+"' objectType='" + objectType + "'>");
			carrouselImages.push(myImg);
			carrouselImagesTitles.push(objectItem.title);
			currentObject[objectId]=objectItem;
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
			if(typeof currentObject[objectId].vetype != "undefined"){
				options.forceType = currentObject[objectId].vetype;
			}
			renderedObject = V.Editor.Object.renderObjectPreview(currentObject[objectId].objectToDraw,options);
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
				var sources = object.sources;
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
			if(typeof selectedObject.vetype != "undefined"){
				options.forceType = selectedObject.vetype;
			}
			V.Editor.Object.drawObject(selectedObject.objectToDraw,options);
			$.fancybox.close();
		}
	};

	var _translateViSHEntityType = function(vishObjectType){
		switch (vishObjectType){
			case "Picture":
				objectType = V.Constant.MEDIA.IMAGE;
				break;
			case "Link":
				objectType = V.Constant.MEDIA.WEB;
				break;
			case "Video":
				objectType = V.Constant.MEDIA.HTML5_VIDEO;
				break;
			case "Audio":
				objectType = V.Constant.MEDIA.HTML5_AUDIO;
				break;
			case "Swf":
				objectType = V.Constant.MEDIA.FLASH;
				break;
			case "Scormfile":
				objectType = V.Constant.MEDIA.SCORM_PACKAGE;
				break;
			case "Webapp":
				objectType = V.Constant.MEDIA.WEB_APP;
				break;
			case "IMS_QTI_QUIZ":
				objectType = V.Constant.MEDIA.IMS_QTI_QUIZ;
				break;
			default:
				//Unrecognized. Use VE object module.
				objectType = V.Object.getObjectInfo(objectItem.url_full).type;
		};
		return objectType;
	};
	
	return {
		init 				: init,
		beforeLoadTab		: beforeLoadTab,
		onLoadTab 			: onLoadTab,
		addSelectedObject 	: addSelectedObject
	};

}) (VISH, jQuery);
