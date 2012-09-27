VISH.Themes = (function(V,$,undefined){

	var selectTheme = function(theme){
		if(!theme){
			theme = "theme1";  //default theme
		}
		V.Utils.loadCSS(VISH.StylesheetsPath + "themes/" + theme + ".css");

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

	return {
		selectTheme			: selectTheme
	};

}) (VISH, jQuery);