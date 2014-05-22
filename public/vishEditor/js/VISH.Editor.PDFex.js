VISH.Editor.PDFex = (function(V,$,undefined){
	
	var uploadDivId = "tab_pdfex_content";

	var init = function(){
		var options = V.Editor.getOptions();
		var bar = $("#" + uploadDivId + " .upload_progress_bar");
		var percent = $("#" + uploadDivId + " .upload_progress_bar_percent");

		$("#" + uploadDivId + " input[name='pdfex[attach]']").change(function () {
			var filterFilePath = V.Editor.Utils.filterFilePath($("#" + uploadDivId + " input:file").val());
			$("#" + uploadDivId + " input[name='pdfex[title]']").val(filterFilePath);
			_resetUploadFields();
			$("#" + uploadDivId + ' form' + ' .button').show();
			$("#" + uploadDivId + " .upload_progress_bar_wrapper").hide();
		});

		$("#" + uploadDivId + " #upload_pdfex_submit").click(function(event) {
			if(!V.Police.validateFileUpload($("#" + uploadDivId + " input[name='pdfex[attach]']").val())[0]){
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
				if(percentVal==="100%"){
					V.Utils.Loader.startLoading();
				}
			},
			success: function(responseText, statusText, xhr, form) {
				//responseText == JSON.parse(xhr.responseText)
				switch(V.Configuration.getConfiguration()["mode"]){
					case V.Constant.VISH:
						processResponse(responseText);
						break;
					case V.Constant.STANDALONE:
						processResponse(responseText);
						break;
					default:
						break;
				}
				var percentVal = '100%';
				bar.width(percentVal)
				percent.html(percentVal);
			},
			complete: function(xhr){
				switch(V.Configuration.getConfiguration()["mode"]){
					case V.Constant.NOSERVER:
						setTimeout(function(){
							var responseTest = {};
							responseTest.urls = [];
							for(var v=0; v<13; v++){
								responseTest.urls.push("http://localhost/vishEditor/examples/contents/pdf2p/Presentacion_INTED2013_VishViewer-"+v+".jpg");
							}
							responseTest.pdfexId = 365;
							processResponse(responseTest);
						},10000);
						break;
					case V.Constant.VISH:
					case V.Constant.STANDALONE:
					default:
						break;
				}
			},
			error: function(error){
				if(V.Configuration.getConfiguration()["mode"]===V.Constant.NOSERVER){
					//uncomment to ignore the error
					return; 
				}
				var PDFexAPIError = error;
				V.Utils.Loader.stopLoading(function(){
					if ((typeof PDFexAPIError != "undefined") && (typeof PDFexAPIError.responseText == "string")){
						if (PDFexAPIError.responseText.match(/#PDFexAPIError:1/)){
							//Bad format error
							_showErrorDialog(V.I18n.getTrans("i.pdfErrorNotificationFormat"));
						} else if (PDFexAPIError.responseText.match(/#PDFexAPIError:2/)){
							//Size is too big error
							_showErrorDialog(V.I18n.getTrans("i.pdfErrorNotificationSize"));
						} else if(PDFexAPIError.responseText.match(/#PDFexAPIError:3/)){
							//Too much pages
							_showErrorDialog(V.I18n.getTrans("i.pdfErrorNotificationPages"));
						} else {
							//Generic error
							_showErrorDialog(V.I18n.getTrans("i.pdfErrorNotification"));
						}
					}
				});
			}
		});
	};
	
	var onLoadTab = function(){
		$("#" + uploadDivId + ' form' + ' .button').hide();
		$("#" + uploadDivId + " .upload_progress_bar_wrapper").hide();
		$("#" + uploadDivId + " input[name='pdfex[attach]']").val("");	
		_resetUploadFields();
	};
	
	var _resetUploadFields = function(){
		var bar = $("#" + uploadDivId + " .upload_progress_bar");
		var percent = $("#" + uploadDivId + " .upload_progress_bar_percent");
		bar.width('0%');
		percent.html('0%');
	};	

	var _showErrorDialog = function(msg){
		var options = {};
		options.width = 650;
		options.height = 190;
		options.text = msg;
		var button1 = {};
		button1.text = V.I18n.getTrans("i.Ok");
		button1.callback = function(){
			$.fancybox.close();
		}
		options.buttons = [button1];
		V.Utils.showDialog(options);
	};
	
	var processResponse = function(jsonResponse){
		try  {
			var presentation = _generatePresentationWithImgArray(jsonResponse.urls,jsonResponse.pdfexId);
			V.Editor.Presentation.previewPresentation(presentation);
			//We don't need to call V.Utils.Loader.stopLoading();
			//because previewPresentation close all active fancyboxes
		} catch(e) {
			V.Utils.Loader.stopLoading();	
		}
	};

	var _generatePresentationWithImgArray = function(imgs,pdfexId){
		var elements = [];
		var imgL = imgs.length;
		for(var i=0; i<imgL; i++){
			elements.push({"body": imgs[i], "type": V.Constant.IMAGE});
		}
		var options = {
			template : "t10",
			pdfexId: pdfexId
		}
		return V.Editor.Presentation.generatePresentationScaffold(elements,options);
	};


	return {
		init 		: init,
		onLoadTab	: onLoadTab
	};

}) (VISH, jQuery);
