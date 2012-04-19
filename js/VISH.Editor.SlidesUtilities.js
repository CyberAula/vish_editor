VISH.Editor.SlidesUtilities = (function(V,$,undefined){
	
  /**
   * function to dispatch the event that redraws the slides
   */
  var redrawSlides = function(){
  	    var evt = document.createEvent("Event");
		evt.initEvent("OURDOMContentLoaded", false, true); // event type,bubbling,cancelable
		document.dispatchEvent(evt);
		
		lastSlide();
  };
	
  /**
   * function to redraw the slides thumbnails
   * used when removing one slide
   */	
   var redrawThumbnails = function(){
   		//first we remove all the thumbnails and the click events to add them again
   		var i = 1;
   		for(i = 1; i < slideEls.length+1; i++){
   			$("#slide_thumb_"+ i).off("click");
			$("#slide_thumb_"+ i).css("cursor", "auto");
			$("#slide_thumb_"+ i + " .slide_number").html("");
			$("#slide_thumb_"+ i + " img").attr("src", VISH.ImagesPath + "templatesthumbs/default.png");
   		}
   		//unselect all thumbnails
   		$(".barbutton").css("background-color", "transparent");
   		//if we have more than 1 slide, we will highlight the next one to current slide
   		if(slideEls.length > 1){
   			var slide_to_highlight = curSlide + 1;
   			$("#slide_thumb_"+ slide_to_highlight).css("background-color", "#ACACAC");
   		}
   		
   		//now we add them again
   		var template = 0; //template to add as thumbnail
   		var position = 1;  //position to add the thumbnail
   		$('article').each(function(index,s){
      		template = $(s).attr('template');
      		addThumbnail(template, position);
      		position += 1;
     	});
   };
	
  /**
   * function to add a new slide
   */
  function addSlide(slide){
  	$('.slides').append(slide);
  };

	/**
	 * function to add a thumbnail of the added slide and activate the onlicks of the thumbnail
	 */
	function addThumbnail(template_number, position){
		//var number_of_slides = slideEls.length + 1;  //it is slideEls.length +1 because we have recently added a slide and it is not in this array
		$("#slide_thumb_"+ position).click( function() {
  			goToSlide(position);
		});
		$("#slide_thumb_"+ position).css("cursor", "pointer");
		$("#slide_thumb_"+ position + " .slide_number").html(position);
		$("#slide_thumb_"+ position + " img").attr("src", VISH.ImagesPath + "templatesthumbs/"+template_number + ".png");
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
  	//first deselect zone if anyone was selected
  	$(".selectable").css("border-style", "none");
  	$(".theslider").hide();
  	
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
    $("#slide_thumb_"+ no).css("background-color", "#ACACAC");
  };


	return {
		goToSlide		:  goToSlide,
		lastSlide		:  lastSlide,
		addSlide		:  addSlide,
		addThumbnail	: addThumbnail,
		redrawSlides	: redrawSlides,
		redrawThumbnails   : redrawThumbnails
	};

}) (VISH, jQuery);