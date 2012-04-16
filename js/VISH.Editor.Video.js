VISH.Editor.Video = (function(V,$,undefined){
		
	var init = function(){
		VISH.Editor.Video.HTML5.init();
		VISH.Editor.Video.Repository.init();
	};	
			
	return {
		init: init
	};

}) (VISH, jQuery);
