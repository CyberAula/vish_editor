VISH.Editor.Object.Web = (function(V,$,undefined){
		
	var init = function(){
	};	

  
  var onLoadTab = function(tab){
  }
	
	
  var drawPreviewElement = function(){
  }
	
	var generateWrapperForWeb = function(url){
		return "<iframe src='" + url + "'></embed>"
	}
	
	var generatePreviewWrapperForWeb = function(url){
		return "<iframe class='objectPreview' src='" + url + "'></embed>"
	}
			
	return {
		init: init,
		onLoadTab : onLoadTab,
		drawPreviewElement : drawPreviewElement,
		generatePreviewWrapperForWeb : generatePreviewWrapperForWeb,
		generateWrapperForWeb : generateWrapperForWeb
	};

}) (VISH, jQuery);
