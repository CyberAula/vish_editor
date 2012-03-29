VISH.Editor.SlidesUtilities = (function(V,$,undefined){
	
  /**
   * function to add a new slide
   */
  function addSlide(slide){
  	$('.slides').append(slide);
  };

	/**
	 * function to add a thumbnail of the added slide and activate the onlicks of the thumbnail
	 */
	function addThumbnail(template_number){
		var number_of_slides = slideEls.length + 1;  //it is slideEls.length +1 because we have recently added a slide and it is not in this array
		$("#"+ "slide_thumb_"+ number_of_slides).click( function() {
  			goToSlide(number_of_slides);
		});
		$("#"+ "slide_thumb_"+ number_of_slides).css("cursor", "pointer");
		$("#"+ "slide_thumb_"+ number_of_slides + " .slide_number").html(number_of_slides);
		$("#"+ "slide_thumb_"+ number_of_slides + " img").attr("src", VISH.ImagesPath + "templatesthumbs/t"+template_number + ".png");
	}

  /**
   * go to the last slide when adding a new one
   */
  function lastSlide(){
    goToSlide(slideEls.length);
  };

  /**
   * go to the slide when clicking the thumbnail
   * curSlide is set by slides.js and it is between 0 and the number of slides, so we add 1 in the if conditions
   */
  function goToSlide(no){
    if((no > slideEls.length) || (no <= 0)){
  	  return;
    }
    else if (no > curSlide+1){
  	  while (curSlide+1 < no) {
    	nextSlide();
  	  }
    }
    else if (no < curSlide+1){
  	  while (curSlide+1 > no) {
    	prevSlide();
  	  }
    }
    //finally add a background color to the selected slide
    $(".barbutton").css("background-color", "transparent");
    $("#"+ "slide_thumb_"+ no).css("background-color", "blue");
  };


	return {
		goToSlide		:  goToSlide,
		lastSlide		:  lastSlide,
		addSlide		:  addSlide,
		addThumbnail	: addThumbnail
	};

}) (VISH, jQuery);