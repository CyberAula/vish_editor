VISH.Editor.Themes.Core = (function(V,$,undefined){

	var _initialized = false;
	var _theme = {};

	var init = function(){
		if(_initialized === true){
			return;
		}
	};

	var applyConfigTheme = function(callback){
		var configuration = V.Configuration.getConfiguration();
		if(typeof configuration["ve_theme"] == "object"){
			_theme = configuration["ve_theme"];
			return _applyTheme(_theme,callback);
		}
		if(typeof callback == "function"){
			callback(_theme);
		}
	};

	var _applyTheme = function(theme,callback){
		if(typeof theme == "object"){
			if(typeof theme["cssPath"] == "string"){
				V.Utils.Loader.loadCSS(theme["cssPath"],function(){
					//On CSS loaded
					_applyThemeAfterCssLoaded(theme,callback);
				});
			} else {
				_applyThemeAfterCssLoaded(theme,callback);
			}
		} else {
			if(typeof callback == "function"){
				callback(_theme);
			}
		}
	};

	var _applyThemeAfterCssLoaded = function(theme,callback){
		if(typeof callback == "function"){
			callback(_theme);
		}
	};

	var getCurrentTheme = function(){
		return _theme;
	};

	var onThemeCallback = function(options,presentation){
		if((typeof _theme == "object")&&(typeof _theme["callback"]=="function")){
			_theme["callback"](V,options,presentation);
		}
	};


	return {
		init				: init,
		applyConfigTheme	: applyConfigTheme,
		getCurrentTheme		: getCurrentTheme,
		onThemeCallback		: onThemeCallback
	};

}) (VISH, jQuery);