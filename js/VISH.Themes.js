VISH.Themes = (function(V,$,undefined){

	var _initialized = false;

	var init = function(){
		if(_initialized === true){
			return;
		}

		V.Themes.Core.init();
		V.Themes.Presentation.init();

		_initialized = true;
	};

	return {
		init 	: init
	};

}) (VISH, jQuery);