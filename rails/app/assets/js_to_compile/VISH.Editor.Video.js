VISH.Editor.Video = (function(V,$,undefined){
		
	var init = function(){
		VISH.Editor.Video.HTML5.init();
		VISH.Editor.Video.Repository.init();
		VISH.Editor.Video.Youtube.init();
	};	
			
	return {
		init: init
	};

}) (VISH, jQuery);
