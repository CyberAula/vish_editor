VISH.Flashcard = (function(V,$,undefined){

	var init = function(presentation){
		var fileref=document.createElement("link");
  		fileref.setAttribute("rel", "stylesheet");
  		fileref.setAttribute("type", "text/css");
  		fileref.setAttribute("href", VISH.StylesheetsPath + "flashcard/flashcard.css");
  		document.getElementsByTagName("body")[0].appendChild(fileref);

  		var flashcard_div = $("#flashcard-background");
  		//first we set the flashcard background image
  		flashcard_div.css("background-image", presentation.background.src);

  		//and now we add the points of interest with their click events to show the slides
  		for(index in presentation.background.pois){
  			var poi = presentation.background.pois[index];
  			  			
        V.Flashcard.Arrow.addArrow(poi, false);
  		}
      V.Flashcard.Arrow.init();
	};

	return {
		init		: init
		
	};
}) (VISH, jQuery);