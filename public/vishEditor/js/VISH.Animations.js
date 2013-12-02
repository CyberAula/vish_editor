VISH.Animations = (function(V,$,undefined){

	var loadAnimation = function(animation,callback){
		if(V.Status.getDevice().mobile){
			// Don't load any animation for mobile devices
			// if(typeof callback == "function"){
			// 	callback();
			// }
			// return;

			//Force default animation for mobile devices
			animation = V.Constant.Animations.Default;
		}

		if(!animation){
			animation = V.Constant.Animations.Default;
		}
		_unloadAllAnimations();
		V.Utils.Loader.loadCSS("animations/" + animation + ".css",callback);
	};

	var _unloadAllAnimations = function(){
		var animation_pattern = "(^" + V.StylesheetsPath + "animations/)";
		$("head").find("link[type='text/css']").each(function(index, link) {
			var href = $(link).attr("href");
			if(href){
				if (href.match(animation_pattern)!==null){
					$(link).remove();
				}
			}
		});
	};

	return {
		loadAnimation	: loadAnimation
	};

}) (VISH, jQuery);