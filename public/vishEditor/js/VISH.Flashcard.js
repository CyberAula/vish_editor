VISH.Flashcard = (function(V,$,undefined){
	

	var init = function(excursion){
		var fileref=document.createElement("link");
  		fileref.setAttribute("rel", "stylesheet");
  		fileref.setAttribute("type", "text/css");
  		fileref.setAttribute("href", "stylesheets/all/flashcard.css");
  		document.getElementsByTagName("body")[0].appendChild(fileref);

  		var flashcard_div = $("#flashcard-background");
  		//first we set the flashcard background image
  		flashcard_div.css("background-image", "url('" + excursion.background.src + "')");

  		//and now we add the points of interest with their click events to show the slides
  		for(index in excursion.background.pois){
  			var poi = excursion.background.pois[index];
  			var div_to_add = "<div id='" + poi.id + "' style='position:relative;left:"+poi.x+"px;top:"+poi.y+"px'><img src='"+VISH.ImagesPath +"arrow_down.gif'/></div>";

  			flashcard_div.append(div_to_add);
  			$(document).on('click', "#" + poi.id,  { slide_id: poi.slide_id}, _onPoiClicked);
  		}
  		
  		
	};


	/**
	 * function called when a poi is clicked
	 */
	 var _onPoiClicked = function(event){
	 	
	 };

	return {
		init		: init
		
	};
}) (VISH, jQuery);