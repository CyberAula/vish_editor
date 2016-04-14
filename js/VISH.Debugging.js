/*
 * Debug, test and utility functions for ViSH Editor
 */
VISH.Debugging = (function(V,$,undefined){
	
	var developping = false;
	var settings;
	var presentationOptions;

	var init = function(options){
		if((options)&&(typeof options["developping"] == "boolean")){
			developping = options["developping"];
			if(developping){
				presentationOptions = options;
				if(options["developmentSettings"]){
					settings = options["developmentSettings"];
				}
			}
		} else {
			developping = false;
			settings = null;
		}
	};
	
	var log = function(text){
		if ((window.console && window.console.log) && (developping)) {
			console.log(text);
		}
	};
	
	var shuffleJson = function(json){
		return _shuffle(json);
	};
	
	var _shuffle = function(o){
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};
	
	var enableDevelopingMode = function(){
		developping = true;
	};
	
	var disableDevelopingMode = function(){
		developping = false;
	};
	
	var isDevelopping = function(){
		return developping;
	};
	
	var getActionInit = function(){
		if(settings){
			return settings.actionInit;
		} else {
			//Default action
			return "nothing";
		}
	};
	
	var getPresentationSamples = function(){
		if((settings)&&(settings.samples)){
			return settings.samples;
		} else {
			log("VISH.Debugging Error: Please specify development settings");
			return null;
		}
	};

	var getRandomToken = function(length){
		var _token = "";
		if(typeof length != "number"){
			length = 6;
		}
		length = Math.max(length,1);
		for(var i=0; i<length; i++){
			_token += parseInt(Math.random()*10)
		}
		return parseInt(_token);
	};
	
	return {
		init 						: init,
		log 						: log,
		shuffleJson 				: shuffleJson,
		enableDevelopingMode 		: enableDevelopingMode,
		disableDevelopingMode		: disableDevelopingMode,
		isDevelopping				: isDevelopping,
		getActionInit				: getActionInit,
		getPresentationSamples		: getPresentationSamples,
		getRandomToken				: getRandomToken
	};

}) (VISH, jQuery);
