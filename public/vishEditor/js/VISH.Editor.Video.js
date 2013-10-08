VISH.Editor.Video = (function(V,$,undefined){
		
	var urlDivId = "tab_video_from_url_content";	
		
	var init = function(){
		V.Editor.Video.HTML5.init();
		V.Editor.Video.Repository.init();
		V.Editor.Video.Youtube.init();
		V.Editor.Video.Vimeo.init();

		var urlInput = $("#"+urlDivId).find("input");
		// $(urlInput).watermark(V.I18n.getTrans("i.pasteVideoURL"));

		$("#tab_video_from_url_content .previewButton").click(function(event) {
			if(V.Police.validateObject($(urlInput).val())[0]){
				contentToAdd = V.Editor.Utils.autocompleteUrls($("#" + urlInputId).val());
			V.Editor.Object.drawPreview("tab_video_from_url_content", contentToAdd)
			} else {
				contentToAdd = null;
			}
		});
	};	

  
  var onLoadTab = function(tab){  
	  //Load Video from URL
		$("#tab_video_from_url_content").find("input").val("")
		V.Editor.Object.resetPreview("tab_video_from_url_content");
  }
	
	
  var drawPreviewElement = function(){
    V.Editor.Object.drawPreviewObject(contentToAdd);
  }
			
	return {
		init: init,
		onLoadTab : onLoadTab,
		drawPreviewElement : drawPreviewElement
	};

}) (VISH, jQuery);
