VISH.I18n = (function(V,$,undefined){
	
	var DEFAULT_ENV = "vish";
	var DEFAULT_LANGUAGE = "en";

	var _availableLocales;
	var _language;
	var _translations;
	var _defaultTranslations;
	

	/**
	 * Init I18n module
	 */
	var init = function(options, presentation){
		_availableLocales = _getAvailableLocales();
		
		//Get language
		//1. Language specified by options
		if(_isValidLocale(options.lang)){
			_language = options.lang;
		} else {
			//2. Browser language
			var browserLang = (navigator.language || navigator.userLanguage);
			if(_isValidLocale(browserLang)){
				_language = browserLang;
			} else {
				//3. LO language
				if((typeof presentation == "object")&&(_isValidLocale(presentation.language))){
					_language = presentation.language;
				} else {
					//4. Default language
					_language = DEFAULT_LANGUAGE;
				}
			}
		}

		_translations = i18n[DEFAULT_ENV][_language];
		_defaultTranslations = i18n[DEFAULT_ENV][DEFAULT_LANGUAGE];
	};

	var _getAvailableLocales = function(){
		if((typeof i18n != "object")||(typeof i18n[DEFAULT_ENV] != "object")){
			return [];
		}
		return Object.keys(i18n[DEFAULT_ENV]);
	};

	var getAvailableLocales = function(){
		if(_availableLocales instanceof Array) {
			return _availableLocales;
		}
		return _getAvailableLocales();
	};

	var _isValidLocale = function(locale){
		return ((typeof locale == "string")&&(getAvailableLocales().indexOf(locale)!=-1));
	};

	var translateUI = function(){
		$("[i18n-key]").each(function(index, elem){
			var translation = getTrans($(elem).attr("i18n-key"));
			if(translation!=null){
				switch(elem.tagName){
					case "INPUT":
						_translateInput(elem,translation);
						break;
					case "TEXTAREA":
						_translateTextArea(elem,translation);
						break;
					case "DIV":
						_translateDiv(elem,translation);
						break;
					case "LI":
						_translateLI(elem,translation);
						break;
					case "IMG":
						_translateImg(elem,translation);
						break;
					default:
						//Generic translation (for h,p or span elements)
						_genericTranslate(elem,translation);
						break;
				}
			}
		});

		//Translante hrefs attributes
		$("[i18n-key-href]").each(function(index, elem){
			var translation = getTrans($(elem).attr("i18n-key-href"));
			if(translation!=null){
				$(elem).attr("href",translation);
			}
		});

		// Translate images (if any)
		// ...
	};
		
	var _translateInput = function(input,translation){
		if($(input).val()!==""){
			$(input).val(translation);
		}
		if($(input).attr("placeholder")){
			$(input).attr("placeholder", translation);
		}
	};

	var _translateDiv = function(div,translation){
		if($(div).attr("data-text") != undefined){
			$(div).attr("data-text", translation);
		}
		if($(div).attr("title") != undefined){
			$(div).attr("title", translation);
		}
	};

	var _translateTextArea = function(textArea,translation){
		$(textArea).attr("placeholder", translation);
	};

	var _translateLI = function(li,translation){
		if($(li).attr("data-text") != undefined){
			$(li).attr("data-text", translation);
		} else {
			_genericTranslate(li,translation);
		}
	};

	var _translateImg = function(img,translation){
		$(img).attr("src",V.ImagesPath + translation);
	};

	var _genericTranslate = function(elem,translation){
		$(elem).text(translation);
	};

	/**
	 * Function to translate a string
	 */
	var getTrans = function(s, params) {
		//First language
		if((typeof _translations != "undefined")&&(typeof _translations[s] == "string")) {
			return _getTrans(_translations[s],params);
		}
		// V.Debugging.log("Text without translation: " + s + " for language " + _language);

		//Default language
		if((_language != DEFAULT_LANGUAGE)&&(typeof _defaultTranslations != "undefined")&&(typeof _defaultTranslations[s] == "string")) {
			return _getTrans(_defaultTranslations[s],params);
		}
		// V.Debugging.log("Text without default translation: " + s);

		//Don't return s if it is a key.
		var key_pattern =/^i\./g;
		if(key_pattern.exec(s)!=null){
			return null;
		} else {
			return s;
		}
	};

	/*
	 * Replace params (if they are provided) in the translations keys. Example:
	 * // "i.dtest"	: "Uploaded by #{name} via ViSH Editor",
	 * // VISH.I18n.getTrans("i.dtest", {name: "Aldo"}) -> "Uploaded by Aldo via ViSH Editor"
	 */
	var _getTrans = function(trans, params){
		if(typeof params != "object"){
			return trans;
		}

		for(var key in params){
			var stringToReplace = "#{" + key + "}";
			if(trans.indexOf(stringToReplace)!=-1){
				trans = trans.replaceAll(stringToReplace,params[key]);
			}
		};

		return trans;
	};

	/**
	 * Return the current language
	 */
	var getLanguage = function(){
		return _language;
	};


	return {
		init 				: init,
		getAvailableLocales : getAvailableLocales,
		getLanguage			: getLanguage,
		getTrans 			: getTrans,
		translateUI 		: translateUI
	};

}) (VISH, jQuery);
