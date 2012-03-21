VISH.Editor.Video.Repository = (function(V,$,undefined){
	
	var onLoadTab = function(){
		VISH.Editor.Carrousel.createCarrousel("tab_video_repo_content_carrousel",2,VISH.Editor.Video.Repository.onClickCarrouselElement);
	}
	
	var onClickCarrouselElement = function(){
		console.log("onClickCarrouselElement! in VISH.Editor.Video.Repository!")
	}
	
	return {
		onLoadTab					: onLoadTab,
		onClickCarrouselElement : onClickCarrouselElement
	};

}) (VISH, jQuery);
