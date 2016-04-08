VISH.Editor.Object = (function(V,$,undefined){
		
	var contentToAdd = null;
	var uploadDivId = "tab_object_upload_content";
	var urlDivId = "tab_object_from_url_content";
	var urlInputId = "object_embed_code";

	var _hiddenLinkToInitObjectSettings;
		

	var init = function(){
		V.Editor.Object.LRE.init();
		V.Editor.Object.Repository.init();
		V.Editor.Object.Live.init();
		V.Editor.Object.Web.init();
		V.Editor.Object.GoogleDOC.init();
		V.Editor.Object.PDF.init();
		V.Editor.Object.Snapshot.init();
		V.Editor.Object.Scorm.init();
		V.Editor.Object.Webapp.init();
		
		var urlInput = $("#"+urlDivId).find("input");
		// $(urlInput).vewatermark(V.I18n.getTrans("i.pasteEmbedObject"));
		
		//Load from URL (embed)
		$("#" + urlDivId + " .previewButton").click(function(event){
			if(V.Police.validateObject($("#" + urlInputId).val())[0]){
				contentToAdd = V.Editor.Utils.autocompleteUrls($("#" + urlInputId).val());
				drawPreview(urlDivId, contentToAdd);
			}
		});
		
		//Upload content
		var options = V.Editor.getOptions();
		var tagList = $("#" + uploadDivId + " .tagList")
		var bar = $("#" + uploadDivId + " .upload_progress_bar");
		var percent = $("#" + uploadDivId + " .upload_progress_bar_percent");
    
		$("#" + uploadDivId + " input[name='document[file]']").change(function () {
			var filterFilePath = V.Editor.Utils.filterFilePath($("#" + uploadDivId + " input:file").val());
			$("#" + uploadDivId + " input[name='document[title]']").val(filterFilePath);
			_resetUploadFields();
			$(tagList).parent().show();
			$("#" + uploadDivId + ' form' + ' .button').show();
			$("#" + uploadDivId + " .upload_progress_bar_wrapper").hide();
		});
		
		
		$("#" + uploadDivId + " .upload_file_submit").click(function(event){
			if(!V.Police.validateFileUpload($("#" + uploadDivId + " input[name='document[file]']").val())[0]){
				event.preventDefault();
			} else {
				if (options) {
					var description = "Uploaded by " + V.User.getName() + " via ViSH Editor"
					$("#" + uploadDivId + " input[name='document[description]']").val(description);
					$("#" + uploadDivId + " input[name='document[owner_id]']").val(V.User.getId());
					$("#" + uploadDivId + " input[name='authenticity_token']").val(V.User.getToken());
					$("#" + uploadDivId + " .documentsForm").attr("action", V.UploadObjectPath);
					var tagList = $("#" + uploadDivId + " .tagList");
					$("#" + uploadDivId + " input[name='document[tag_list]']").val(V.Editor.Utils.convertToTagsArray($(tagList).tagit("tags")));
					$(tagList).parent().hide();
					$("#" + uploadDivId + " .upload_progress_bar_wrapper").show();
				}
			}
		});
    		
        
		$("#" + uploadDivId + ' form').ajaxForm({
			beforeSend: function() {
				var percentVal = '0%';
				bar.width(percentVal);
				percent.html(percentVal);
			},
			uploadProgress: function(event, position, total, percentComplete) {
				var percentVal = percentComplete + '%';
				bar.width(percentVal)
				percent.html(percentVal);
			},
			complete: function(xhr){
				switch(V.Configuration.getConfiguration()["mode"]){
					case V.Constant.VISH:
						processResponse(xhr.responseText);
						break;
					case V.Constant.NOSERVER:
						processResponse("{\"src\":\"/images/excursion_thumbnails/excursion-01.png\"}");
						break;
				}
				var percentVal = '100%';
				bar.width(percentVal)
				percent.html(percentVal);
			},
			error: function(error){
				V.Debugging.log("Upload error");
				V.Debugging.log(error);
			}
		});

		//Object Settings
		_hiddenLinkToInitObjectSettings = $('<a href="#objectSettings_fancybox" style="display:none"></a>');
		$(_hiddenLinkToInitObjectSettings).fancybox({
			'autoDimensions' : false,
			'height': 360,
			'width': 400,
			'scrolling': 'no',
			'showCloseButton': false,
			'padding' : 0,
			"onStart"  : function(data){
				_onStartObjectSettingsFancybox();
			},
			"onComplete" : function(data){
			},
			"onClosed"  : function(data){
			}
		});

		//Settings panel events
		$("#objectSettings_fancybox").find("input[type='checkbox'][name='wappAPI']").change(function(){
			var wappScoreCheckbox = $("#objectSettings_fancybox").find("input[type='checkbox'][name='wappScore']");
			var wappScorePointsDOM = $("#objectSettings_fancybox").find("select[name='wappScorePoints']");
			if(!$(this).is(':checked')){
				V.Editor.Utils.enableElementSettingsField([wappScoreCheckbox,wappScorePointsDOM],false);
			} else {
				V.Editor.Utils.enableElementSettingsField([wappScoreCheckbox],true);
			}
		});

		$("#objectSettings_fancybox").find("input[type='checkbox'][name='wappScore']").change(function(){
			var wappScorePointsDOM = $("#objectSettings_fancybox").find("select[name='wappScorePoints']");
			if(!$(this).is(':checked')){
				V.Editor.Utils.enableElementSettingsField([wappScorePointsDOM],false);
			} else {
				V.Editor.Utils.enableElementSettingsField([wappScorePointsDOM],true);
				$(wappScorePointsDOM).val(10);
			}
		});
	};
	
	var onLoadTab = function(tab){
		if(tab=="upload"){
			_onLoadUploadTab();
		}
		if(tab=="url"){
			_onLoadURLTab();
		}
	};
	
	var _onLoadURLTab = function(){
		contentToAdd = null;
		resetPreview(urlDivId);
		$("#" + urlInputId).val("");
	};
	
	var _onLoadUploadTab = function(){
		contentToAdd = null;
			
		//Hide and reset elements
		var tagList = $("#" + uploadDivId + " .tagList");
		$(tagList).parent().hide();
		$("#" + uploadDivId + ' form' + ' .button').hide();
		$("#" + uploadDivId + " .upload_progress_bar_wrapper").hide();
		$("#" + uploadDivId + " input[name='document[file]']").val("");
		_resetUploadFields();
			
		V.Editor.API.requestTags(_onTagsReceived);
	};
	
	var _resetUploadFields = function(){
		var bar = $("#" + uploadDivId + " .upload_progress_bar");
		var percent = $("#" + uploadDivId + " .upload_progress_bar_percent");

		bar.width('0%');
		percent.html('0%');
		resetPreview(uploadDivId);

		var tagList = $("#" + uploadDivId + " .tagList");
		if($(tagList)[0].children.length!==0){
			$(tagList).tagit("reset");
		}
	};
   
	var _onTagsReceived = function(data){
		var tagList = $("#" + uploadDivId + " .tagList");
		if ($(tagList).children().length == 0){
			var config = V.Configuration.getConfiguration();
			$(tagList).tagit({tagSource:data, sortable:true, maxLength:config.tagsSettings.maxLength, maxTags:config.tagsSettings.maxTags, triggerKeys:config.tagsSettings.triggerKeys, 
			watermarkAllowMessage: V.I18n.getTrans("i.AddTags"), watermarkDenyMessage: V.I18n.getTrans("i.limitReached")});
		}
	};
	
	var processResponse = function(response){
		try  {
			var jsonResponse = JSON.parse(response);
			if(jsonResponse.src){
				if(V.Police.validateObject(jsonResponse.src)[0]){
					var objectToDraw = jsonResponse.src;
					if(jsonResponse.type === V.Constant.MEDIA.SCORM_PACKAGE){
						objectToDraw = V.Editor.Object.Scorm.generateWrapperForScorm(jsonResponse.src);
					} else if(jsonResponse.type === V.Constant.MEDIA.WEB_APP){
						objectToDraw = V.Editor.Object.Webapp.generateWrapper(jsonResponse.src);
					}
					drawPreview(uploadDivId,objectToDraw);
					contentToAdd = objectToDraw;
				}
			}
		} catch(e) {
			//No JSON response
		}
	};
	
	
	//Preview generation for "load" and "upload" tabs
	var previewBackground;
	
	var drawPreview = function(divId,src){
		previewBackground = $("#" + divId + " .previewimgbox").css("background-image");
		$("#" + divId + " .previewimgbox").css("background-image","none");
		$("#" + divId + " .previewimgbox img.imagePreview").remove();
		if($("#" + divId + " .previewimgbox .objectPreview").length>0){
			$("#" + divId + " .previewimgbox .objectPreview").remove();
		}
		var wrapper = $(renderObjectPreview(src));
		$("#" + divId + " .previewimgbox").append(wrapper);
		_loadSources(src,wrapper);
		$("#" + divId + " .previewimgbox button").show();
	};
	
	var resetPreview = function(divId){
		$("#" + divId + " .previewimgbox button").hide();
		$("#" + divId + " .previewimgbox img.imagePreview").remove();
		$("#" + divId + " .previewimgbox .objectPreview").remove();
		if(previewBackground){
			$("#" + divId + " .previewimgbox").css("background-image", previewBackground);
		}
	};
	
	var drawPreviewElement = function(){
		drawPreviewObject(contentToAdd);
	};
	
	var drawPreviewObject = function(content,options){
		if(content){
			drawObject(content,options);
			$.fancybox.close();
		}
	};

	var _loadSources = function(object,tag){
		var objectInfo = V.Object.getObjectInfo(object);
		if((objectInfo.wrapper===V.Constant.WRAPPER.VIDEO)||((objectInfo.wrapper===null)&&(objectInfo.type===V.Constant.MEDIA.HTML5_VIDEO))){
			var sources = (typeof objectInfo.source == "object") ? objectInfo.source : [{src: objectInfo.source}];
			V.Video.HTML5.addSourcesToVideoTag(sources,tag,{timestamp:true});
		} else if((objectInfo.wrapper===V.Constant.WRAPPER.AUDIO)||((objectInfo.wrapper===null)&&(objectInfo.type===V.Constant.MEDIA.HTML5_AUDIO))){
			var sources = (typeof objectInfo.source == "object") ? objectInfo.source : [{src: objectInfo.source}];
			V.Audio.HTML5.addSourcesToAudioTag(sources,tag,{timestamp:true});
		}
	};

	///////////////////////////////////////
	/// OBJECT RESIZING
	///////////////////////////////////////
	
	/*
	* Resize object and its wrapper automatically
	*/
	var resizeObject = function(id,newWidth){
		var parent = $("#" + id).parent();
		var aspectRatio = $("#" + id).width()/$("#" + id).height();

		var newWrapperHeight = Math.round(newWidth/aspectRatio);
		var newWrapperWidth = Math.round(newWidth);
		$(parent).width(newWrapperWidth);
		$(parent).height(newWrapperHeight);

		var zoom = V.Utils.getZoomFromStyle( $("#" + id).attr("style"));

		if(zoom!=1){
			newWidth = newWidth/zoom;
			var newHeight = Math.round(newWidth/aspectRatio);
			newWidth = Math.round(newWidth);
		} else {
			var newHeight = newWrapperHeight;
			var newWidth = newWrapperWidth;
		}

		$("#" + id).width(newWidth);
		$("#" + id).height(newHeight);
	};
	
	
	/*
	 * Resize object and its wrapper automatically
	 */
	var _adjustWrapperOfObject = function(objectID, current_area){
		var proportion = $("#"+objectID).height()/$("#"+objectID).width();

		var maxWidth = current_area.width();
		var maxHeight = current_area.height();

		var width = $("#"+objectID).width();
		var height = $("#"+objectID).height();

		if(width > maxWidth){
			$("#"+objectID).width(maxWidth);
			$("#"+objectID).height(width*proportion);
			width = maxWidth;
			height = $("#"+objectID).height();
		}

		if(height > maxHeight){
			$("#"+objectID).height(maxHeight);
			$("#"+objectID).width(height/proportion);
			width = $("#"+objectID).width();
			height = maxHeight;
		}

		var wrapper = $("#"+objectID).parent();
		if($(wrapper).hasClass("object_wrapper")){
			$(wrapper).height($("#"+objectID).height());
			$(wrapper).width($("#"+objectID).width());
		}
	};
	
		
	/*
	 * Resize object to fix in its wrapper
	 */
	var autofixWrapperedObjectAfterZoom = function(object,zoom){
		var wrapper = $(object).parent();
		$(object).height($(wrapper).height()/zoom);
		$(object).width($(wrapper).width()/zoom);
	}
	
	///////////////////////////////////////
	/// OBJECT DRAW: PREVIEWS
	///////////////////////////////////////
	
	var renderObjectPreview = function(object, options){
		var objectInfo = V.Object.getObjectInfo(object);
		var objectType = objectInfo.type;
		
		if((options)&&(typeof options.forceType == "string")){
			objectType = options.forceType;
		}

		switch (objectInfo.wrapper){
			case null:
				//Draw object preview from source
				switch (objectType) {
					case V.Constant.MEDIA.IMAGE:
						return "<img class='imagePreview' src='" + object + "'></img>";
						break;
					case V.Constant.MEDIA.FLASH:
						object = V.Utils.checkUrlProtocol(V.Utils.addParamToUrl(object,"wmode","opaque"));
						return "<embed class='objectPreview' src='" + object + "'></embed>";
						break;
					case V.Constant.MEDIA.PDF:
						return V.Editor.Object.PDF.generatePreviewWrapper(object);
						break;
					case V.Constant.MEDIA.DOC:
					case V.Constant.MEDIA.PPT:
						return V.Editor.Object.GoogleDOC.generatePreviewWrapper(object);
						break;
					case V.Constant.MEDIA.YOUTUBE_VIDEO:
						return V.Editor.Video.Youtube.generatePreviewWrapperForYoutubeVideoUrl(object);
						break;
					case V.Constant.MEDIA.HTML5_VIDEO:
						return V.Editor.Video.HTML5.renderVideoWithURL(object,{loadSources: false, poster: V.Video.HTML5.getDefaultPosterURL(), extraClasses: ["objectPreview"]});
						break;
					case V.Constant.MEDIA.HTML5_AUDIO:
						return V.Editor.Audio.HTML5.renderAudioWithURL(object,{loadSources: false, extraClasses: ["objectPreview"]});
						break;
					case V.Constant.MEDIA.WEB:
						return V.Editor.Object.Web.generatePreviewWrapperForWeb(object);
						break;
					case V.Constant.MEDIA.SCORM_PACKAGE:
						return V.Editor.Object.Scorm.generatePreviewWrapperForScorm(object);
						break;
					case V.Constant.MEDIA.WEB_APP:
						return V.Editor.Object.Webapp.generatePreviewWrapper(object);
						break;
					default:
						V.Debugging.log("Unrecognized object source type");
						break;
				}
				break;

			case V.Constant.WRAPPER.EMBED:
				return _genericWrapperPreview(object);
				break;
			case V.Constant.WRAPPER.OBJECT:
				return _genericWrapperPreview(object);
				break;
			case V.Constant.WRAPPER.IFRAME:
				if(objectType==V.Constant.MEDIA.SCORM_PACKAGE){
					return V.Editor.Object.Scorm.generatePreviewWrapperForScorm(objectInfo.source);
				} else if(objectType==V.Constant.MEDIA.WEB_APP){
					return V.Editor.Object.Webapp.generatePreviewWrapper(objectInfo.source);
				} else {
					return _genericWrapperPreview(object);
				}
				break;
			case V.Constant.WRAPPER.VIDEO:
				return V.Editor.Video.HTML5.renderVideoFromWrapper(object,{loadSources: false, poster: V.Video.HTML5.getDefaultPosterURL(), extraClasses: ["objectPreview"]});
				break;
			case V.Constant.WRAPPER.AUDIO:
				return V.Editor.Audio.HTML5.renderAudioFromWrapper(object,{loadSources: false, extraClasses: ["objectPreview"]});
				break;
			default:
				V.Debugging.log("Unrecognized object wrapper: " + objectInfo.wrapper);
				break;
		}
	};
	
	var _genericWrapperPreview = function(object){
		var wrapperPreview = $(object);
		$(wrapperPreview).addClass('objectPreview');
		$(wrapperPreview).attr('wmode','opaque');
		$(wrapperPreview).removeAttr('width');
		$(wrapperPreview).removeAttr('height');
		if(typeof $(wrapperPreview).attr("src") != "undefined"){
			$(wrapperPreview).attr("src",V.Utils.checkUrlProtocol($(wrapperPreview).attr("src")));
		}
		//Force scrolling auto if the wrapper has specified the scrolling param
		if(typeof $(wrapperPreview).attr("scrolling") != "undefined"){
			$(wrapperPreview).attr("scrolling","auto");
		}
		return wrapperPreview;
	};
	
	
	
	///////////////////////////////////////
	/// OBJECT DRAW: Draw objects in slides
	///////////////////////////////////////
	
   /**
	* Returns a object prepared to draw.
	* param options.area: optional param indicating the area to add the object, used for editing presentations
	* param options.style: optional param with the style, used in editing presentation
	*/
	var drawObject = function(object,options){
		if(!V.Police.validateObject(object)[0]){
			return;
		}

		//Defaults
		options = (typeof options == "undefined" ? {} : options);
		var objectInfo = V.Object.getObjectInfo(object);
		var current_area = V.Editor.getCurrentArea();
		var object_style = "";
		var zoomInStyle;

		if(options){
			if(options.area){
				current_area = options.area;
			}
			if(options.style){
				object_style = options.style;
			}
			if(options.zoomInStyle){
				zoomInStyle = options.zoomInStyle;
			}
			if(options.forceType){
				objectInfo.type = options.forceType;
			}
		}

		switch (objectInfo.wrapper) {
			case null:
				//Draw object from source
				switch (objectInfo.type) {
					case V.Constant.MEDIA.IMAGE:
						V.Editor.Image.drawImage(object);
						break;
					case V.Constant.MEDIA.FLASH:
						V.Editor.Object.Flash.drawFlashObjectWithSource(object, object_style);
						break;
					case V.Constant.MEDIA.PDF:
						options.wrapperGenerated = true;
						return drawObject(V.Editor.Object.PDF.generateWrapper(objectInfo.source),options);
					case V.Constant.MEDIA.DOC:
					case V.Constant.MEDIA.PPT:
						return drawObject(V.Editor.Object.GoogleDOC.generateWrapper(object),options);
					case V.Constant.MEDIA.YOUTUBE_VIDEO:
						return drawObject(V.Editor.Video.Youtube.generateWrapperForYoutubeVideoUrl(object),options);
					case V.Constant.MEDIA.HTML5_VIDEO:
						V.Editor.Video.HTML5.drawVideoWithUrl(object);
						break;
					case V.Constant.MEDIA.HTML5_AUDIO:
						V.Editor.Audio.HTML5.drawAudioWithUrl(object);
						break;
					case V.Constant.MEDIA.WEB:
						return drawObject(V.Editor.Object.Web.generateWrapperForWeb(object),options);
					case V.Constant.MEDIA.SCORM_PACKAGE:
						return drawObject(V.Editor.Object.Scorm.generateWrapperForScorm(object),options);
					case V.Constant.MEDIA.WEB_APP:
						return drawObject(V.Editor.Object.Webapp.generateWrapper(object),options);
					default:
						V.Debugging.log("Unrecognized object source type: " + objectInfo.type);
						break;
				}
				break;

			case V.Constant.WRAPPER.EMBED:
			case V.Constant.WRAPPER.OBJECT:
			case V.Constant.WRAPPER.IFRAME:
				if(([V.Constant.MEDIA.PDF].indexOf(objectInfo.type)!=-1)&&(!options.wrapperGenerated)){
					return drawObject(objectInfo.source,options);
				}
				drawObjectWithWrapper(object, current_area, object_style, zoomInStyle);
				break;

			case V.Constant.WRAPPER.VIDEO:
				V.Editor.Video.HTML5.drawVideoWithWrapper(object);
				break;

			case V.Constant.WRAPPER.AUDIO:
				V.Editor.Audio.HTML5.drawAudioWithWrapper(object);
				break;

			default:
				V.Debugging.log("Unrecognized object wrapper: " + objectInfo.wrapper);
				break;
		}

		//Finally load the tools in the toolbar
		V.Editor.Tools.loadToolsForZone(current_area);
	};
	
	/**
	 * param style: optional param with the style, used in editing presentation
	 */
	var drawObjectWithWrapper = function(wrapper, current_area, style, zoomInStyle){
		var template = V.Editor.getTemplate(current_area);
		var nextWrapperId = V.Utils.getId();
		var idToDrag = "draggable" + nextWrapperId;
		var idToResize = "resizable" + nextWrapperId;
		current_area.attr('type', 'object');
		var wrapperDiv = document.createElement('div');
		wrapperDiv.setAttribute('id', idToDrag);
		wrapperDiv.setAttribute('draggable', true);
		if(style){
			wrapperDiv.setAttribute('style', style);
		}
		$(wrapperDiv).addClass('object_wrapper');

		var wrapperTag = $(wrapper);
		$(wrapperTag).attr('id', idToResize);
		$(wrapperTag).css('pointer-events', "none");
		$(wrapperTag).attr('class', template + "_object");
		$(wrapperTag).attr('wmode', "opaque");
		//Force scrolling auto if the wrapper has specified the scrolling param
		if(typeof $(wrapperTag).attr("scrolling") != "undefined"){
			$(wrapperTag).attr("scrolling","auto");
		}

		$(current_area).html("");
		$(current_area).append(wrapperDiv);

		V.Editor.addDeleteButton($(current_area));
			
		$(wrapperDiv).append(wrapperTag);
		
		$("#" + idToDrag).draggable({
			cursor : "move"
		});

		_adjustWrapperOfObject(idToResize, current_area);

		//Add toolbar
		V.Editor.Tools.loadToolbarForObject(wrapper);

		if(zoomInStyle){
			$(wrapperTag).attr('style', zoomInStyle);
			V.ObjectPlayer.adjustDimensionsAfterZoom($(wrapperTag));
		}

		var objectTypeAttr = $(wrapperTag).attr('objecttype');
		if(objectTypeAttr == V.Constant.MEDIA.SCORM_PACKAGE){
			V.Editor.Object.Scorm.afterDrawSCORM(wrapperTag);
		} else if(objectTypeAttr == V.Constant.MEDIA.WEB_APP){
			V.Editor.Object.Webapp.afterDraw(wrapperTag);
		}
	};

	/////////////////
	// Object Settings
	/////////////////

	var showObjectSettings = function(){
		$(_hiddenLinkToInitObjectSettings).trigger("click");
	};

	var _onStartObjectSettingsFancybox = function(){
		var oSF = $("#objectSettings_fancybox");

		//Get object
		var area = V.Editor.getCurrentArea();
		var object = $(area).find("div.object_wrapper").children().first();
		var objectInfo = V.Object.getObjectInfo(object);

		$(oSF).find("input[type='hidden'][name='elId']").val($(area).attr("id"));
		
		//Load Settings
		var oSettings = {};
		var unloadObject = true;
		
		try {
			oSettings = JSON.parse($(area).attr("elSettings"));
		} catch(e){}

		if(typeof oSettings.unloadObject != "undefined"){
			unloadObject = oSettings.unloadObject;
		}

		if(objectInfo.type===V.Constant.MEDIA.FLASH){
			//Unload object should be true for flash files.
			unloadObject = true;
		}

		//WAPPs
		var showWAPPSettings = (objectInfo.type===V.Constant.MEDIA.WEB_APP);
		if(showWAPPSettings){
			var wappAPI = oSettings.wappAPI_supported;
			var wappScore = false;
			var wappScorePoints = 0;

			if(typeof oSettings.wappAPI != "undefined"){
				wappAPI = oSettings.wappAPI;
			}
			if(typeof oSettings.wappScore != "undefined"){
				wappScore = oSettings.wappScore && wappAPI;
			}
			
			if((typeof oSettings.wappScorePoints != "undefined")&&(oSettings.wappScore===true)){
				wappScorePoints = oSettings.wappScorePoints;
			} else {
				if(wappScore){
					wappScorePoints = 10;
				}
			}
		}

		//Fill and reset form

		//Unload object
		var unloadObjectCheckbox = $(oSF).find("input[type='checkbox'][name='unloadObject']");
		$(unloadObjectCheckbox).prop('checked', unloadObject);

		if(objectInfo.type===V.Constant.MEDIA.FLASH){
			V.Editor.Utils.enableElementSettingsField(unloadObjectCheckbox,false);
		} else {
			V.Editor.Utils.enableElementSettingsField(unloadObjectCheckbox,true);
		}

		if(showWAPPSettings){
			$(oSF).find("div.wapp_settings").show();

			var wappAPICheckbox = $(oSF).find("input[type='checkbox'][name='wappAPI']");
			$(wappAPICheckbox).prop('checked', wappAPI);

			var wappScoreCheckbox = $(oSF).find("input[type='checkbox'][name='wappScore']");
			$(wappScoreCheckbox).prop('checked', wappScore);

			var wappScorePointsDOM = $(oSF).find("select[name='wappScorePoints']");
			$(wappScorePointsDOM).val(wappScorePoints);

			if(oSettings.wappAPI_supported!==true){
				V.Editor.Utils.enableElementSettingsField([wappAPICheckbox,wappScoreCheckbox,wappScorePointsDOM],false);
			} else {
				V.Editor.Utils.enableElementSettingsField([wappAPICheckbox,wappScoreCheckbox],true);
				V.Editor.Utils.enableElementSettingsField(wappScorePointsDOM,wappScore);
			}

		} else {
			$(oSF).find("div.wapp_settings").hide();
		}
	};

	var onObjectSettingsDone = function(){
		var oSF = $("#objectSettings_fancybox");

		//Get area and object
		var areaId = $(oSF).find("input[type='hidden'][name='elId']").val();
		var area = $("#"+areaId);
		var object = $(area).find("div.object_wrapper").children().first();
		var objectInfo = V.Object.getObjectInfo(object);

		//Get previous settings
		var oSettings = {};
		try {
			oSettings = JSON.parse($(area).attr("elsettings"));
		} catch(e) {}
		
		//Get new settings
		oSettings.unloadObject = $(oSF).find("input[type='checkbox'][name='unloadObject']").is(":checked");

		if(objectInfo.type===V.Constant.MEDIA.WEB_APP){
			oSettings.wappAPI = $(oSF).find("input[type='checkbox'][name='wappAPI']").is(":checked");
			oSettings.wappScore = (oSettings.wappAPI && $(oSF).find("input[type='checkbox'][name='wappScore']").is(":checked"));
			
			var wappScorePointsDOM = $(oSF).find("select[name='wappScorePoints']");
			if((oSettings.wappScore)&&(!$(wappScorePointsDOM).is(":disabled"))){
				oSettings.wappScorePoints = $(wappScorePointsDOM).val();
			} else {
				delete oSettings.wappScorePoints;
			}
		} else {
			delete oSettings.wappAPI;
			delete oSettings.wappScore;
			delete oSettings.wappScorePoints;
		}

		//Save Settings
		var oSSerialized = JSON.stringify(oSettings);
		$(area).attr("elSettings",oSSerialized);

		$.fancybox.close();
	};
	
	
	return {
		init							: init,
		onLoadTab 						: onLoadTab,
		drawObject						: drawObject,
		renderObjectPreview 			: renderObjectPreview,
		resizeObject 					: resizeObject,
		autofixWrapperedObjectAfterZoom : autofixWrapperedObjectAfterZoom,
		drawPreview 					: drawPreview,
		resetPreview 					: resetPreview,
		drawPreviewElement				: drawPreviewElement,
		drawPreviewObject				: drawPreviewObject,
		showObjectSettings				: showObjectSettings,
		onObjectSettingsDone			: onObjectSettingsDone
	};

}) (VISH, jQuery);
