VISH.Themes = (function(V,$,undefined){

	var selectTheme = function(theme){
		_loadTheme(theme);
		if(V.Editing){
			//save it in the draftPresentation
			var draftPresentation = VISH.Editor.getPresentation();
			if(!draftPresentation){
				draftPresentation = {};
			}
			draftPresentation.theme = theme;
			VISH.Editor.setPresentation(draftPresentation);
			$.fancybox.close();
		}		
	};

	var _loadTheme = function(theme){
		if(!theme){
			theme = "theme1";  //Default theme
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
		selectTheme			: selectTheme
	};

}) (VISH, jQuery);