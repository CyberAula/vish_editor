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
    
/*
 * function to draw elements in an area, try to fit in the drawable area 
 * 
 */
var dimentionToDraw = function (w_zone, h_zone, w_content, h_content) {
var element_type;
var dimentions_for_drawing = {width:  350, height: 195};

var aspect_ratio_zone = w_zone/h_zone;
var aspect_ratio_content = w_content/h_content;

if (aspect_ratio_zone>aspect_ratio_content) {
	
		dimentions_for_drawing.width = aspect_ratio_content*h_zone;
		dimentions_for_drawing.height = h_content;
	return dimentions_for_drawing;
	
}
else {
	
		dimentions_for_drawing.width = w_zone;
		dimentions_for_drawing.height = w_zone/aspect_ratio_content;
		
	return  dimentions_for_drawing;
	
	
}
/*
if (w_element == h_element) {
//element is square
	element_type = "square";
}
else if (w_element> h_element) {
	
	element_type = "rectangle";
	
} else {
	element_type = "vertical_rectangle";
	
	
}
		    
switch(element_type){ 
//the element to draw is square
	case "square":	
	console.log("element square");
	
	if(w_zone == h_zone) { //swquare area 
		console.log("square area");
	dimentions_for_drawing.width = w_zone;
	dimentions_for_drawing.height = h_zone;
	}
	
	else if(w_zone > h_zone) {
		console.log("rectangle area");
		
		dimentions_for_drawing.width = h_zone;
		dimentions_for_drawing.height = h_zone;
		
		
	}
	
	else if(w_zone < h_zone) {
		console.log("vertical rectangle area");
		
		dimentions_for_drawing.width = w_zone;
		dimentions_for_drawing.height = w_zone;
		
		
	}
	else {
		dimentions_for_drawing.width = w_element;
		dimentions_for_drawing.height = h_element;
		
	}
	break; 
//the element to draw is rectangle (width > height)
	case "rectangle":	
	console.log("element rectangle");
	
	if(w_zone == h_zone) { //square area 
		console.log("square area");
		var scale = w_zone/w_element; 
	dimentions_for_drawing.width = w_zone;
	dimentions_for_drawing.height = h_element*scale;
	}
	
	else if(w_zone > h_zone) { //rectangle area
		console.log("rectangle area");
		var scale = w_zone/w_element; 
		dimentions_for_drawing.width = w_zone;
		dimentions_for_drawing.height = h_zone*scale;
		
		
	}
	
	else if(w_zone < h_zone) {//vertical rectangle area
		console.log("vertical rectangle area");
		
		dimentions_for_drawing.width = w_zone;
		dimentions_for_drawing.height = w_zone*scale;
		
		
	}
	else {
		dimentions_for_drawing.width = w_element;
		dimentions_for_drawing.height = h_element;
		
	}
	 break;

//the element to draw is vertical rectangle (width > height)
	case "vertical_rectangle":	
	console.log("element vertical rectangle");
	
	if(w_zone == h_zone) { //square area 
		console.log("square area");
		var scale = w_zone/w_element; 
	dimentions_for_drawing.width = w_zone;
	dimentions_for_drawing.height = h_element*scale;
	}
	
	else if(w_zone > h_zone) { //rectangle area
		console.log("rectangle area");
		var scale = w_zone/w_element; 
		dimentions_for_drawing.width = w_zone;
		dimentions_for_drawing.height = h_zone*scale;
		
		
	}
	
	else if(w_zone < h_zone) {//vertical rectangle area
		console.log("vertical rectangle area");
		
		dimentions_for_drawing.width = w_zone;
		dimentions_for_drawing.height = w_zone*scale;
		
		
	}
	else {
		dimentions_for_drawing.width = w_element;
		dimentions_for_drawing.height = h_element;
		
	}
	break;

	default:
			console.log("Unrecognized element area: " + element_type);
            break;

}




	console.log("entra en dimentionToDraw");
	
	
	*/
	
		
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
		backwardOneSlide  : backwardOneSlide,
		dimentionToDraw   : dimentionToDraw
	};

}) (VISH, jQuery);
