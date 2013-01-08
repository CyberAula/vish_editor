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
	
	
	var refreshDraggables = function(slide){
		//Class ui_draggable has removed... look for draggable=true param
		$(slide).find("[draggable='true']").draggable({
			cursor: "move",
			stop: function(){
				$(this).parent().click();  //call parent click to select it in case it was unselected	
			}
		});
	}

   /*
	* Modify slide ids to nest in a parent slide.
	*/
	var prepareSlideToNest = function(parentId,slide){
		if(typeof parentId !== "string"){
			return slide;
		}

		if((slide.type===VISH.Constant.FLASHCARD)||(slide.type===VISH.Constant.VTOUR)){
			//Only one slide nested level are currently supported
			//TODO: Make it recursive
			return;
		}

		slide.id = VISH.Utils.getId(parentId + "_" + slide.id,true);
		if(slide.elements){
			$.each(slide.elements, function(index, element) {
				slide.elements[index].id = VISH.Utils.getId(parentId + "_" + slide.elements[index].id,true);
			});
		}
		return slide;
	}

	var undoNestedSlide = function(parentId,slide){
		if(typeof parentId !== "string"){
			return slide;
		}

		if((slide.type===VISH.Constant.FLASHCARD)||(slide.type===VISH.Constant.VTOUR)){
			//Only one slide nested level are currently supported
			//TODO: Make it recursive
			return;
		}

		slide.id = slide.id.replace(parentId+"_","");

		if(slide.elements){
			$.each(slide.elements, function(index, element) {
				slide.elements[index].id = slide.elements[index].id.replace(parentId+"_","");
			});
		}

		return slide;	
	}

	var replaceIdsForSlide = function(slide){
		var slideId = V.Utils.getId("article");
		$(slide).attr("id",slideId);

		var slideType = VISH.Slides.getSlideType(slide);

		switch(slideType){
			case VISH.Constant.STANDARD:
				slide = _replaceIdsForStandardSlide(slide);
				break;
			case VISH.Constant.FLASHCARD:
				// slide = _replaceIdsForFlashcardSlide(slide);
				return;
				break;
			default:
				return;
		}

		return slide;
	}

	var _replaceIdsForZone = function(zone,slideId){
		var zoneId = V.Utils.getId(slideId + "_zone");
		$(zone).attr("id",zoneId);

		$(zone).find("[id]").each(function(index, el) {
			el = _replaceIdsForEl(el,zoneId);
		});

		return zone;
	}

	var _replaceIdsForEl = function(el,zoneId){
		var elName = _getNameOfEl(el);
		var elId = V.Utils.getId(zoneId + "_" + elName);
		$(el).attr("id",elId);
		return el;
	}

	var _getNameOfEl = function(el){
		var elName = $($(el).attr("id").split("_")).last()[0];
		if (elName.length>1){
			return elName.substring(0,elName.length-1);
		} else {
			return elName;
		}
	}

	var _replaceIdsForStandardSlide = function(slide){
		//Replace zone Ids
		$(slide).children("div[id][areaid]").each(function(index, zone) {
			zone = _replaceIdsForZone(zone,slideId);
		});
		return slide;
	};

	var _replaceIdsForFlashcardSlide = function(flashcard){
		VISH.Debugging.log("Copy flashcard");
		VISH.Debugging.log(slide);
		//TODO

		return flashcard;
	};

	// var _changeFlashcardIds = function(flashcard){
	// 	var hash_subslide_new_ids = {};
	// 	var old_id;
	// 	flashcard.id = V.Utils.getId("article");
	// 	for(var ind in flashcard.slides){			
	// 		old_id = flashcard.slides[ind].id;
	// 		flashcard.slides[ind].id = V.Utils.getId(flashcard.id + "_article");
	// 		hash_subslide_new_ids[old_id] = flashcard.slides[ind].id;
	// 	}
	// 	for(var num in flashcard.pois){	
	// 		flashcard.pois[num].id = V.Utils.getId(flashcard.id + "_poi");
	// 		flashcard.pois[num].slide_id = hash_subslide_new_ids[flashcard.pois[num].slide_id];
	// 	}
	// 	return flashcard;
	// };

	return {
		getWidthFromStyle   	: getWidthFromStyle,
		getHeightFromStyle  	: getHeightFromStyle,
		getPixelDimensionsFromStyle : getPixelDimensionsFromStyle,
		hideSlides				: hideSlides,
		setStyleInPixels  		: setStyleInPixels,		
		addZoomToStyle  		: addZoomToStyle,	
		getStylesInPercentages 	: 	getStylesInPercentages,
		redrawSlides	    	: redrawSlides,
		dimentionToDraw     	: dimentionToDraw,
		showSlides				: showSlides,
		refreshDraggables		: refreshDraggables,
		prepareSlideToNest		: prepareSlideToNest,
		replaceIdsForSlide 		: replaceIdsForSlide,
		undoNestedSlide 		: undoNestedSlide
	};

}) (VISH, jQuery);