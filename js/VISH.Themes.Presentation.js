VISH.Themes.Presentation = (function(V,$,undefined){

	var init = function(){
	};

	var loadTheme = function(theme,callback){
		if(!theme){
			theme = V.Constant.Themes.Default;
		}
		_unloadAllThemes();
		V.Utils.Loader.loadCSS("themes/" + theme + ".css",callback);
	};

	var _unloadAllThemes = function(){
		var theme_pattern = "(^" + V.StylesheetsPath + "themes/)";
		$("head").find("link[type='text/css']").each(function(index, link) {
			var href = $(link).attr("href");
			if(href){
				if (href.match(theme_pattern)!==null){
					$(link).remove();
				}
			}
		});
	};

	return {
		init		: init,
		loadTheme	: loadTheme
	};

}) (VISH, jQuery);