VISH.Editor.Themes = (function(V,$,undefined){

	var _initialized = false;

	var init = function(){
		if(_initialized === true){
			return;
		}
		V.Editor.Themes.Presentation.init();
		_initialized = true;
	};

	return {
		init 	: init
	};

}) (VISH, jQuery);