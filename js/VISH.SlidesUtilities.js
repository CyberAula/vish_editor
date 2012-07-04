VISH.SlidesUtilities = (function(V,$,undefined){
	
  /**
   * function to dispatch the event that redraws the slides
   * also redraws the thumbnails
   */
  var redrawSlides = function(){
		$(document).trigger('OURDOMContentLoaded');
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
			dimentions_for_drawing.height = h_zone;
		return dimentions_for_drawing;
		
	}
	else {
		
			dimentions_for_drawing.width = w_zone;
			dimentions_for_drawing.height = w_zone/aspect_ratio_content;
			
		return  dimentions_for_drawing;
		
		
	}	
};

  /**
   * function to add a new slide
   */
  var addSlide = function(slide){
  	//VISH.Debugging.log("slide es " + slide);
  	//VISH.Debugging.log(".slides es " + $('.slides'));
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
    } else if (no > curSlide+1){
  	  while (curSlide+1 < no) {
    	 nextSlide();
  	  }
    } else if (no < curSlide+1){
  	  while (curSlide+1 > no) {
    	 prevSlide();
  	  }
    }
    
    if(VISH.Editing){
  		//first deselect zone if anyone was selected
  		$(".selectable").css("border-style", "none");
			
			VISH.Editor.Tools.cleanZoneTools();
  		
  		//finally add a background color to thumbnail of the selected slide
    	V.Editor.Thumbnails.selectThumbnail(no);    	
  	}	else {
  		//update slide counter
  		updateSlideCounter();
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
	
	
	/**
   * Function to get width in pixels from a style attribute.
   * If width attribute is given by percent, area (parent container) attribute is needed.
   */
  var getWidthFromStyle = function(style,area){
    return getPixelDimensionsFromStyle(style,area)[0];
  };
	
	 /**
   * Function to get width in pixels from a style attribute.
   * If width attribute is given by percent, area (parent container) attribute is needed.
   */
  var getHeightFromStyle = function(style,area){
    return getPixelDimensionsFromStyle(style,area)[1];
  };
	
 /**
  * Function to get width and height in pixels from a style attribute.
  * If widht or height attribute is given by percent, area (parent container) attribute is needed to convert to pixels.
  */
  var getPixelDimensionsFromStyle = function(style,area){
		var dimensions = [];
    var width=null;
		var height=null;
		var width_percent_pattern = /width:\s?([0-9]+(\.[0-9]+)?)%/g
		var width_px_pattern = /width:\s?([0-9]+(\.?[0-9]+)?)px/g
		var height_percent_pattern = /height:\s?([0-9]+(\.[0-9]+)?)%/g
    var height_px_pattern = /height:\s?([0-9]+(\.?[0-9]+)?)px/g
    
    $.each(style.split(";"), function(index, property){
        //Look for property starting by width
        if(property.indexOf("width") !== -1){
          
          if(property.match(width_px_pattern)){
            //Width defined in px.
            var result = width_px_pattern.exec(property);
            if(result[1]){
              width = result[1];
            }
          } else if(property.match(width_percent_pattern)){
            //Width defined in %.
            var result = width_percent_pattern.exec(property);
            if(result[1]){
              var percent = result[1];
              if(area){
                width = $(area).width()*percent/100;
              }
            }
          }
        } else  if(property.indexOf("height") !== -1){
					
          if(property.match(height_px_pattern)){
            //height defined in px.
            var result = height_px_pattern.exec(property);
            if(result[1]){
              height = result[1];

            }
          } else if(property.match(height_percent_pattern)){
            //Width defined in %.
            var result = height_percent_pattern.exec(property);
            if(result[1]){
              var percent = result[1];
              if(area){
                height = $(area).height()*percent/100;
              }
            }
          }
        }
    });
		
		dimensions.push(width);
    dimensions.push(height);
    return dimensions;
  };
	
	
	var setStyleInPixels = function(style,area){
		var filterStyle = "";
		$.each(style.split(";"), function(index, property){
       if ((property.indexOf("width") === -1)&&(property.indexOf("height")) === -1) {
			   filterStyle = filterStyle + property + "; ";
	     }
    });
		var dimensions = getPixelDimensionsFromStyle(style,area);
		
		if((dimensions)&&(dimensions[0])){
			filterStyle = filterStyle + "width: " + dimensions[0] + "px; ";
			if(dimensions[1]){
				filterStyle = filterStyle + "height: " + dimensions[1] + "px; ";
			}
		}
		return filterStyle;
	}
	
	var getZoomInStyle = function(zoom){
    var style = "";
    style = style + "-ms-transform: scale(" + zoom + "); ";
		style = style + "-ms-transform-origin: 0 0; ";
    style = style + "-moz-transform: scale(" + zoom + "); ";
		style = style + "-moz-transform-origin: 0 0; ";
    style = style + "-o-transform: scale(" + zoom + "); ";
		style = style + "-o-transform-origin: 0 0; ";
    style = style + "-webkit-transform: scale(" + zoom + "); ";
		style = style + "-webkit-transform-origin: 0 0; ";
    return style;
   }
	 
	 var addZoomToStyle = function(style,zoom){
	 	
		if(!style){
			return null;
		}
		
		var filterStyle = "";
    $.each(style.split(";"), function(index, property){
       if ((property.indexOf("-ms-transform") === -1)&&(property.indexOf("-moz-transform") === -1)
			 &&(property.indexOf("-o-transform") === -1)&&(property.indexOf("-webkit-transform") === -1)
			 &&(property.indexOf("-moz-transform-origin") === -1)&&(property.indexOf("-webkit-transform-origin") === -1)
			 &&(property.indexOf("-o-transform-origin") === -1)&&(property.indexOf("-ms-transform-origin") === -1)) {
         filterStyle = filterStyle + property + "; ";
       }
    });
		
//  -moz-transform: scale(1.0);
//  -moz-transform-origin: 0 0;
//  -o-transform: scale(1.0);
//  -o-transform-origin: 0 0;
//  -webkit-transform: scale(1.0);
//  -webkit-transform-origin: 0 0;
//  -ms-transform: scale(1.0);
//  -ms-transform-origin: 0 0;
		
		if(zoom){
			filterStyle = filterStyle + "-ms-transform: scale(" + zoom + "); ";
	    filterStyle = filterStyle + "-ms-transform-origin: 0 0; ";
	    filterStyle = filterStyle + "-moz-transform: scale(" + zoom + "); ";
	    filterStyle = filterStyle + "-moz-transform-origin: 0 0; ";
	    filterStyle = filterStyle + "-o-transform: scale(" + zoom + "); ";
	    filterStyle = filterStyle + "-o-transform-origin: 0 0; ";
	    filterStyle = filterStyle + "-webkit-transform: scale(" + zoom + "); ";
	    filterStyle = filterStyle + "-webkit-transform-origin: 0 0; ";
		}

    return filterStyle;
   }
	 
	 
	var getZoomFromStyle = function(style){
    
		var zoom = 1; //Initial or default zoom
		
		if(!style){
			return zoom;
		}
		
		//Patterns
		var moz_zoom_pattern = /-moz-transform: ?scale\(([0-9]+.[0-9]+)\)/g
		var webkit_zoom_pattern = /-webkit-transform: ?scale\(([0-9]+.[0-9]+)\)/g
		var opera_zoom_pattern = /-o-transform: ?scale\(([0-9]+.[0-9]+)\)/g
		var ie_zoom_pattern = /-ms-transform: ?scale\(([0-9]+.[0-9]+)\)/g

		
    $.each(style.split(";"), function(index, property){
			 
	     if (property.match(moz_zoom_pattern) != null) {
			 	//Mozilla Firefox
		   	var result = moz_zoom_pattern.exec(property);
		   	if (result[1]) {
		   		zoom = parseFloat(result[1]);
		   		return false;
		   	}
		   } else if (property.match(webkit_zoom_pattern)!=null) {
			 	  //Google Chrome
          var result = webkit_zoom_pattern.exec(property);
          if(result[1]){
            zoom = parseFloat(result[1]);
            return false;
          }
	     } else if (property.match(opera_zoom_pattern)!=null) {
			 	  //Opera
          var result = opera_zoom_pattern.exec(property);
          if(result[1]){
            zoom = parseFloat(result[1]);
            return false;
          }
			 } else if (property.match(ie_zoom_pattern)!=null) {
			 	  //Iexplorer
          var result = ie_zoom_pattern.exec(property);
          if(result[1]){
            zoom = parseFloat(result[1]);
            return false;
          }
       }
    });
		
    return zoom;
   }
	
	/**
	 * function to update the number that indicates what slide is diplayed
	 * with this format: 1/12 2/12
	 */
	var updateSlideCounter = function(){
		var number_of_slides = slideEls.length;
		var slide_number = curSlide + 1;
		$("#slide-counter").html(slide_number + "/" + number_of_slides);	
	};
	
	return {
		getWidthFromStyle   : getWidthFromStyle,
		getHeightFromStyle  : getHeightFromStyle,
		getPixelDimensionsFromStyle : getPixelDimensionsFromStyle,
		setStyleInPixels  : setStyleInPixels,
		getZoomInStyle    : getZoomInStyle,
		addZoomToStyle  : addZoomToStyle,
		getZoomFromStyle : getZoomFromStyle,
		goToSlide		    : goToSlide,
		lastSlide		    : lastSlide,
		addSlide		    : addSlide,
		redrawSlides	    : redrawSlides,
		forwardOneSlide     : forwardOneSlide,
		backwardOneSlide    : backwardOneSlide,
		dimentionToDraw     : dimentionToDraw,
		updateSlideCounter  : updateSlideCounter
	};

}) (VISH, jQuery);
