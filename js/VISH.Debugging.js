/*
 * Debug, test and utility functions for Vish Editor
 */
VISH.Debugging = (function(V,$,undefined){
	
	var verbose = false;
	var developping = false;
	
	var init = function(debugging){
		if (navigator.appName !== 'Microsoft Internet Explorer') {
			verbose = debugging;
		}		
	};
	
	var log = function(text){
		if (verbose) {
		  console.log(text);
	  }
	};
	
	var shuffleJson = function(json){
		return _shuffle(json);
	};
	
	var getVerbose = function(){
		return verbose;
	};
	
	var setVerbose = function(param){
		verbose = param;
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
	
	return {
		init                    : init,
		getVerbose              : getVerbose,
		setVerbose              : setVerbose,
		log                     : log,
		shuffleJson             : shuffleJson,
		enableDevelopingMode    : enableDevelopingMode,
		disableDevelopingMode   : disableDevelopingMode,
		isDevelopping           : isDevelopping
	};

}) (VISH, jQuery);
