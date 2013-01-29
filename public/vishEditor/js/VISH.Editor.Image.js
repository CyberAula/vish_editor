VISH.Editor.Image = (function(V,$,undefined){
	
	var contentToAdd = null;
	var contentAddMode = VISH.Constant.NONE;
	var uploadDivId = "tab_pic_upload_content";
	var urlDivId = "tab_pic_from_url_content";
	var urlInputId = "picture_url";
	
	var init = function(){
		VISH.Editor.Image.Flikr.init();
		VISH.Editor.Image.Repository.init();

		//Load from URL
		$("#" + urlDivId + " .previewButton").click(function(event) {
			if(VISH.Police.validateObject($("#" + urlInputId).val())[0]){
				contentToAdd = VISH.Editor.Utils.autocompleteUrls($("#" + urlInputId).val());
				VISH.Editor.Object.drawPreview(urlDivId, contentToAdd)
			}
		});

		//Upload content
		var options = VISH.Editor.getOptions();
		var tagList = $("#" + uploadDivId + " .tagList")
		var bar = $("#" + uploadDivId + " .upload_progress_bar");
		var percent = $("#" + uploadDivId + " .upload_progress_bar_percent");

		$("#" + uploadDivId + " input[name='document[file]']").change(function () {
			var filterFilePath = VISH.Editor.Utils.filterFilePath($("#" + uploadDivId + " input:file").val());
			$("#" + uploadDivId + " input[name='document[title]']").val(filterFilePath);
			_resetUploadFields();
			$(tagList).parent().show();
			$("#" + uploadDivId + ' form' + ' .button').show();
			$("#" + uploadDivId + " .upload_progress_bar_wrapper").hide();
		});

		$("#" + uploadDivId + " #upload_document_submit").click(function(event) {
			if(!VISH.Police.validateFileUpload($("#" + uploadDivId + " input[name='document[file]']").val())[0]){
				event.preventDefault();
			} else {
				if (options) {
					var description = "Uploaded by " + VISH.User.getName() + " via Vish Editor";
					$("#" + uploadDivId + " input[name='document[description]']").val(description);
					$("#" + uploadDivId + " input[name='document[owner_id]']").val(VISH.User.getId());
					$("#" + uploadDivId + " input[name='authenticity_token']").val(VISH.User.getToken());
					$("#" + uploadDivId + " .documentsForm").attr("action", VISH.UploadImagePath);
					$("#" + uploadDivId + " input[name='tags']").val(VISH.Editor.Utils.convertToTagsArray($(tagList).tagit("tags")));
					var tagList = $("#" + uploadDivId + " .tagList");
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
			complete: function(xhr) {
				switch(VISH.Configuration.getConfiguration()["mode"]){
					case VISH.Constant.NOSERVER:
						processResponse("{\"src\":\"/vishEditor/images/excursion_thumbnails/excursion-01.png\"}");
					break;
					case VISH.Constant.VISH:
						processResponse(xhr.responseText);
					break;
					case VISH.Constant.STANDALONE:
						processResponse(xhr.responseText);
					break;
				}
				var percentVal = '100%';
				bar.width(percentVal)
				percent.html(percentVal);
			},
			error: function(error){
				VISH.Debugging.log("Upload error");
				VISH.Debugging.log(error);
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
		VISH.Editor.Object.resetPreview(urlDivId);
		$("#" + urlInputId).val("");
	}
	
	var _onLoadUploadTab = function(){
		contentToAdd = null;

		//Hide and reset elements
		var tagList = $("#" + uploadDivId + " .tagList")
		$(tagList).parent().hide();
		$("#" + uploadDivId + ' form' + ' .button').hide();
		$("#" + uploadDivId + " .upload_progress_bar_wrapper").hide();
		$("#" + uploadDivId + " input[name='document[file]']").val("");	
		_resetUploadFields();

		VISH.Editor.API.requestTags(_onTagsReceived)
	}
	
	var _resetUploadFields = function(){
		var bar = $("#" + uploadDivId + " .upload_progress_bar");
		var percent = $("#" + uploadDivId + " .upload_progress_bar_percent");

		bar.width('0%');
		percent.html('0%');
		VISH.Editor.Object.resetPreview(uploadDivId)

		var tagList = $("#" + uploadDivId + " .tagList")
		if($(tagList)[0].children.length!==0){
			$(tagList).tagit("reset")
		}
	}
	 
	var _onTagsReceived = function(data){
		var tagList = $("#" + uploadDivId + " .tagList");

		if ($(tagList).children().length == 0){
			//Insert the three first tags. //DEPRECATED
			// $.each(data, function(index, tag) {
			// 	if(index==3){
			// 		return false; //break the bucle
			// 	}
			// 	$(tagList).append("<li>" + tag + "</li>")
			// });

			$(tagList).tagit({tagSource:data, sortable:true, maxLength:15, maxTags:8 , 
			watermarkAllowMessage: VISH.Editor.I18n.getTrans("i.AddTags"), watermarkDenyMessage: VISH.Editor.I18n.getTrans("i.limitReached")});
		}
	}
	
	
	var processResponse = function(response){
		try  {
			var jsonResponse = JSON.parse(response)
			if(jsonResponse.src){
				if (VISH.Police.validateObject(jsonResponse.src)[0]) {
					VISH.Editor.Object.drawPreview(uploadDivId,jsonResponse.src)
					contentToAdd = jsonResponse.src
				}
			}
		} catch(e) {
			//No JSON response
		}
	}
	
	var addContent = function(content){
		if(content){
			contentToAdd = content;
		}
		switch(contentAddMode){
			case VISH.Constant.FLASHCARD:
				VISH.Editor.Flashcard.onBackgroundSelected(contentToAdd);
				break;
			case VISH.Constant.THUMBNAIL:
				VISH.Editor.AvatarPicker.onCustomThumbnailSelected(contentToAdd);
				break;
			default:
				VISH.Editor.Object.drawPreviewObject(contentToAdd);
		}
		//Reset contentAddMode
		contentAddMode = VISH.Constant.NONE;
	}
	
   /**
	* Function to draw an image in a zone of the template
	* the zone to draw is the one in current_area
	* this function also makes the image draggable
	* param area: optional param indicating the area to add the image, used for editing presentations
	* param style: optional param with the style, used in editing presentation
	*/
	var drawImage = function(image_url, area, style, hyperlink){    
		_drawImageInArea(image_url, area, style, hyperlink);
	};

	var _drawImageInArea = function(image_url, area, style, hyperlink){
		var current_area;

		if(area){
			current_area = area;
		}	else {
			current_area = VISH.Editor.getCurrentArea();
		}

		var newStyle;
		if(style){
			newStyle = V.Editor.Utils.setStyleInPixels(style,current_area);
		} else {
			var image_width = $(current_area).width(); //default image width
			newStyle = "width:"+image_width+"px;";
		}

		var template = VISH.Editor.getTemplate(); 
		var nextImageId = VISH.Utils.getId();
		var idToDragAndResize = "draggable" + nextImageId;
		current_area.attr('type','image');
		if(hyperlink){
			current_area.attr('hyperlink',hyperlink);
		}
		current_area.html("<img class='"+template+"_image' id='"+idToDragAndResize+"' draggable='true' title='Click to drag' src='"+image_url+"' style='"+newStyle+"'/>");

		if(!style){
			//Adjust dimensions after drawing (Only after insert new images)
			var theImg = $("#"+idToDragAndResize);
			var dimentionsToDraw = VISH.Editor.Utils.dimentionToDraw($(current_area).width(), $(current_area).height(), $(theImg).width(), $(theImg).height());
			$(theImg).height(dimentionsToDraw.height);
			$(theImg).width(dimentionsToDraw.width);
		}

		V.Editor.addDeleteButton(current_area);
		
		$("#" + idToDragAndResize).draggable({
			cursor: "move",
			stop: function(){
				$(this).parent().click();  //call parent click to select it in case it was unselected	
			}
		});

	};

	var setAddContentMode = function(mode){
		contentAddMode = mode;
	}

	return {
		init 				: init,
		onLoadTab 			: onLoadTab,
		drawImage 			: drawImage,
		addContent 			: addContent,
		setAddContentMode	: setAddContentMode
	};

}) (VISH, jQuery);
