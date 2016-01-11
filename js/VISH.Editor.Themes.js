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
			themes["theme13"] = {
				number: "13",
				color: "666"
			};
			themes["theme14"] = {
				number: "14",
				color: "000"
			};
			themes["theme15"] = {
				number: "15",
				color: "fff"
			};
			themes["theme16"] = {
				number: "16",
				color: "555"
			};
			themes["theme17"] = {
				number: "17",
				color: "000"
			};
			themes["theme18"] = {
				number: "18",
				color: "000"
			};
			themes["theme19"] = {
				number: "19",
				color: "666"
			};
			themes["theme20"] = {
				number: "20",
				color: "666"
			};
			themes["theme21"] = {
				number: "21",
				color: "fff"
			};
			themes["theme22"] = {
				number: "22",
				color: "fff"
			};
			themes["theme23"] = {
				number: "23",
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

			currentTheme = theme;

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