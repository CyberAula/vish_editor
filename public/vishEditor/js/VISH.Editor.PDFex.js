VISH.Editor.PDFex = (function(V,$,undefined){
	
	var uploadDivId = "tab_pdfex_content";

	var init = function(){
		var options = V.Editor.getOptions();
		var bar = $("#" + uploadDivId + " .upload_progress_bar");
		var percent = $("#" + uploadDivId + " .upload_progress_bar_percent");

		$("#" + uploadDivId + " input[name='pdfex[file]']").change(function () {
			var filterFilePath = V.Editor.Utils.filterFilePath($("#" + uploadDivId + " input:file").val());
			$("#" + uploadDivId + " input[name='pdfex[title]']").val(filterFilePath);
			_resetUploadFields();
			$("#" + uploadDivId + ' form' + ' .button').show();
			$("#" + uploadDivId + " .upload_progress_bar_wrapper").hide();
		});

		$("#" + uploadDivId + " #upload_pdfex_submit").click(function(event) {
			if(!V.Police.validateFileUpload($("#" + uploadDivId + " input[name='pdfex[file]']").val())[0]){
				event.preventDefault();
			} else {
				if (options) {
					$("#" + uploadDivId + " input[name='pdfex[owner_id]']").val(V.User.getId());
					$("#" + uploadDivId + " input[name='authenticity_token']").val(V.User.getToken());
					$("#" + uploadDivId + " .documentsForm").attr("action", V.UploadPDF2PPath);
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
	
	var onLoadTab = function(){
		$("#" + uploadDivId + ' form' + ' .button').hide();
		$("#" + uploadDivId + " .upload_progress_bar_wrapper").hide();
		$("#" + uploadDivId + " input[name='pdfex[file]']").val("");	
		_resetUploadFields();
	};
	
	var _resetUploadFields = function(){
		var bar = $("#" + uploadDivId + " .upload_progress_bar");
		var percent = $("#" + uploadDivId + " .upload_progress_bar_percent");
		bar.width('0%');
		percent.html('0%');
	}	
	
	var processResponse = function(response){
		try  {
			var jsonResponse = JSON.parse(response);
			console.log("V.Editor.PDFex get response");
			console.log(response);
			console.log(jsonResponse);
		} catch(e) {}
	}

	return {
		init 		: init,
		onLoadTab	: onLoadTab
	};

}) (VISH, jQuery);
