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

				if($(span).find("span").length !== 0) {
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

    /*
     * Update Text-base size
     */
	var aftersetupSize = function(increase){
		increase = increase*_correctionFactor(increase);
		var reference_font_size = VISH.Constant.TextBase;
		var texts = $("article");
		$(texts).css("font-size", reference_font_size*increase + "px");
	}

	/*
	 * A correction factor to better adapt text to screens size.
	 * Increase factor is not accuracy enough, specially for small screens.
	 * For increaseFactor=1 and around, the correction factor is 0.
	 * Correction factor is calculated empirically.
	 * @param {number} factor Increase factor.
	 * @return {number} correctionFactor Correction factor to fix increase factor.
	 */
	var _correctionFactor = function(factor){
		if(factor < 0.25) {
			return 0.5;
		} else if(_isInRange(factor,0.25,0.3)){
			return 0.55;
		} else if(_isInRange(factor,0.3,0.35)){
			return 0.65;
		} else if(_isInRange(factor,0.35,0.4)){
			return 0.7;
		} else if(_isInRange(factor,0.4,0.5)){
			return 0.8;
		} else if(_isInRange(factor,0.5,0.6)){
			return 0.85;
		} else if(_isInRange(factor,0.6,0.75)){
			return 0.9;
		} else if(_isInRange(factor,0.75,0.95)){
			return 0.95;
		} else if(_isInRange(factor,0.95,1.5)){
			return 1;
		} else if (factor > 1.5){
			return 1; //Test in fullscreen mode with large-screens
		}

		return 1; //Default
	}

	var _isInRange = function(number, min, max){
		return number > min && number < max;
	}

    return {
        init			: init,
		aftersetupSize 	: aftersetupSize
    };
    
})(VISH, jQuery);