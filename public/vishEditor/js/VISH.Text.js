VISH.Text = (function(V,$,undefined){

	//Convert <p><span> from px to ems
	var init = function(){ 
		$("article > div > p").each(function(index,p){

			console.log("New p")
			console.log(p)

			if($(p).children().length === 0){
				console.log("No children");
				_setStyleInEm(p);
				return;
			}

			console.log("Find span")

			$(p).find("span").each(function(index,span){
				if($(span).children().length !== 0){
					$(span).removeAttr("style");
					return;
				}
				_setStyleInEm(span);
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

		if(typeof fontSize !== "number"){
			fontSize = 12; //Default font-size
		}




		//Convert to em
		var em = (fontSize/16) + "em";
		var newStyle = VISH.Utils.addFontSizeToStyle(oldStyle,em);
		$(el).attr("style",newStyle);
	}

	var aftersetupSize = function(increase){
		//Update Default Texts
		console.log("Setup Text after an increase of " + increase);

		var reference_font_size = 16;
		var texts = $("article");
		$(texts).css("font-size", reference_font_size*increase + "px");
		// $(texts).css("line-height", font_size*increase + "px");
		// $(".subslide").css("font-size", font_size*increase + "px");
		// $(".subslide").css("line-height", font_size*increase + "px");
	}

    return {
        init			: init,
		aftersetupSize 	: aftersetupSize
    };
    
})(VISH, jQuery);