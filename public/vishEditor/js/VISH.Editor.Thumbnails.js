VISH.Editor.Thumbnails = (function(V,$,undefined){
	
	var carrouselDivId = "slides_carrousel";
	
	
	var init = function(){ }
	 
	 
	 var redrawThumbnails = function(){
		
		//Clean previous content
    VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);
    $("#" + carrouselDivId).hide();

    //Generate carrousel images
    var carrouselImages = [];
		var carrouselImagesTitles = [];
		
		var carrouselElements = 0;
		$('article').each(function(index,s){
          var template = $(s).attr('template');
					carrouselElements += 1;
					carrouselImages.push($("<img class='image_barbutton fill_slide_button' slideNumber='" + carrouselElements + "' action='goToSlide' src='" + VISH.ImagesPath + "templatesthumbs/"+ template + ".png' />"));
					carrouselImagesTitles.push(carrouselElements)
    });
		
		//Add plus button
		carrouselImages.push($("<img class='image_barbutton add_slide_button' action='plus' id='addslidebutton' src='" + VISH.ImagesPath + "templatesthumbs/add_slide.png' />"));
		carrouselElements += 1;
		
		if(carrouselElements<8){
			//Fill with default
			var i;
	    for(i=0+carrouselElements;i<8;i++){
	      carrouselImages.push($("<img class='image_barbutton empty_slide_button' action='default' src='" + VISH.ImagesPath + "templatesthumbs/default.png' />"));
				carrouselElements += 1;
	    }
		}
		
		VISH.Utils.loader.loadImagesOnCarrouselOrder(carrouselImages,_onImagesLoaded,carrouselDivId,carrouselImagesTitles); 
		
   };
	 
	 
	 var _onImagesLoaded = function(){	
		//Add button events
		$(".add_slide_button").hover(
      function () {
        $(this).attr("src", VISH.ImagesPath + "hover/add_slide.png");
      },
      function () {
        $(this).attr("src", VISH.ImagesPath + "templatesthumbs/add_slide.png");
      }
    );
		
		//Unselect all thumbnails
		$(".barbutton").css("background-color", "transparent");
		 
    var options = new Array();
    options['rows'] = 1;
    options['callback'] = _onClickCarrouselElement;
    options['rowItems'] = 8;
    options['scrollItems'] = 1;
	options['styleClass'] = "slides";
	options['width'] = 900;
	options['startAtLastElement'] = true;
	options['pagination'] = false;
	$("#" + carrouselDivId).show();
    VISH.Editor.Carrousel.createCarrousel(carrouselDivId, options);
  }
	
	
	var _onClickCarrouselElement = function(event){
		switch($(event.target).attr("action")){
			case "plus":
				$("#addSlideFancybox").trigger('click');
			  break;
			case "goToSlide":
			  VISH.Slides.goToSlide($(event.target).attr("slideNumber"));
			  break;
			default:
			  break;
		}
	}
	
	
  /**
   * function to select the thumbnail
   */
  var selectThumbnail = function(no){
		$(".image_barbutton").removeClass("selectedSlideThumbnail");
		$(".image_barbutton[slideNumber=" + no + "]").addClass("selectedSlideThumbnail");
		VISH.Editor.Tools.loadSlidesToolbar();
  };
    	
  
	return {
		init              : init,
		redrawThumbnails  : redrawThumbnails,
		selectThumbnail	  : selectThumbnail
	};

}) (VISH, jQuery);