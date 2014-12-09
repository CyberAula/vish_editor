VISH.I18n = (function(V,$,undefined){
	
	var translations;
	var defaultTranslations;
	var language;

	/**
	 * Function to do the language translation
	 */
	var init = function(lang){
		// var initTime = new Date().getTime();

		defaultTranslations = i18n["vish"]["default"];
		
		//Set lang specific translation
		if(typeof lang != "undefined"){
			language = lang;
		} else {
			return;
		}
		
		if(typeof(i18n["vish"][language])!='undefined'){
			translations = i18n["vish"][language];
		} else {
			return;
		}

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

		// var duration = new Date().getTime() - initTime;
		// V.Debugging.log("Internationalization took " + duration + " ms.");
	};
		
	var _translateInput = function(input,translation){
		if($(input).val()!==""){
			$(input).val(translation);
		}
		if($(input).attr("placeholder")){
			$(input).attr("placeholder", translation);
		}
	}

	var _translateDiv = function(div,translation){
		if($(div).attr("data-text") != undefined){
			$(div).attr("data-text", translation);
		}
		if($(div).attr("title") != undefined){
			$(div).attr("title", translation);
		}
	}

	var _translateTextArea = function(textArea,translation){
		$(textArea).attr("placeholder", translation);
	}

	var _translateLI = function(li,translation){
		if($(li).attr("data-text") != undefined){
			$(li).attr("data-text", translation);
		} else {
			_genericTranslate(li,translation);
		}
	}

	var _translateImg = function(img,translation){
		$(img).attr("src",V.ImagesPath + translation);
	}

	var _genericTranslate = function(elem,translation){
		$(elem).text(translation);
	}

	/**
	 * Function to translate a text
	 */
	var getTrans = function(s, params) {
		if (typeof(translations)!= 'undefined' && translations[s]) {
			return _getTrans(translations[s],params);
		}
		// V.Debugging.log("Text without translation: " + s);

		//Search in default language
		if (typeof(defaultTranslations)!= 'undefined' && defaultTranslations[s]) {
			return _getTrans(defaultTranslations[s],params);
		}
		// V.Debugging.log("Text without default translation: " + s);

		//Don't return s if s is a key.
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
	}

	/**
	 * Return the current language
	 */
	var getLanguage = function(){
		return language;
	}

	return {
		init 			: init,
		getTrans 		: getTrans,
		getLanguage		: getLanguage
	};

}) (VISH, jQuery);
