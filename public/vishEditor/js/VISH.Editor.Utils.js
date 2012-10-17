VISH.Editor.Utils = (function(V,$,undefined){

   /**
	* Function to dispatch the event that redraws the slides
	*/
	var redrawSlides = function(){
		$(document).trigger('OURDOMContentLoaded');
	};
    
	var hideSlides = function(){
		$(".slides > article").addClass("temp_hidden");
	};

	var showSlides = function(){
		$(".slides > article").removeClass("temp_hidden");
	};


	/*
	 * Function to draw elements in an area, try to fit in the drawable area 
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
		} else {
			dimentions_for_drawing.width = w_zone;
			dimentions_for_drawing.height = w_zone/aspect_ratio_content;
			return  dimentions_for_drawing;
		}	
	};


   /**
	* Function to add a new slide
	*/
	var addSlide = function(slide){
		$('.slides').append(slide);
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
	 
	/**
	 * function to get the styles in percentages
	 */
	var getStylesInPercentages = function(parent, element){
		var WidthPercent = element.width()*100/parent.width();
		var HeightPercent = element.height()*100/parent.height();
		var TopPercent = element.position().top*100/parent.height();
		var LeftPercent = element.position().left*100/parent.width();
		return "position: relative; width:" + WidthPercent + "%; height:" + HeightPercent + "%; top:" + TopPercent + "%; left:" + LeftPercent + "%;" ;
	}; 
	
	

	return {
		getWidthFromStyle   : getWidthFromStyle,
		getHeightFromStyle  : getHeightFromStyle,
		getPixelDimensionsFromStyle : getPixelDimensionsFromStyle,
		hideSlides			: hideSlides,
		setStyleInPixels  : setStyleInPixels,		
		addZoomToStyle  : addZoomToStyle,	
		getStylesInPercentages : 	getStylesInPercentages,	
		addSlide		    : addSlide,
		redrawSlides	    : redrawSlides,
		dimentionToDraw     : dimentionToDraw,
		showSlides			: showSlides
	};

}) (VISH, jQuery);