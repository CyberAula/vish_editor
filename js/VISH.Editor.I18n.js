VISH.Editor.I18n = (function(V,$,undefined){
	
	
	var init = function(){
		var initTime = new Date().getTime();
		
		
		
		
		var duration = new Date().getTime() - initTime;
		console.log("Internationalization took " + duration + " ms.");
	};
	
	/**
	 * function to 
	 */
	function _(s) {
	  if (typeof(i18n)!='undefined' && i18n[s]) {
	    return i18n[s];
	  }
	  return s;
	}
	
	return {
		init              : init
	};

}) (VISH, jQuery);
