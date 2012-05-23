VISH.Editor.I18n = (function(V,$,undefined){
	var language;
	
	/**
	 * function to do the languaje translation
	 * if this function is called there should be defined an i18n array with the translations 
	 */
	var init = function(lang){
		var initTime = new Date().getTime();
		
		language = lang;  
		//check that we have the language and if not return
		if (typeof(i18n[language])==='undefined'){
			return;
		}
		//cover all divs and translate their content		
		_filterAndSubText('div');
		_filterAndSubText('a');
		_filterAndSubText('p');
		_filterAndSubText('span');
  		_filterAndSubText('button');
  		
  		//now the div titles (used as tooltips for help)
  		$('div[title]').each(function(index, elem){
  			$(elem).attr("title", _getTrans($(elem).attr("title")));
  		});
  		
  		//finally input and textareas have value and placeholder
  		$('input').each(function(index, elem){
				if($(elem).val()!==""){
					$(elem).val(_getTrans($(elem).val()));
				}
				if($(elem).attr("placeholder")){
					$(elem).attr("placeholder", _getTrans($(elem).attr("placeholder")));
				}
		});
		$('textarea[placeholder]').each(function(index, elem){
				$(elem).attr("placeholder", _getTrans($(elem).attr("placeholder")));
		});
  		
				
		var duration = new Date().getTime() - initTime;
		VISH.Debugging.log("Internationalization took " + duration + " ms.");
	};
	
	
	/**
	 * function to get all elements of one type and filter them to substutute their inner text
	 */
	var _filterAndSubText = function(elemType){
		$(elemType).filter(function(index){
			return $(this).children().length < 1 && $(this).text().trim() !== "";
			})
			.each(function(index, elem){
				$(elem).text(_getTrans($(elem).text()));
		});
	};
	
		
	/**
	 * function to translate a text
	 */
	var _getTrans = function (s) {
	  if (typeof(i18n[language])!='undefined' && i18n[language][s]) {
	    return i18n[language][s];
	  }
	  VISH.Debugging.log("Text without translation: " + s);
	  return s;
	};
	
	return {
		init              : init
	};

}) (VISH, jQuery);
