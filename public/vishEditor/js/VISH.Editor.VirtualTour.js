VISH.Editor.VirtualTour = (function(V,$,undefined){

	var init = function(){
	};

	var getDummy = function(slidesetId,options){
		return "<article id='"+slidesetId+"' type='"+V.Constant.VTOUR+"' slidenumber='"+options.slideNumber+"'><div class='delete_slide'></div><img class='help_in_slide help_in_vt' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/></article>";
	};

	/*
	 * Complete the vt scaffold to draw the virtual tour in the presentation
	 */
	var draw = function(slidesetJSON,scaffoldDOM){
		
	};

	var onEnterSlideset = function(vt){
	};

	var onLeaveSlideset = function(vt){
	};

	var loadSlideset = function(vt){
		var vtId = $(vt).attr("id");
		var subslides = $("#" + vtId + " > article");

		//Load Map

		//Show POIs
		$("#subslides_list").find("div.draggable_sc_div").show();
	};

	var unloadSlideset = function(vt){
		//Save POI info
		_savePoisToDom(vt);

		//Hide POIs
		$("#subslides_list").find("div.draggable_sc_div[ddend='background']").hide();
	};

	var beforeCreateSlidesetThumbnails = function(vt){
		//Load POI data
		var POIdata = _getPoisFromDoom(vt);

		//Draw POIS
		_drawPois(vt,POIdata);
	}

	/*
	 * Redraw the pois of the virtual tour
	 * This actions must be called after thumbnails have been rewritten
	 */
	var _drawPois = function(vt,POIdata){
		var pois = {};
		var subslides = $(vt).find("article");

		// $("#subslides_list").find("div.wrapper_barbutton").each(function(index,div){
		// 	var slide = subslides[index];
		// 	if(slide){
		// 		var slide_id = $(slide).attr("id");
		// 		var arrowDiv = $('<div class="draggable_sc_div" slide_id="'+ slide_id +'" >');
		// 		// $(arrowDiv).append($('<img src="'+V.ImagesPath+'flashcard/flashcard_button.png" class="vt_draggable_arrow">'));
		// 		$(arrowDiv).append($('<p class="draggable_number">'+String.fromCharCode(64+index+1)+'</p>'));
		// 		$(div).prepend(arrowDiv);

		// 		var poi = pois[slide_id];
		// 		if(poi){
		// 			//Draw on background
		// 			$(arrowDiv).css("top", poi.y + "px");
		// 			$(arrowDiv).css("left", poi.x + "px");
		// 		};
		// 	};
		// });

		//Drag&Drop POIs

		$("div.draggable_sc_div").draggable({
			start: function( event, ui ) {
			},
			stop: function(event, ui) {
			}
		});
	};


	var _savePoisToJson = function(vt){
		var pois = [];
		return pois;
	}

	var _savePoisToDom = function(vt){
		var poisJSON = _savePoisToJson(vt);
		_savePoisJSONToDom(vt,poisJSON);
		return poisJSON;
	}

	var _savePoisJSONToDom = function(vt,poisJSON){
		$(vt).attr("poisData",JSON.stringify(poisJSON));
	}

	var _getPoisFromDoom = function(vt){
		var poisData = $(vt).attr("poisData");
		if(poisData){
			return JSON.parse($(vt).attr("poisData"));
		} else {
			return [];
		}
	}

	var getThumbnailURL = function(fc){
		return (V.ImagesPath + "templatesthumbs/tVTour.png");
	}


	////////////////////
	// JSON Manipulation
	////////////////////

	/*
	 * Used by VISH.Editor module to save the virtual tour in the JSON
	 */
	var getSlideHeader = function(vt){
		var slide = {};
		slide.id = $(vt).attr('id');
		slide.type = V.Constant.VTOUR;
		if(V.Slides.getCurrentSlide()===vt){
			_savePoisToDom(vt);
		}
		slide.pois = _getPoisFromDoom(vt);
		slide.slides = [];
		return slide;
	}

	/////////////////
	// Clipboard
	/////////////////
	var preCopyActions = function(vtJSON,vtDOM){
		//TODO
	}

	var postCopyActions = function(vtJSON,vtDOM){
		//TODO
	}


	return {
		init 				 			: init,
		getDummy						: getDummy,
		draw 							: draw,
		onEnterSlideset					: onEnterSlideset,
		onLeaveSlideset					: onLeaveSlideset,
		loadSlideset					: loadSlideset,
		unloadSlideset					: unloadSlideset,
		beforeCreateSlidesetThumbnails	: beforeCreateSlidesetThumbnails,
		getSlideHeader					: getSlideHeader,
		getThumbnailURL					: getThumbnailURL,
		preCopyActions					: preCopyActions,
		postCopyActions					: postCopyActions
	};

}) (VISH, jQuery);