VISH.Editor.Image = (function(V,$,undefined){
	
	var contentToAdd = null;
	var contentAddMode = V.Constant.NONE;
	var uploadDivId = "tab_pic_upload_content";
	var urlDivId = "tab_pic_from_url_content";
	var urlInputId = "picture_url";
	
	var init = function(){
		V.Editor.Image.Flikr.init();
		V.Editor.Image.Repository.init();

		//Load from URL
		$("#" + urlDivId + " .previewButton").click(function(event) {
			if(V.Police.validateObject($("#" + urlInputId).val())[0]){
				contentToAdd = V.Editor.Utils.autocompleteUrls($("#" + urlInputId).val());
				V.Editor.Object.drawPreview(urlDivId, contentToAdd)
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

		$("#" + uploadDivId + " #upload_document_submit").click(function(event) {
			if(!V.Police.validateFileUpload($("#" + uploadDivId + " input[name='document[file]']").val())[0]){
				event.preventDefault();
			} else {
				if (options) {
					var description = "Uploaded by " + V.User.getName() + " via Vish Editor";
					$("#" + uploadDivId + " input[name='document[description]']").val(description);
					$("#" + uploadDivId + " input[name='document[owner_id]']").val(V.User.getId());
					$("#" + uploadDivId + " input[name='authenticity_token']").val(V.User.getToken());
					$("#" + uploadDivId + " .documentsForm").attr("action", V.UploadImagePath);

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
			complete: function(xhr) {
				switch(V.Configuration.getConfiguration()["mode"]){
					case V.Constant.NOSERVER:
						processResponse("{\"src\":\"/vishEditor/images/excursion_thumbnails/excursion-01.png\"}");
					break;
					case V.Constant.VISH:
						processResponse(xhr.responseText);
					break;
					case V.Constant.STANDALONE:
						processResponse(xhr.responseText);
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
		V.Editor.Object.resetPreview(urlDivId);
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

		V.Editor.API.requestTags(_onTagsReceived)
	}
	
	var _resetUploadFields = function(){
		var bar = $("#" + uploadDivId + " .upload_progress_bar");
		var percent = $("#" + uploadDivId + " .upload_progress_bar_percent");

		bar.width('0%');
		percent.html('0%');
		V.Editor.Object.resetPreview(uploadDivId)

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
			watermarkAllowMessage: V.Editor.I18n.getTrans("i.AddTags"), watermarkDenyMessage: V.Editor.I18n.getTrans("i.limitReached")});
		}
	}
	
	
	var processResponse = function(response){
		try  {
			var jsonResponse = JSON.parse(response);
			if(jsonResponse.src){
				if (V.Police.validateObject(jsonResponse.src)[0]) {
					V.Editor.Object.drawPreview(uploadDivId,jsonResponse.src);
					contentToAdd = jsonResponse.src;
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
			case V.Constant.FLASHCARD:
				V.Editor.Flashcard.Creator.onBackgroundSelected(contentToAdd);
				break;
			case V.Constant.THUMBNAIL:
				V.Editor.AvatarPicker.onCustomThumbnailSelected(contentToAdd);
				break;
			default:
				V.Editor.Object.drawPreviewObject(contentToAdd);
		}
		//Reset contentAddMode
		contentAddMode = V.Constant.NONE;
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
			current_area = V.Editor.getCurrentArea();
		}

		var newStyle;
		if(style){
			newStyle = V.Editor.Utils.setStyleInPixels(style,current_area);
		} else {
			var image_width = $(current_area).width(); //default image width
			newStyle = "width:"+image_width+"px;";
		}

		var template = V.Editor.getTemplate(); 
		var nextImageId = V.Utils.getId();
		var idToDragAndResize = "draggable" + nextImageId;
		current_area.attr('type','image');
		if(hyperlink){
			current_area.attr('hyperlink',hyperlink);
		}
		current_area.html("<img class='"+template+"_image' id='"+idToDragAndResize+"' draggable='true' title='Click to drag' src='"+image_url+"' style='"+newStyle+"'/>");

		if(!style){
			//Adjust dimensions after drawing (Only after insert new images)
			var theImg = $("#"+idToDragAndResize);
			$(theImg).load(function(){
				var dimentionsToDraw = V.Editor.Utils.dimentionToDraw($(current_area).width(), $(current_area).height(), $(theImg).width(), $(theImg).height());
				$(theImg).width(dimentionsToDraw.width);
				//Prevent incorrect height detections
				if(dimentionsToDraw.height>0){
					$(theImg).height(dimentionsToDraw.height);
				}
			});
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
