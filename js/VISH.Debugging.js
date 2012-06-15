/*
 * Debug, test and utility functions for Vish Editor
 */
VISH.Debugging = (function(V,$,undefined){
	
	
	//CONFIGURATION VARIABLES
	
	//Possible actions: "view" or "edit".
	var actionSave = "edit"; 
	
	//Possible action: "nothing" or "loadSamples".
	var actionInit = "nothing";
	var excursionSamples = VISH.Samples.samples;
	
	
	var developping = false;
	
	var init = function(bol){
			developping = bol;
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
	}
	
	var disableDevelopingMode = function(){
    developping = false;
  } 
	
	var isDevelopping = function(){
		return developping;
	}
	
	var getActionSave = function(){
		return actionSave;
	}
	
	var getActionInit = function(){
    return actionInit;
  }
	
	var getExcursionSamples = function(){
		return excursionSamples;
	}
	
	return {
		init                    : init,
		log                     : log,
		shuffleJson             : shuffleJson,
		enableDevelopingMode    : enableDevelopingMode,
		disableDevelopingMode   : disableDevelopingMode,
		isDevelopping           : isDevelopping,
		getActionSave           : getActionSave,
		getActionInit           : getActionInit,
		getExcursionSamples     : getExcursionSamples
	};

}) (VISH, jQuery);
