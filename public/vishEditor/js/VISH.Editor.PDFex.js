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
							var responseTest = '{"urls":["http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-0.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-1.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-2.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-3.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-4.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-5.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-6.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-7.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-8.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-9.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-10.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-11.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-12.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-13.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-14.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-15.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-16.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-17.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-18.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-19.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-20.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-21.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-22.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-23.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-24.jpg","http://localhost:3000/system/pdfexes/attaches/000/000/021/original/vish_user_manual-25.jpg"]}';
							processResponse(JSON.parse(responseTest));
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
					//ignore the error
					return;
				}
				V.Utils.Loader.stopLoading();
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
	}	
	
	var processResponse = function(jsonResponse){
		try  {
			var presentation = generatePresentationWithImgArray(jsonResponse.urls);
			V.Editor.Presentation.previewPresentation(presentation);
			//We don't need to call V.Utils.Loader.stopLoading();
			//because previewPresentation close all active fancyboxes
		} catch(e) {
			V.Utils.Loader.stopLoading();	
		}
	}

	var generatePresentationWithImgArray = function(imgs){
		var presentation = {};
		presentation.VEVersion = V.VERSION;
		presentation.type = V.Constant.PRESENTATION;
		presentation.theme = V.Constant.Themes.Default
		presentation.slides = [];
		
		for(var i=0; i<imgs.length; i++){
			var imageUrl = imgs[i];
			presentation.slides.push(_generateSlideWithImg(i,imageUrl));
		}
		return presentation;
	}

	var _generateSlideWithImg = function(index,imgUrl){
		var slide = {};
		slide.id = "article"+index;
		slide.type = V.Constant.STANDARD;
		slide.template = "t10";
		slide.elements = [];

		var element = {};
		element.areaid = "center";
		element.body = imgUrl;
		element.id = slide.id + "_zone1";
		//TODO: calculate style
		// element.style = "position: relative; width:100%; height:100%; top:0%; left:0%;"
		element.type = V.Constant.IMAGE;
		slide.elements.push(element);

		return slide;
	}

	return {
		init 		: init,
		onLoadTab	: onLoadTab
	};

}) (VISH, jQuery);
