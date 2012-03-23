/*
 * Debug, test and utility functions for Vish Editor
 */
VISH.Debugging = (function(V,$,undefined){
	
	var verbose = false;
	
	var init = function(debugging){
		this.verbose = debugging
	}
	
	var log = function(text){
		if (verbose) {
		  console.log(text);
	  }
	}
	
	var shuffleJson = function(json){
		return _shuffle(json);
	}
	
	var getVerbose = function(){
		return verbose;
	}
	
	var setVerbose = function(param){
		verbose = param;
	}
	
	var _shuffle = function(o){
	  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	  return o;
  };
	
	return {
		init                    : init,
		getVerbose              : getVerbose,
		setVerbose              : setVerbose,
		log                     : log,
		shuffleJson             : shuffleJson
	};

}) (VISH, jQuery);
