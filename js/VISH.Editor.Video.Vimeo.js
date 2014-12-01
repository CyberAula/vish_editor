/*
 * Request videos from VIMEO.
 * Not available yet
 */

VISH.Editor.Video.Vimeo = (function(V,$,undefined){
	
	var containerDivId = "tab_video_vimeo_content";
	var carrouselDivId = "tab_video_vimeo_content_carrousel";
	var previewDivId = "tab_video_vimeo_content_preview";
	var myInput;
	var timestampLastSearch;

	//Store video metadata
	var currentVideos = new Array();
	var selectedVideo = null;
	
	var init = function(){
	};
	
	var beforeLoadTab = function(){
	}
	
	var onLoadTab = function(){
		
	};

	return {
		init 				: init,
		beforeLoadTab 		: beforeLoadTab,
		onLoadTab 			: onLoadTab
	};

}) (VISH, jQuery);
