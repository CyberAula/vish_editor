VISH.Editor.Video = (function(V,$,undefined){
		
	var contentToAdd = null;
	var contentAddMode = V.Constant.NONE;

	var urlDivId = "tab_video_from_url_content";
		
	var init = function(){
		V.Editor.Video.HTML5.init();
		V.Editor.Video.Repository.init();
		V.Editor.Video.Youtube.init();
		V.Editor.Video.Vimeo.init();

		var urlInput = $("#"+urlDivId).find("input");
		// $(urlInput).vewatermark(V.I18n.getTrans("i.pasteVideoURL"));

		$("#tab_video_from_url_content .previewButton").click(function(event){
			if(V.Police.validateObject($(urlInput).val())[0]){
				contentToAdd = V.Editor.Utils.autocompleteUrls($(urlInput).val());
				V.Editor.Object.drawPreview("tab_video_from_url_content", contentToAdd);
			} else {
				contentToAdd = null;
			}
		});
	};	

	var onLoadTab = function(tab){
		//Load Video from URL
		$("#tab_video_from_url_content").find("input").val("")
		V.Editor.Object.resetPreview("tab_video_from_url_content");
	};
	
	var addContent = function(content,options){
		if(content){
			contentToAdd = content;
		}
		switch(contentAddMode){
			case V.Constant.EVIDEO:
				V.Editor.EVideo.onVideoSelected(contentToAdd);
				break;
			default:
				V.Editor.Object.drawPreviewObject(contentToAdd);
		}
		contentAddMode = V.Constant.NONE;
	};

	var getAddContentMode = function(){
		return contentAddMode;
	};

	var setAddContentMode = function(mode){
		V.Editor.Utils.hideNonDefaultTabs();
		switch(mode){
			case V.Constant.NONE:
				break;
			case V.Constant.EVIDEO:
				$("#tab_audio_soundcloud").hide();
				break;
		}
		contentAddMode = mode;
	};
			
	return {
		init				: init,
		onLoadTab 			: onLoadTab,
		addContent 			: addContent,
		getAddContentMode	: getAddContentMode,
		setAddContentMode	: setAddContentMode
	};

}) (VISH, jQuery);
