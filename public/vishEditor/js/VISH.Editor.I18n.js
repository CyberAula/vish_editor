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
		//cover all elements and translate their content		
		_filterAndSubText('div');
		_filterAndSubText('a');
		_filterAndSubText('span');
		_filterAndSubText('p');		
  		_filterAndSubText('button');
  		_filterAndSubText('h2');
		_filterAndSubText('h1');
  		
  		//substitute data-text attribute of the walkthrough
  		$("[data-text]").each(function(index, elem){
				$(elem).attr("data-text", _getTrans($(elem).attr("data-text")));
		});	
  	
  		//now the elements with attribute i18n-key (long phrases)
  		_elementsWithKey();
  		
  		
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
  		
  		if (typeof(i18n[language])!='undefined'){
  			//replace start_tutorial image
  			var factor;
  			if(language === "es"){
  				factor = 2;
  			}
  			var normal_pos = 360; //120 + 120*factor;
  			var hover_pos = 480; //240 + 120*factor;
  			$("#start_tutorial").css("background-position", "0px -" + normal_pos + "px");
  			//replace hover in that image
  			$("#start_tutorial").hover(function(){
			    $("#start_tutorial").css("background-position", "0px -" + hover_pos + "px");
			}, function() {
			    $("#start_tutorial").css("background-position", "0px -" + normal_pos + "px");
			});
			//replace contentusetut image
			$("#contentusetut").attr("src", VISH.ImagesPath + "contentuse_"+language+".png");
  		}
				
		var duration = new Date().getTime() - initTime;
		VISH.Debugging.log("Internationalization took " + duration + " ms.");
	};
	
	
	/**
	 * function to get all elements of one type and filter them to substutute their inner text
	 */
	var _filterAndSubText = function(elemType){
		$(elemType).filter(function(index){
			return $(this).children().length < 1 && ($(this).attr("i18n-key") === undefined) && $(this).text().trim() !== "";
			})
			.each(function(index, elem){
				$(elem).text(_getTrans($(elem).text()));
		});
	};
	
	/**
	 * function to cover all elements with i18n-key to translate them
	 */
	var _elementsWithKey = function(){
		$("[i18n-key]").each(function(index, elem){
				$(elem).text(_getTrans($(elem).attr("i18n-key")));
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
