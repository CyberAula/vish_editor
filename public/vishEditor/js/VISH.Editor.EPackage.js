VISH.Editor.EPackage = (function(V,$,undefined){
		
	var uploadDivId = "tab_epackage_content";
		
	var init = function(){
		//Upload content
		var options = V.Editor.getOptions();
		var tagList = $("#" + uploadDivId + " .tagList");
		var bar = $("#" + uploadDivId + " .upload_progress_bar");
		var percent = $("#" + uploadDivId + " .upload_progress_bar_percent");
    
		$("#" + uploadDivId + " input[name='document[file]']").change(function(){
			var filterFilePath = V.Editor.Utils.filterFilePath($("#" + uploadDivId + " input:file").val());
			$("#" + uploadDivId + " input[name='document[title]']").val(filterFilePath);
			_resetUploadFields();
			$(tagList).parent().show();
			$("#" + uploadDivId + ' form' + ' .button').show();
			$("#" + uploadDivId + " .upload_progress_bar_wrapper").hide();
		});
		
		$("#" + uploadDivId + " #upload_package_submit").click(function(event){
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
			complete: function(xhr) {
				switch(V.Configuration.getConfiguration()["mode"]){
					case V.Constant.NOSERVER:
						// _processResponse(JSON.stringify(V.Samples.SCORMexample));
					break;
					case V.Constant.VISH:
						_processResponse(xhr.responseText);
					break;
					case V.Constant.STANDALONE:
						_processResponse(xhr.responseText);
					break;
				}
				var percentVal = '100%';
				bar.width(percentVal)
				percent.html(percentVal);
			},
			error: function(error){
				V.Debugging.log("Upload error");
				V.Debugging.log(error);
				V.Editor.Utils.showErrorDialog(V.I18n.getTrans("i.ePackageError1"));
			}
		});	
	};

	
	var onLoadTab = function(){
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
		var tagList = $("#" + uploadDivId + " .tagList");
		if($(tagList)[0].children.length!==0){
			$(tagList).tagit("reset");
		}
	};
   
	var _onTagsReceived = function(data){
		var tagList = $("#" + uploadDivId + " .tagList");
		if ($(tagList).children().length == 0){
			$(tagList).tagit({tagSource:data, sortable:true, maxLength:20, maxTags:8 , 
			watermarkAllowMessage: V.I18n.getTrans("i.AddTags"), watermarkDenyMessage: V.I18n.getTrans("i.limitReached")});
		}
	};
	
	var _processResponse = function(response){
		try {
			var jsonResponse = JSON.parse(response);
			if(jsonResponse.src){
				if(V.Police.validateObject(jsonResponse.src)[0]){
					var presentation = _generatePresentationWithEPackage(jsonResponse);
					V.Editor.Presentation.previewPresentation(presentation);
					return;
				}
			}
		} catch(e) {
			//No JSON response
		}
		V.Editor.Utils.showErrorDialog(V.I18n.getTrans("i.ePackageError1"));
	};
	
	var _generatePresentationWithEPackage = function(ePackage){
		var element = {};
		element.type = "object";
		element.body = "<iframe src=\""+ ePackage.src + "\" objecttype=\"" + ePackage.type + "\"></iframe>"
		element.style = "position: relative; width:100%; height:100%; top:0%; left:0%;"

		var elements = [element];
		var options = {
			template : "t10"
		}
		return V.Editor.Presentation.generatePresentationScaffold(elements,options);
	};

	
	return {
		init				: init,
		onLoadTab 			: onLoadTab
	};

}) (VISH, jQuery);
