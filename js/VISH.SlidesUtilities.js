VISH.SlidesUtilities = (function(V,$,undefined){
	
  /**
   * function to dispatch the event that redraws the slides
   * also redraws the thumbnails
   */
  var redrawSlides = function(){
  	    var evt = document.createEvent("Event");
		evt.initEvent("OURDOMContentLoaded", false, true); // event type,bubbling,cancelable
		document.dispatchEvent(evt);
				
		V.Editor.Thumbnails.redrawThumbnails();
  };
    

  /**
   * function to add a new slide
   */
  var addSlide = function(slide){
  	$('.slides').append(slide);
  };

	
  /**
   * go to the last slide when adding a new one
   */
  var lastSlide = function(){
    goToSlide(slideEls.length);
  };

  /**
   * go to the slide when clicking the thumbnail
   * curSlide is set by slides.js and it is between 0 and the number of slides, so we add 1 in the if conditions
   */
  var goToSlide = function(no){
  	
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
    
    if(VISH.Editing){
  		//first deselect zone if anyone was selected
  		$(".selectable").css("border-style", "none");
  		$(".theslider").hide();
  		//finally add a background color to thumbnail of the selected slide
    	V.Editor.Thumbnails.selectThumbnail(no);    	
  	}
  };
  
  /**
   * function to go to previous slide and change the thumbnails and focus 
   */
  var backwardOneSlide = function(){
  	goToSlide(curSlide);
  };
  
  /**
   * function to go to next slide and change the thumbnails and focus 
   */
  var forwardOneSlide = function(){
  	goToSlide(curSlide+2);
  };


	return {
		goToSlide		  : goToSlide,
		lastSlide		  : lastSlide,
		addSlide		  : addSlide,
		redrawSlides	  : redrawSlides,
		forwardOneSlide   : forwardOneSlide,
		backwardOneSlide  : backwardOneSlide
	};

}) (VISH, jQuery);