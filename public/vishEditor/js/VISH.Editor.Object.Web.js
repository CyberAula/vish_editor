VISH.Editor.Object.Web = (function(V,$,undefined){
		
	var contentToAdd = null;	
	var urlDivId = "tab_object_from_web_content";
	var urlInputId = "object_embedWeb_code";
		
	var init = function(){
		var urlInput = $(urlDivId ).find("input");
		$(urlInput).watermark('Paste website URL');

		//Load from URL
		$("#" + urlDivId + " .previewButton").click(function(event) {
			if(V.Police.validateObject($("#" + urlInputId).val())[0]){
				contentToAdd = V.Editor.Utils.autocompleteUrls($("#" + urlInputId).val());
				V.Editor.Object.drawPreview(urlDivId, contentToAdd);  
			}
		});
	};	

  
	var onLoadTab = function(tab){
		contentToAdd = null;
		V.Editor.Object.resetPreview(urlDivId);
		$("#" + urlInputId).val("");
	}
	
	var drawPreviewElement = function(){
		V.Editor.Object.drawPreviewObject(contentToAdd);
	}
	
	var generateWrapperForWeb = function(url){
		return "<iframe src='" + url + "?wmode=transparent'></iframe>"
	}
	
	var generatePreviewWrapperForWeb = function(url){
		return "<iframe class='objectPreview' src='" + url + "'></iframe>"
	}
			
	return {
		init : 							init,
		onLoadTab : 					onLoadTab,
		drawPreviewElement : 			drawPreviewElement,
		generatePreviewWrapperForWeb : 	generatePreviewWrapperForWeb,
		generateWrapperForWeb : 		generateWrapperForWeb
	};

}) (VISH, jQuery);
