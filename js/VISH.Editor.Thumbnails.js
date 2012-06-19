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
			  VISH.SlidesUtilities.goToSlide($(event.target).attr("slideNumber"));
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
  };
	
	var goToThumbnail = function(no){
    $("#" + carrouselDivId).trigger("slideTo", no);
	}
	
	var advanceCarrousel = function(no){
		$("#" + carrouselDivId).trigger("next", no);
	}
	
	var backCarrousel = function(no){
    $("#" + carrouselDivId).trigger("prev", no);
  }
	
	var addDefaultThumbnail = function(){
		//Not testing yet
		var plus_element = $(".add_slide_button").parent();
    $("#slides_carrousel").trigger("removeItem", plus_element);
		var new_plus_element = $('<div class="carrousel_element_single_row_slides"><img class="image_barbutton add_slide_button carrousel_element_single_row_slides" action="plus" src="/images/templatesthumbs/add_slide.png" /></div>')
		var element = $('<div class="carrousel_element_single_row_slides"><img class="image_barbutton carrousel_element_single_row_slides" src="/images/templatesthumbs/default.png" action="default"></div>')
    var index = $("div.carrousel_element_single_row_slides").length-1;
		$("#" + carrouselDivId).trigger("insertItem", [element,index]);
    $("#" + carrouselDivId).trigger("insertItem", [new_plus_element,index]);
	}
    	
  
	return {
		init            : init,
		redrawThumbnails  : redrawThumbnails,
		selectThumbnail	  : selectThumbnail,
		goToThumbnail : goToThumbnail,
		advanceCarrousel : advanceCarrousel,
		backCarrousel : backCarrousel
	};

}) (VISH, jQuery);