VISH.Utils = (function(V,undefined){
	
	  var init = function(){
			//Code here...
		}
	
	  var getOuterHTML = function(tag){
      //In some old browsers (before firefox 11 for example) outerHTML does not work
      //Trick to provide full browser support
      if (typeof($(tag)[0].outerHTML)=='undefined'){
        return $(tag).clone().wrap('<div></div>').parent().html();
      } else {
				return $(tag)[0].outerHTML;
			}
	  }

    return {
			init : init,
	    getOuterHTML : getOuterHTML            
    };

}) (VISH);