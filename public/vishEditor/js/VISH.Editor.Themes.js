VISH.Editor.Themes = (function(V,$,undefined){

	var initialized = false;
	var themes = {};

	var init = function(){
		if(!initialized){
			themes["theme1"] = {
				number: "1",
				color: "000"
			};
			themes["theme2"] = {
				number: "2",
				color: "fff"
			};
			themes["theme3"] = {
				number: "3",
				color: "555"
			};
			themes["theme4"] = {
				number: "4",
				color: "000"
			};
			themes["theme5"] = {
				number: "5",
				color: "000"
			};
			themes["theme6"] = {
				number: "6",
				color: "000"
			};
			themes["theme7"] = {
				number: "7",
				color: "000"
			};
			themes["theme8"] = {
				number: "8",
				color: "000"
			};
			themes["theme9"] = {
				number: "9",
				color: "000"
			};
			themes["theme10"] = {
				number: "10",
				color: "000"
			};
			themes["theme11"] = {
				number: "11",
				color: "000"
			};
			themes["theme12"] = {
				number: "12",
				color: "000"
			};
		}
	}

	var selectTheme = function(theme){
		V.Themes.loadTheme(theme);

		//Save it in the draftPresentation
		var draftPresentation = VISH.Editor.getPresentation();
		if(!draftPresentation){
			draftPresentation = {};
		}
		draftPresentation.theme = theme;
		VISH.Editor.setPresentation(draftPresentation);

		//Refresh colors
		VISH.Editor.Text.refreshAutoColors();
		
		$.fancybox.close();
	};

	var getCurrentTheme = function(){
		var themeId;
		var draftPresentation = VISH.Editor.getPresentation();
		if((draftPresentation)&&(draftPresentation.theme)){
			themeId = draftPresentation.theme;
		} else {
			themeId = VISH.Constant.Themes.Default;
		}
		return themes[themeId];
	}


	return {
		init			: init,
		selectTheme		: selectTheme,
		getCurrentTheme	: getCurrentTheme
	};

}) (VISH, jQuery);