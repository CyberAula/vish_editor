VISH.I18n = (function(V,$,undefined){
	
	var DEFAULT_LANGUAGE = "en";

	//Locales (translation files) available on VE
	var _availableLocales;
	//Environment locales
	var _envLocales;
	//Languages available on VE
	var _availableLanguages;
	//User preferred language
	var _language;

	//Preferred locales (environment locales if defined)
	var _locales;
	//Default locales
	var _defaultLocales;
	

	/**
	 * Init I18n module
	 */
	var init = function(options, presentation){
		var configuration = V.Configuration.getConfiguration();

		_availableLocales = _getAvailableLocales();
		_availableLanguages = _getAvailableLanguages();

		//Set default language from config
		if(_isValidLanguage(configuration["defaultLanguage"])){
			DEFAULT_LANGUAGE = configuration["defaultLanguage"];
		}
		
		//Get language
		//1. Language specified by options
		if(_isValidLanguage(options.lang)){
			_language = options.lang;
		} else {
			//2. Browser language
			var browserLang = (navigator.language || navigator.userLanguage);
			if(_isValidLanguage(browserLang)){
				_language = browserLang;
			} else {
				//3. LO language
				if((typeof presentation == "object")&&(_isValidLanguage(presentation.language))){
					_language = presentation.language;
				} else {
					//4. Default language
					_language = DEFAULT_LANGUAGE;
				}
			}
		}

		_defaultLocales = V.Locales;
		if(typeof _envLocales == "object"){
			_locales = _envLocales;
		} else {
			_locales = _defaultLocales;
		}
	};

	var _getAvailableLanguages = function(){
		var _availableLanguages = [];
		var _availableLocales = _getAvailableLocales();
		for(var i=0; i<_availableLocales.length; i++){
			var languages = Object.keys(_availableLocales[i]);
			for(var j=0; j<languages.length; j++){
				if(_availableLanguages.indexOf(languages[j])==-1){
					_availableLanguages.push(languages[j]);
				}
			}
		}
		return _availableLanguages;
	};

	var getAvailableLanguages = function(){
		if(_availableLanguages instanceof Array) {
			return _availableLanguages;
		}
		return _getAvailableLanguages();
	};

	var _getAvailableLocales = function(){
		var availableLocales = [];
		var configuration = V.Configuration.getConfiguration();
		if(typeof V.Locales == "object"){
			availableLocales.push(V.Locales);
		}
		if(typeof configuration["locales"] == "object"){
			availableLocales.push(configuration["locales"]);
			_envLocales = configuration["locales"];
		}
		return availableLocales;
	};

	var getAvailableLocales = function(){
		if(_availableLocales instanceof Array) {
			return _availableLocales;
		}
		return _getAvailableLocales();
	};

	var _isValidLanguage = function(language){
		return ((typeof language == "string")&&(getAvailableLanguages().indexOf(language)!=-1));
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
	var getTrans = function(s,params){
		//Preferred locale
		var trans = _getTransFromLocales(_locales,s,params);
		if(typeof trans == "string"){
			return trans;
		}

		//Default locale
		trans = _getTransFromLocales(_defaultLocales,s,params);
		if(typeof trans == "string"){
			return trans;
		}

		//Don't return s if it is a key.
		var key_pattern =/^i\./g;
		if(key_pattern.exec(s)!=null){
			return undefined;
		} else {
			return s;
		}
	};

	/**
	 * Function to translate a string
	 */
	var _getTransFromLocales = function(locales,s,params){
		//First language
		if((typeof locales[_language] != "undefined")&&(typeof locales[_language][s] == "string")) {
			return _getTransWithParams(locales[_language][s],params);
		}
		// V.Debugging.log("Text without translation: " + s + " for language " + _language);

		//Default language
		if((_language != DEFAULT_LANGUAGE)&&(typeof locales[DEFAULT_LANGUAGE] != "undefined")&&(typeof locales[DEFAULT_LANGUAGE][s] == "string")){
			return _getTransWithParams(locales[DEFAULT_LANGUAGE][s],params);
		}
		// V.Debugging.log("Text without default translation: " + s);

		return undefined;
	};

	/*
	 * Replace params (if they are provided) in the translations keys. Example:
	 * // "i.dtest"	: "Uploaded by #{name} via ViSH Editor",
	 * // VISH.I18n.getTrans("i.dtest", {name: "Aldo"}) -> "Uploaded by Aldo via ViSH Editor"
	 */
	var _getTransWithParams = function(trans, params){
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
		init 					: init,
		getAvailableLanguages 	: getAvailableLanguages,
		getLanguage				: getLanguage,
		getTrans 				: getTrans,
		translateUI 			: translateUI
	};

}) (VISH, jQuery);
