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
				contentToAdd = VISH.Utils.autocompleteUrls($("#" + urlInputId).val());
				VISH.Editor.Object.drawPreview(urlDivId, contentToAdd)
			}
		});

		//Upload content
		var options = VISH.Editor.getOptions();
		var tagList = $("#" + uploadDivId + " .tagList")
		var bar = $("#" + uploadDivId + " .upload_progress_bar");
		var percent = $("#" + uploadDivId + " .upload_progress_bar_percent");

		$("#" + uploadDivId + " input[name='document[file]']").change(function () {
			var filterFilePath = VISH.Utils.filterFilePath($("#" + uploadDivId + " input:file").val());
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
					$("#" + uploadDivId + " input[name='tags']").val(VISH.Utils.convertToTagsArray($(tagList).tagit("tags")));
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
				processResponse(xhr.responseText);
				var percentVal = '100%';
				bar.width(percentVal)
				percent.html(percentVal);
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
		$(tagList).tagit("reset")
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
	* this function also adds the slider and makes the image draggable
	* param area: optional param indicating the area to add the image, used for editing presentations
	* param style: optional param with the style, used in editing presentation
	*/
	var drawImage = function(image_url, area, style, hyperlink){    
		_drawImageInArea(image_url, area, style, hyperlink);
	};

	var _drawImageInArea = function(image_url, area, style, hyperlink){
		var current_area;
		var reference_width = 100; //Minimum image width
		var image_width = 300; //default image width
		var image_height = null;

		if(area){
			current_area = area;
		}	else {
			current_area = VISH.Editor.getCurrentArea();
		}

		if(style){
			style = V.Editor.Utils.setStyleInPixels(style,current_area);
			image_width = V.Editor.Utils.getWidthFromStyle(style,current_area);
		}

		var template = VISH.Editor.getTemplate(); 
		var nextImageId = VISH.Utils.getId();
		var idToDragAndResize = "draggable" + nextImageId;
		current_area.attr('type','image');
		if(hyperlink){
			current_area.attr('hyperlink',hyperlink);
		}
		current_area.html("<img class='"+template+"_image' id='"+idToDragAndResize+"' title='Click to drag' src='"+image_url+"' style='"+style+"'/>");

		V.Editor.addDeleteButton(current_area);

		//the value to set the slider depends on the width if passed in the style, we have saved that value in image_width    
		var scaleFactor = image_width/reference_width;
		$("#menubar").before("<div id='sliderId"+nextImageId+"' class='theslider'><input id='imageSlider"+nextImageId+"' type='slider' name='size' value='"+scaleFactor+"' style='display: none; '></div>");
		    
		$("#imageSlider"+nextImageId).slider({
			from: 1,
			to: 15,
			step: 0.25,
			round: 1,
			dimension: "x",
			skin: "blue",
			onstatechange: function( value ){
				var originalHeight = $("#" + idToDragAndResize).height();
				var originalWidth = $("#" + idToDragAndResize).width();

				//Change width
				var newWidth = reference_width*value;
				$("#" + idToDragAndResize).width(newWidth);

				if(originalHeight===$("#" + idToDragAndResize).height()){
					//change height
					var aspectRatio = originalHeight/originalWidth;
					if(aspectRatio!=0){
						$("#" + idToDragAndResize).height(newWidth*aspectRatio);
					}
				} 
			}
		});

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
