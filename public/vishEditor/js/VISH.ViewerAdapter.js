VISH.ViewerAdapter = (function(V,$,undefined){
	
	/**
	 * function to adapt the slides to the screen size, in case the editor is shown in another iframe
	 */
	var setupSize = function(){
		if (V.Status.ua.mobile) {
			var reserved_px_for_menubar = 0; //we don´t show the menubar
			var margin_height = 0;
			var margin_width = 0;
		}
		else{
			var reserved_px_for_menubar = 40;
			var margin_height = 40;
			var margin_width = 30;
		}
		
		var height = $(window).height() - reserved_px_for_menubar; //the height to use is the window height - 40px that is the menubar height
		var width = $(window).width();
		var finalW = 800;
		var finalH = 600;
		//VISH.Debugging.log("height " + height);
		//VISH.Debugging.log("width " + width);
		var aspectRatio = width/height;
		var slidesRatio = 4/3;
		if(aspectRatio > slidesRatio){
			finalH = height - margin_height;  //leave 40px free, 20 in the top and 20 in the bottom ideally
			finalW = finalH*slidesRatio;	
		}	else {
			finalW = width - margin_width; //leave 110px free, at least, 55 left and 55 right ideally
			finalH = finalW/slidesRatio;	
		}
		//VISH.Debugging.log("finalH " + finalH);
		//VISH.Debugging.log("finalW " + finalW);
		$(".slides > article").css("height", finalH);
		$(".slides > article").css("width", finalW);
		
		//margin-top and margin-left half of the height and width
		var marginTop = finalH/2 + reserved_px_for_menubar/2;
		var marginLeft = finalW/2;
		$(".slides > article").css("margin-top", "-" + marginTop + "px");
		$(".slides > article").css("margin-left", "-" + marginLeft + "px");
		
		//viewbar, the bar with the arrows to pass slides, set left position to px, because if it is 50%, it moves when zoom in mobile
		//$(".viewbar").css("left", width/2 + "px");
		//VISH.Debugging.log("viewbar a " + width/2 + "px");
		
		
		//finally font-size, line-height and letter-spacing of articles
		//after this change the font sizes of the zones will be relative as they are in ems
		var increase = finalH/600;
		var font_size = V.Status.ua.mobile ? 15:16 ;
		
		$(".slides > article").css("font-size", font_size*increase + "px");
		$(".slides > article").css("line-height", font_size*increase + "px");
		
		
		//Snapshot callbacks
		VISH.SnapshotPlayer.aftersetupSize(increase);
		
		//Object callbacks
		VISH.ObjectPlayer.aftersetupSize(increase);		
	};
	
	/**
	* Method to add the src to the iframe, show it, hide the slides, and so on
	*/
	var setupGame = function(excursion){
		$("#my_game_iframe").attr("src", excursion.game.src);
		//load file game.css dinamically
		var fileref=document.createElement("link");
  		fileref.setAttribute("rel", "stylesheet");
  		fileref.setAttribute("type", "text/css");
  		fileref.setAttribute("href", "stylesheets/all/game.css");
  		document.getElementsByTagName("body")[0].appendChild(fileref);
	};


	
	return {
		setupGame		: setupGame,
		setupSize		: setupSize
	};
}) (VISH, jQuery);
