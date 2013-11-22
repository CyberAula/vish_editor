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

	var onThemeSelected = function(event){
		event.preventDefault();
		var themeNumber = $(event.currentTarget).attr("theme");
		if($(event.target).hasClass("waitCursor")){
			return;
		}
		selectTheme(themeNumber,true);
		V.Editor.Settings.selectTheme(themes[themeNumber].number);
	}

	var selectTheme = function(theme,fromFancybox,callback){
		if(fromFancybox){
			$("#theme_fancybox").addClass("waitCursor");
			$(".themethumb").addClass("waitCursor");
		}

		V.Themes.loadTheme(theme, function(){
			//Theme loaded callback

			//Save it in the draftPresentation
			var draftPresentation = V.Editor.getPresentation();
			if(!draftPresentation){
				draftPresentation = {};
			}
			draftPresentation.theme = theme;
			currentTheme = theme;
			V.Editor.setPresentation(draftPresentation);

			//Refresh colors
			V.Editor.Text.refreshAutoColors();
			
			//Reset Tooltips
			V.Editor.Tools.setAllTooltipMargins(function(){
				if(fromFancybox){
					$.fancybox.close();
					$("#theme_fancybox").removeClass("waitCursor");
					$(".themethumb").removeClass("waitCursor");
				}
				if(typeof callback == "function"){
					callback();
				}
			});
		});
	};

	var getCurrentTheme = function(){
		if(currentTheme){
			return themes[currentTheme];
		} else {
			return themes[VISH.Constant.Themes.Default];
		}
	}


	return {
		init			: init,
		onThemeSelected	: onThemeSelected,
		selectTheme		: selectTheme,
		getCurrentTheme	: getCurrentTheme
	};

}) (VISH, jQuery);