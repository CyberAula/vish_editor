VISH.Editor.Themes.Presentation = (function(V,$,undefined){

	var _initialized = false;
	var _currentTheme;
	var _themes = {};

	var init = function(){
		if(_initialized === true){
			return;
		}
		_loadThemes();
		_enableThemes(getAvailableThemes());

		_initialized = true;
	};

	var _loadThemes = function(){
		_themes["theme1"] = {
			number: "1",
			color: "000"
		};
		_themes["theme2"] = {
			number: "2",
			color: "fff"
		};
		_themes["theme3"] = {
			number: "3",
			color: "666"
		};
		_themes["theme4"] = {
			number: "4",
			color: "000"
		};
		_themes["theme5"] = {
			number: "5",
			color: "fff"
		};
		_themes["theme6"] = {
			number: "6",
			color: "555"
		};
		_themes["theme7"] = {
			number: "7",
			color: "000"
		};
		_themes["theme8"] = {
			number: "8",
			color: "000"
		};
		_themes["theme9"] = {
			number: "9",
			color: "666"
		};
		_themes["theme10"] = {
			number: "10",
			color: "666"
		};
		_themes["theme11"] = {
			number: "11",
			color: "fff"
		};
		_themes["theme12"] = {
			number: "12",
			color: "666",
			thumbnail: "select.gif"
		};
		_themes["theme13"] = {
			number: "13",
			color: "666"
		};
		_themes["theme14"] = {
			number: "14",
			color: "000"
		};
		_themes["theme15"] = {
			number: "15",
			color: "fff"
		};
		_themes["theme16"] = {
			number: "16",
			color: "555"
		};
		_themes["theme17"] = {
			number: "17",
			color: "000"
		};
		_themes["theme18"] = {
			number: "18",
			color: "000"
		};
		_themes["theme19"] = {
			number: "19",
			color: "666"
		};
		_themes["theme20"] = {
			number: "20",
			color: "666"
		};
		_themes["theme21"] = {
			number: "21",
			color: "fff"
		};
		_themes["theme22"] = {
			number: "22",
			color: "fff"
		};
		_themes["theme23"] = {
			number: "23",
			color: "fff"
		};
		_themes["theme24"] = {
			number: "24",
			color: "000"
		};
	};

	var _enableThemes = function(themes){
		for(var i=0; i<themes.length; i++){
			var theme = themes[i];
			
			//Enable theme
			var elem = $("<div id='select_" + theme + "' class='slidethumb'></div>");

			switch(i+1) {
			case 1:
				$(elem).addClass("row1");
				$(elem).addClass("col1");
				break;
			case 2:
			case 3:
			case 4:
				$(elem).addClass("row1");
				break;
			case 5:
			case 9:
				$(elem).addClass("col1");
				break;
			default:
			}

			if(typeof _themes[theme].thumbnail == "string"){
				var thumbName = _themes[theme].thumbnail;
			} else {
				var thumbName = "select.png";
			}

			$(elem).append("<img src='" + V.ImagesPath + "themes/" + theme + "/" + thumbName + "' class='themethumb' theme='" + theme + "'/>");
			$("#theme_fancybox").append(elem);
		}
	};

	var getAvailableThemes = function(){
		var configuration = V.Configuration.getConfiguration();
		if((typeof configuration["available_themes"] == "object")&&(configuration["available_themes"] instanceof Array)&&(configuration["available_themes"].length > 0)){
			return configuration["available_themes"].slice(0,12);
		}
		return _getDefaultAvailableThemes();
	};

	var _getDefaultAvailableThemes = function(){
		return ["theme1","theme13","theme14","theme15","theme16","theme17","theme18","theme19","theme20","theme21","theme22","theme23"];
	};

	var onThemeSelected = function(event){
		event.preventDefault();
		var themeNumber = $(event.currentTarget).attr("theme");
		if($(event.target).hasClass("waitCursor")){
			return;
		}
		selectTheme(themeNumber,true);
		V.Editor.Settings.selectTheme(_themes[themeNumber].number);
	};

	var selectTheme = function(theme,fromFancybox,callback){
		if(fromFancybox){
			$("#theme_fancybox").addClass("waitCursor");
			$(".themethumb").addClass("waitCursor");
		}

		V.Themes.Presentation.loadTheme(theme, function(){
			//Theme loaded callback
			_currentTheme = theme;

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
		if(_currentTheme){
			return _themes[_currentTheme];
		} else {
			return _themes[V.Constant.Themes.Default];
		}
	};

	return {
		init				: init,
		getAvailableThemes	: getAvailableThemes,
		onThemeSelected		: onThemeSelected,
		selectTheme			: selectTheme,
		getCurrentTheme		: getCurrentTheme
	};

}) (VISH, jQuery);