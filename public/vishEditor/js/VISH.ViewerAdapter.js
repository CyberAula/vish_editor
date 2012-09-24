VISH.ViewerAdapter = (function(V,$,undefined){
	var page_is_fullscreen = false; //it always init without fullscreen

	/**
	 * function to adapt the slides to the screen size, in case the editor is shown in another iframe
	 * param "fullscreen" indicates that the call comes from a fullscreen button
	 */
	var setupSize = function(fullscreen){
		var reserved_px_for_menubar; //we don´t show the menubar
		var margin_height;
		var margin_width;

		if (V.Status.getDevice().mobile) {
			reserved_px_for_menubar = 0; //we don´t show the menubar
			margin_height = 0;
			margin_width = 0;
		} else {
			if(fullscreen && !page_is_fullscreen){
					//exit fullscreen
					page_is_fullscreen = true;
					reserved_px_for_menubar = 0; //we don´t show the menubar
					margin_height = 0;
					margin_width = 0;
			} else {
				page_is_fullscreen = false;
				if(V.SlideManager.getPresentationType() === "presentation"){
					reserved_px_for_menubar = 40;
				}
				else{
					reserved_px_for_menubar = 0;
				}				
				margin_height = 40;
				margin_width = 30;
			}
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
		$("#flashcard-background").css("height", finalH);
		$("#flashcard-background").css("width", finalW);
		$("#flashcard-background").css("background-size", "" + finalW + "px " + finalH + "px");

		//margin-top and margin-left half of the height and width
		var marginTop = finalH/2 + reserved_px_for_menubar/2;
		var marginLeft = finalW/2;
		$(".slides > article").css("margin-top", "-" + marginTop + "px");
		$(".slides > article").css("margin-left", "-" + marginLeft + "px");
		$("#flashcard-background").css("margin-top", "-" + marginTop + "px");
		$("#flashcard-background").css("margin-left", "-" + marginLeft + "px");
		
		//viewbar, the bar with the arrows to pass slides, set left position to px, because if it is 50%, it moves when zoom in mobile
		//$(".viewbar").css("left", width/2 + "px");
		//VISH.Debugging.log("viewbar a " + width/2 + "px");
		
		
		//finally font-size, line-height and letter-spacing of articles
		//after this change the font sizes of the zones will be relative as they are in ems
		var increase = finalH/600;
		var font_size = V.Status.getDevice().mobile ? 15:16 ;
		
		$(".slides > article").css("font-size", font_size*increase + "px");
		$(".slides > article").css("line-height", font_size*increase + "px");
		
		//and now the arrows have to be increased or decreased
		$(".fc_poi img").css("width", 50*increase + "px");
		$(".fc_poi img").css("height", 50*increase + "px");
		
		//Snapshot callbacks
		VISH.SnapshotPlayer.aftersetupSize(increase);
		
		//Object callbacks
		VISH.ObjectPlayer.aftersetupSize(increase);		
	};


	var setupElements = function(){
		//if page is fullscreen, it means we are exiting it
		if(page_is_fullscreen){
			//change icon
		    $("#page-fullscreen").css("background-position", "0px 0px");
		    $("#page-fullscreen").hover(function(){
			    $("#page-fullscreen").css("background-position", "0px -40px");
			  }, function() {
			    $("#page-fullscreen").css("background-position", "0px 0px");
			  });
		    if(V.SlideManager.getPresentationType() === "presentation"){
		    	$("#viewbar").show();
		    	$(".vish_arrow").hide();
		    }		    
		} else {
			//change icon
		    $("#page-fullscreen").css("background-position", "-45px 0px");
		    $("#page-fullscreen").hover(function(){
			    $("#page-fullscreen").css("background-position", "-45px -40px");
			}, function() {
			    $("#page-fullscreen").css("background-position", "-45px 0px");
			});
			if(V.SlideManager.getPresentationType() === "presentation"){
				$("#viewbar").hide();
				$(".vish_arrow").show();
			}
		}
	};
	
	/**
	* Method to add the src to the iframe, show it, hide the slides, and so on
	*/
	var setupGame = function(presentation){
		$("#my_game_iframe").attr("src", presentation.game.src);
		//load file game.css dinamically
		var fileref=document.createElement("link");
  		fileref.setAttribute("rel", "stylesheet");
  		fileref.setAttribute("type", "text/css");
  		fileref.setAttribute("href", "stylesheets/game/game.css");
  		document.getElementsByTagName("body")[0].appendChild(fileref);
	};


	
	/**
	 * function to hide/show the page-switchers buttons in the viewer
	 * hide the left one if on first slide
	 * hide the right one if on last slide
	 * show both otherwise
	 */
	var decideIfPageSwitcher = function(){
		//page switchers only for presentations
		if(V.SlideManager.getPresentationType() === "presentation"){
			if(!page_is_fullscreen && !V.Status.getDevice().mobile){
				if(VISH.Slides.isCurrentFirstSlide()){
					$("#page-switcher-start").hide();				
				} else {
					$("#page-switcher-start").show();
				}
				
				if(VISH.Slides.isCurrentLastSlide()){
					$("#page-switcher-end").hide();	
				} else {
					$("#page-switcher-end").show();
				}
			} else {
				if(VISH.Slides.isCurrentFirstSlide()){
					$("#mobile_back_arrow").hide();
				} else {
					$("#mobile_back_arrow").show();
				}
				
				if(VISH.Slides.isCurrentLastSlide()){
					$("#mobile_forward_arrow").hide();		
				} else {
					$("#mobile_forward_arrow").show();
				}
			}
		}
	};
	
	return {
		decideIfPageSwitcher	: decideIfPageSwitcher,
		setupElements			: setupElements,
		setupGame				: setupGame,
		setupSize				: setupSize
	};
}) (VISH, jQuery);
