VISH.Editor.Themes = (function(V,$,undefined){

	var initialized = false;
	var currentTheme;
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
				color: "666"
			};
			themes["theme4"] = {
				number: "4",
				color: "000"
			};
			themes["theme5"] = {
				number: "5",
				color: "fff"
			};
			themes["theme6"] = {
				number: "6",
				color: "555"
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
				color: "666"
			};
			themes["theme10"] = {
				number: "10",
				color: "666"
			};
			themes["theme11"] = {
				number: "11",
				color: "fff"
			};
			themes["theme12"] = {
				number: "12",
				color: "666"
			};
		}
	}

	var selectTheme = function(theme){
		currentTheme = theme;

		V.Themes.loadTheme(theme);

		//Save it in the draftPresentation
		var draftPresentation = V.Editor.getPresentation();
		if(!draftPresentation){
			draftPresentation = {};
		}
		draftPresentation.theme = theme;
		V.Editor.setPresentation(draftPresentation);

		//Refresh colors
		V.Editor.Text.refreshAutoColors();
		
		$.fancybox.close();
	};

	var getCurrentTheme = function(){
		if(currentTheme){
			return themes[currentTheme];
		} else {
			return null;
		}
	}


	return {
		init			: init,
		selectTheme		: selectTheme,
		getCurrentTheme	: getCurrentTheme
	};

}) (VISH, jQuery);