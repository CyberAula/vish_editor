VISH.Editor.Thumbnails = (function(V,$,undefined){
	
	var carrouselDivId = "slides_carrousel";

	//Tmp var
	var redrawThumbnailsCallback;
	
	var init = function(){ 
	}
	 
	var redrawThumbnails = function(successCallback){
		redrawThumbnailsCallback = successCallback;

		//Clean previous content
		V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
		$("#" + carrouselDivId).hide();

		//Generate carrousel images
		var carrouselImages = [];
		var carrouselImagesTitles = [];

		var carrouselElements = 0;
		$('.slides > article').each(function(index,s){
          switch($(s).attr('type')){
			case undefined:
			case V.Constant.STANDARD:
					var template = $(s).attr('template');
					carrouselElements += 1;
					carrouselImages.push($("<img class='image_barbutton fill_slide_button' slideNumber='" + carrouselElements + "' action='goToSlide' src='" + V.ImagesPath + "templatesthumbs/"+ template + ".png' />"));
					carrouselImagesTitles.push(carrouselElements);
				break;
			case V.Constant.FLASHCARD:
					carrouselElements += 1;
					carrouselImages.push($("<img class='image_barbutton fill_slide_button' slideNumber='" + carrouselElements + "' action='goToSlide' src='" + V.Utils.getSrcFromCSS($(s).attr('avatar'))+ "' />"));
					carrouselImagesTitles.push(carrouselElements);
				break;
			case V.Constant.VTOUR:
					carrouselElements += 1;
					carrouselImages.push($("<img class='image_barbutton fill_slide_button' slideNumber='" + carrouselElements + "' action='goToSlide' src='" + V.ImagesPath + "templatesthumbs/tVTour.png' />"));
					carrouselImagesTitles.push(carrouselElements);
				break;
			default:
				break;
		  }          
    	});
		
		//Add plus button
		carrouselImages.push($("<img class='image_barbutton add_slide_button' action='plus' id='addslidebutton' src='" + V.ImagesPath + "templatesthumbs/add_slide.png' />"));
		carrouselElements += 1;

		if(carrouselElements<8){
			//Fill with default
			var i;
			for(i=0+carrouselElements;i<8;i++){
				carrouselImages.push($("<img class='image_barbutton empty_slide_button' action='default' src='" + V.ImagesPath + "templatesthumbs/default.png' />"));
				carrouselElements += 1;
			}
		}

		V.Utils.Loader.loadImagesOnCarrouselOrder(carrouselImages,_onImagesLoaded,carrouselDivId,carrouselImagesTitles); 	
	};
	 

	var _onImagesLoaded = function(){
		var presentationType = V.Editor.getPresentationType();

		//Add button events
		$(".add_slide_button").hover(
			function () {
				$(this).attr("src", V.ImagesPath + "hover/add_slide.png");
			},
			function () {
				$(this).attr("src", V.ImagesPath + "templatesthumbs/add_slide.png");
			}
		);
		
		//Unselect all thumbnails
		$(".barbutton").css("background-color", "transparent");

		var options = new Array();
		options['rows'] = 1;
		options['rowItems'] = 8;
		options['scrollItems'] = 1;
		options['styleClass'] = "slides";
		options['width'] = 900;
		options['startAtLastElement'] = true;
		options['pagination'] = false;
		options['afterCreateCarruselFunction'] = _afterCreateSlidesCarrousel;

		if(presentationType === V.Constant.PRESENTATION){
			options['callback'] = _onClickCarrouselElement;
		} else if(presentationType === V.Constant.FLASHCARD){
			options['callback'] = V.Editor.Flashcard.Creator.onClickCarrouselElement;
		} else if(presentationType === V.Constant.VTOUR){
			options['callback'] = V.Editor.VirtualTour.Creator.onClickCarrouselElement;
		} else {
			//Generic
			options['callback'] = _onClickCarrouselElement;
		}

		//Create carrousel
		$("#" + carrouselDivId).show();
		V.Editor.Carrousel.createCarrousel(carrouselDivId, options);
	}
	
	
	var _afterCreateSlidesCarrousel = function(){
		var presentationType = V.Editor.getPresentationType();

		if(presentationType === V.Constant.PRESENTATION){

			if(V.Slides.getCurrentSlideNumber()>0){
				selectThumbnail(V.Slides.getCurrentSlideNumber());
			}

			//Add sortable
			var firstCarrouselNumber;
			$( "#" + carrouselDivId).sortable({
				items: 'div.carrousel_element_single_row_slides:has(img[action="goToSlide"])',
				change: function(event, ui) {
					//Do nothing
				},
				start: function(event, ui) { 
					firstCarrouselNumber = parseInt($($("div.carrousel_element_single_row_slides")[0]).find("img.carrousel_element_single_row_slides[slidenumber]").attr("slidenumber"));
				},
				stop: function(event, ui) { 
					var dragElement = ui.item;

					var img = $(ui.item).find("img.carrousel_element_single_row_slides[slidenumber]");
					if(isNaN($(img).attr("slidenumber"))){
						return;
					}

					var orgPosition = parseInt($(img).attr("slidenumber"));
					var carrouselContainer =  [];

					$.each($("div.carrousel_element_single_row_slides:has(img[slidenumber])"), function(index, value) {
						carrouselContainer.push(value);
					});

					var destPosition = firstCarrouselNumber + $(carrouselContainer).index($("div.carrousel_element_single_row_slides:has(img[slidenumber='" + orgPosition + "'])"));

					// V.Debugging.log("firstCarrouselNumber: " + firstCarrouselNumber);
					// V.Debugging.log("Org position: " + orgPosition);
					// V.Debugging.log("Dest position: " + destPosition);

					//We must move slide orgPosition after or before destPosition
					var movement = null;
					if(destPosition > orgPosition){
						movement = "after";
					} else if(destPosition < orgPosition){
						movement = "before";
					} else {
						return;
					}

					var slideOrg = V.Slides.getSlideWithNumber(orgPosition);
					var slideDst = V.Slides.getSlideWithNumber(destPosition);

					if((slideOrg!=null)&&(slideDst!=null)&&(movement!=null)){
						V.Editor.Slides.moveSlideTo(slideOrg, slideDst, movement);

						//Update params and counters
						var carrouselVisibleElements = 8;
						$.each($("div.carrousel_element_single_row_slides:has(img[slidenumber])"), function(index, value) {
							var slideNumber = $(value).find("img.carrousel_element_single_row_slides").attr("slidenumber");
							if((slideNumber < firstCarrouselNumber)||(slideNumber > firstCarrouselNumber+carrouselVisibleElements-1)){
								return;
							} else {
								var slideNumber = firstCarrouselNumber + index;
								var p = $(value).find("p.carrousel_element_single_row_slides");
								$(p).html(slideNumber);
								var img = $(value).find("img.carrousel_element_single_row_slides");
								$(img).attr("slidenumber",slideNumber);
							}
						});
					}
				}
			});
		} else if (presentationType === V.Constant.FLASHCARD){
			V.Editor.Flashcard.Creator.redrawPois();
		} else if(presentationType === V.Constant.VTOUR){
			V.Editor.VirtualTour.Creator.redrawPois();
		}

		if(typeof redrawThumbnailsCallback === "function"){
			redrawThumbnailsCallback();
			redrawThumbnailsCallback = undefined;
		}

	}


	var _onClickCarrouselElement = function(event){
		switch($(event.target).attr("action")){
			case "plus":
				$("#addSlideFancybox").trigger('click');
				break;
			case "goToSlide":
				V.Slides.goToSlide($(event.target).attr("slideNumber"));
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
    	
    /*
     * Return the slideNumbers of the current visible thumbnails
     */
    var getVisibleThumbnails = function(){
    	var thumbnails = $("div.carrousel_element_single_row_slides").not(".draggable_arrow_div");
    	var first = _getNumberOfThumbnail($(thumbnails[0]));
    	var last = first;

    	$(thumbnails).each(function(index,thumbnail){
			var number = _getNumberOfThumbnail(thumbnail);
			if(isNaN(number)){
				return false;
			} else {
				last = number;
			}
    	});
    	//Prevent not visible thumbnails to be selected, is:visible doesn't working!
    	var last = Math.min(last,first+7); 
    	return [first,last];
    }

    var _getNumberOfThumbnail = function(thumbnailDiv){
    	return parseInt($(thumbnailDiv).find("img.carrousel_element_single_row_slides[slidenumber]").attr("slidenumber"));
    }

    /*
     * SlideNumber can be also the slide element itself
     */
    var moveCarrouselToSlide = function(slideNumber){
    	V.Editor.Carrousel.goToElement(carrouselDivId,slideNumber-1);
    }
  
	return {
		init              		: init,
		redrawThumbnails  		: redrawThumbnails,
		selectThumbnail	  		: selectThumbnail,
		getVisibleThumbnails	: getVisibleThumbnails,
		moveCarrouselToSlide	: moveCarrouselToSlide
	};

}) (VISH, jQuery);