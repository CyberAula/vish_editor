VISH.Editor.Utils = (function(V,$,undefined){

	/*
	 * Function to draw elements in an area, try to fit in the drawable area 
	 */
	var dimentionToDraw = function (w_zone, h_zone, w_content, h_content) {
		var dimentions_for_drawing = {width:  w_content, height: h_content};
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
	
	
	var setStyleInPixels = function(style,area){
		var filterStyle = "";
		$.each(style.split(";"), function(index, property){
			if ((property.indexOf("width") === -1)&&(property.indexOf("height")) === -1) {
				filterStyle = filterStyle + property + "; ";
			}
		});
		
		var dimensions = V.Utils.getPixelDimensionsFromStyle(style,area);

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


	/* Generate table for carrousels */
	var generateTable = function(author,title,description){       
		if(!author){
			author = "";
		}
		if(!title){
			title = "";
		}
		if(!description){
			description = "";
		}

		return "<table class=\"metadata\">"+
		 "<tr class=\"even\">" +
		   "<td class=\"title header_left\">" + V.Editor.I18n.getTrans("i.Title") + "</td>" + 
		   "<td class=\"title header_right\"><div class=\"height_wrapper\">" + title + "</div></td>" + 
		 "</tr>" + 
		 "<tr class=\"odd\">" + 
		   "<td class=\"title\">" + V.Editor.I18n.getTrans("i.Author") + "</td>" + 
		   "<td class=\"info\"><div class=\"height_wrapper\">" + author + "</div></td>" + 
		 "</tr>" + 
		 "<tr class=\"even\">" + 
		   "<td colspan=\"2\" class=\"title_description\">" + V.Editor.I18n.getTrans("i.Description") + "</td>" + 
		 "</tr>" + 
		 "<tr class=\"odd\">" + 
		   "<td colspan=\"2\" class=\"info_description\"><div class=\"height_wrapper_description\">" + description + "</div></td>" + 
		 "</tr>" + 
		"</table>";
	}


	var convertToTagsArray = function(tags){
		var tagsArray = [];

		if((!tags)||(tags.length==0)){
			return tagsArray;
		}

		$.each(tags, function(index, tag) {
			tagsArray.push(tag.value)
		});

		return tagsArray;
	}


	//Help function to autocomplete user inputs.
	//Add HTTP if is not present.
	var autocompleteUrls = function(input){
		var http_urls_pattern=/(^http(s)?:\/\/)/g
		var objectInfo = V.Object.getObjectInfo();

		if((objectInfo.wrapper==null)&&(input.match(http_urls_pattern)==null)){
			return "http://" + input;
		} else {
			return input;
		}
	}


	var filterFilePath = function(path){
		return path.replace("C:\\fakepath\\","");
	}


   /*
	* Modify slide ids to nest in a parent slide.
	*/
	var prepareSlideToNest = function(parentId,slide){
		if(typeof parentId !== "string"){
			return slide;
		}

		if((slide.type===V.Constant.FLASHCARD)||(slide.type===V.Constant.VTOUR)){
			//Only one slide nested level are currently supported
			//TODO: Make it recursive
			return;
		}

		slide.id = V.Utils.getId(parentId + "_" + slide.id,true);
		if(slide.elements){
			$.each(slide.elements, function(index, element) {
				slide.elements[index].id = V.Utils.getId(parentId + "_" + slide.elements[index].id,true);
			});
		}
		return slide;
	}

	var undoNestedSlide = function(parentId,slide){
		if(typeof parentId !== "string"){
			return slide;
		}

		if((slide.type===V.Constant.FLASHCARD)||(slide.type===V.Constant.VTOUR)){
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

		var slideType = V.Slides.getSlideType(slide);
		switch(slideType){
			case V.Constant.STANDARD:
				slide = _replaceIdsForStandardSlide(slide,slideId);
				break;
			case V.Constant.FLASHCARD:
				slide = _replaceIdsForFlashcardSlide(slide,slideId);
				break;
			default:
				return;
		}

		return slide;
	}

	var _replaceIdsForStandardSlide = function(slide,slideId){
		//Replace zone Ids
		$(slide).children("div[id][areaid]").each(function(index, zone) {
			zone = _replaceIdsForZone(zone,slideId);
		});
		return slide;
	};

	var _replaceIdsForFlashcardSlide = function(flashcard,flashcardId){
		var pois = $(flashcard).find("div.fc_poi");
		$(pois).each(function(index, poi) {
			var poiId = V.Utils.getId(flashcardId + "_poi");
			$(poi).attr("id",poiId);
		});
		
		var subslides = $(flashcard).find(".subslides > article.subslide");

		$(subslides).each(function(index, subSlide) {
			subSlide = _replaceIdsForSubSlide(subSlide,flashcardId);
		});

		return flashcard;
	};

	var _replaceIdsForSubSlide = function(subSlide,parentId){
		var slideId = V.Utils.getId(parentId + "_article");
		$(subSlide).attr("id",slideId);

		//Close button
		$(subSlide).children(".close_subslide").attr("id","close" + slideId);

		//Zones
		var zones = $(subSlide).children("div[id]").not(".close_subslide");
		$(zones).each(function(index, zone) {
			zone = _replaceIdsForZone(zone,slideId);
		});
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

   /*
	* Ensure that forceId is really unic in the DOM before call replaceIdsForFlashcardJSON.
	* ForceId is used to clone a flashcard JSON when you copy it with the clipboard.
	*/
	var replaceIdsForFlashcardJSON = function(flashcard,forceId){
		var hash_subslide_new_ids = {};
		var old_id;
		var fc = jQuery.extend(true, {}, flashcard);

		if(forceId){
			fc.id = forceId;
		} else {
			fc.id = V.Utils.getId("article");
		}

		for(var ind in fc.slides){			
			old_id = fc.slides[ind].id;
			fc.slides[ind].id = V.Utils.getId(fc.id + "_article" + (parseInt(ind)+1),true);
			hash_subslide_new_ids[old_id] = fc.slides[ind].id;
		}
		for(var num in fc.pois){	
			fc.pois[num].id = V.Utils.getId(fc.id + "_poi" + (parseInt(num)+1),true);
			fc.pois[num].slide_id = hash_subslide_new_ids[fc.pois[num].slide_id];
		}
		return fc;
	};

	var cleanTextAreas = function(slide){
		$(slide).find("div[type='text']").each(function(index,textArea){
			$(textArea).html("");
		});
		return slide;
	}

	return {
		setStyleInPixels  			: setStyleInPixels,		
		addZoomToStyle  			: addZoomToStyle,	
		getStylesInPercentages 		: getStylesInPercentages,
		dimentionToDraw     		: dimentionToDraw,
		refreshDraggables			: refreshDraggables,
		replaceIdsForSlide 			: replaceIdsForSlide,
		replaceIdsForFlashcardJSON  : replaceIdsForFlashcardJSON,
		prepareSlideToNest			: prepareSlideToNest,
		undoNestedSlide 			: undoNestedSlide,
		generateTable 				: generateTable,
		convertToTagsArray 			: convertToTagsArray,
		autocompleteUrls 			: autocompleteUrls,
		filterFilePath 				: filterFilePath,
		cleanTextAreas 				: cleanTextAreas
	};

}) (VISH, jQuery);