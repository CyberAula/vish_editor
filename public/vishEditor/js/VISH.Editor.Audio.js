VISH.Editor.Audio = (function(V,$,undefined){
			
	var init = function(){
		V.Editor.Audio.HTML5.init();
		V.Editor.Audio.Soundcloud.init();
	};

	
	return {
		init : init
	};

}) (VISH, jQuery);
