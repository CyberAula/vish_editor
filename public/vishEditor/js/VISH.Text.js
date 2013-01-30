VISH.Text = (function(V,$,undefined){

	//Convert <p><span> from px to ems
	var init = function(){
		$("article > div > p").each(function(index,p){
			if($(p).children().length === 0){
				_setStyleInEm(p);
				return;
			}

			var oldStyle = null;
			var newStyle = null;
			var lastFontSizeCandidate = null;
			var lastFontSize = null;

			$(p).find("span").each(function(index,span){
				oldStyle = $(span).attr("style");
				lastFontSizeCandidate = parseInt(VISH.Utils.getFontSizeFromStyle(oldStyle));
				if((typeof lastFontSizeCandidate === "number")&&(!isNaN(lastFontSizeCandidate))){
					lastFontSize = lastFontSizeCandidate;
				}

				if($(span).children().length !== 0){
					newStyle = VISH.Utils.removeFontSizeInStyle(oldStyle);
					if((newStyle === null)||(newStyle === "; ")){
						$(span).removeAttr("style");
					} else {
						$(span).attr("style",newStyle);
					}
				} else {
				 	//Last SPAN
					var fontSize;
					if((typeof lastFontSizeCandidate === "number")&&(!isNaN(lastFontSizeCandidate))){
						fontSize = lastFontSizeCandidate;
					} else if(lastFontSize !== null){
						fontSize = lastFontSize;
					} else {
						fontSize = VISH.Constant.TextDefault; //Default font
					}
					var em = (fontSize/VISH.Constant.TextBase) + "em";
					newStyle = VISH.Utils.addFontSizeToStyle(oldStyle,em);
					$(span).attr("style",newStyle);
				}
			});
		});
	}

	var _setStyleInEm = function(el){
		var oldStyle = $(el).attr("style");
		var fontSize;

		if(typeof oldStyle !== "string"){
			oldStyle = "";
		} else {
			fontSize = VISH.Utils.getFontSizeFromStyle(oldStyle);
		}

		if((typeof fontSize !== "number")||(isNaN(fontSize))){
			fontSize = VISH.Constant.TextDefault; //Default font-size
		}

		//Convert to em (http://pxtoem.com/)
		var em = (fontSize/VISH.Constant.TextBase) + "em";
		var newStyle = VISH.Utils.addFontSizeToStyle(oldStyle,em);
		$(el).attr("style",newStyle);
	}

	var aftersetupSize = function(increase){
		//Update Text-base size
		var reference_font_size = VISH.Constant.TextBase;
		var texts = $("article");
		$(texts).css("font-size", reference_font_size*increase + "px");
	}

    return {
        init			: init,
		aftersetupSize 	: aftersetupSize
    };
    
})(VISH, jQuery);