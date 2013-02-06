VISH.Themes = (function(V,$,undefined){

	var loadTheme = function(theme){
		if(!theme){
			theme = VISH.Constant.Themes.Default;
		}
		_unloadAllThemes();
		V.Utils.loadCSS("themes/" + theme + ".css");
	}

	var _unloadAllThemes = function(){
		var theme_pattern = "(^" + VISH.StylesheetsPath + "themes/)";
		$("head").find("link[type='text/css']").each(function(index, link) {
			var href = $(link).attr("href");
			if(href){
				if (href.match(theme_pattern)!==null){
					$(link).remove();
				}
			}
		});
	}

	return {
		loadTheme	: loadTheme
	};

}) (VISH, jQuery);