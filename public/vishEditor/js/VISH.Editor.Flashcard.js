VISH.Editor.Flashcard = (function(V,$,undefined){

	var init = function(){
	};

	var getDummy = function(slidesetId,options){
		return "<article id='"+slidesetId+"' type='"+V.Constant.FLASHCARD+"' slidenumber='"+options.slideNumber+"'><div class='delete_slide'></div><img class='help_in_slide help_in_flashcard' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div class='change_bg_button'></div></article>";
	};

	/*
	 * Complete the fc scaffold to draw the flashcard in the presentation
	 */
	var draw = function(slidesetJSON,scaffoldDOM){
		if(slidesetJSON.background){
			onBackgroundSelected(V.Utils.getSrcFromCSS(slidesetJSON.background));
		};
		if(slidesetJSON.pois){
			_savePoisJSONToDom(scaffoldDOM,slidesetJSON.pois);
		};
	};

	var onEnterSlideset = function(fc){
	};

	var onLeaveSlideset = function(fc){
	};

	var loadSlideset = function(fc){
		//Load flashcard
		var fcId = $(fc).attr("id");
		var subslides = $("#" + fcId + " > article");

		//Show POIs
		$("#subslides_list").find("div.draggable_sc_div").show();
	};

	var unloadSlideset = function(fc){
		//Unload flashcard

		//Save POI info
		_savePoisToDom(fc);

		//Hide POIs
		$("#subslides_list").find("div.draggable_sc_div[ddend='background']").hide();
	};

	var beforeCreateSlidesetThumbnails = function(fc){
		//Load POI data
		var POIdata = _getPoisFromDoom(fc);

		//Draw POIS
		_drawPois(fc,POIdata);
	}

	/*
	 * Redraw the pois of the flashcard
	 * This actions must be called after thumbnails have been rewritten
	 */
	var _drawPois = function(fc,POIdata){
		var pois = {};
		var fc_offset = $(fc).offset();

		//Translate relative POI top and left to pixels and index pois based on slide_id
		for(var i=0; i<POIdata.length; i++){
			var myPoi = POIdata[i];

			//Create new POI
			pois[myPoi.slide_id] = {};
			pois[myPoi.slide_id].id = myPoi.id;
			pois[myPoi.slide_id].x = (myPoi.x*800/100)+fc_offset.left;
			pois[myPoi.slide_id].y = (myPoi.y*600/100)+fc_offset.top;
			pois[myPoi.slide_id].slide_id = myPoi.slide_id;
		};

		var subslides = $(fc).find("article");

		$("#subslides_list").find("div.wrapper_barbutton").each(function(index,div){
			var slide = subslides[index];
			if(slide){
				var slide_id = $(slide).attr("id");
				var arrowDiv = $('<div class="draggable_sc_div" slide_id="'+ slide_id +'" >');
				$(arrowDiv).append($('<img src="'+V.ImagesPath+'flashcard/flashcard_button.png" class="fc_draggable_arrow">'));
				$(arrowDiv).append($('<p class="draggable_number">'+String.fromCharCode(64+index+1)+'</p>'));
				$(div).prepend(arrowDiv);

				var poi = pois[slide_id];
				if(poi){
					//Draw on background
					$(arrowDiv).css("position", "fixed");
					$(arrowDiv).css("margin-top", "0px");
					$(arrowDiv).css("margin-left", "0px");
					$(arrowDiv).css("top", poi.y + "px");
					$(arrowDiv).css("left", poi.x + "px");
					$(arrowDiv).attr("ddstart","scrollbar");
					$(arrowDiv).attr("ddend","background");
				};
			};
		});

		var isBackgroundShowing = (V.Editor.Slideset.getCurrentSubslide()==null);
		if(!isBackgroundShowing){
			$("#subslides_list").find("div.draggable_sc_div[ddend='background']").hide();
		}

		//Drag&Drop POIs

		$("div.draggable_sc_div").draggable({
			start: function( event, ui ) {
				var position = $(event.target).css("position");
				if(position==="fixed"){
					//Start d&d in background
					$(event.target).attr("ddstart","background");
				} else {
					//Start d&d in scrollbar
					//Compensate change to position fixed with margins
					var current_offset = $(event.target).offset();
					$(event.target).css("position", "fixed");
					$(event.target).css("margin-top", (current_offset.top) + "px");
					$(event.target).css("margin-left", (current_offset.left) + "px");
					$(event.target).attr("ddstart","scrollbar");
				}
			},
			stop: function(event, ui) {
				//Chek if poi is inside background
				var current_offset = $(event.target).offset();
				var fc_offset = $(fc).offset();
				var yOk = ((current_offset.top > (fc_offset.top-10))&&(current_offset.top < (fc_offset.top+$(fc).outerHeight()-38)));
				var xOk = ((current_offset.left > (fc_offset.left-5))&&(current_offset.left < (fc_offset.left+$(fc).outerWidth()-44)));
				var insideBackground = ((yOk)&&(xOk));

				//Check that the flashcard is showed at the current moment
				insideBackground = (insideBackground && V.Editor.Slideset.getCurrentSubslide()==null);

				if(insideBackground){
					$(event.target).attr("ddend","background");

					if($(event.target).attr("ddstart")==="scrollbar"){
						//Drop inside background from scrollbar
						//Transform margins to top and left
						var newTop = $(event.target).cssNumber("margin-top") +  $(event.target).cssNumber("top");
						var newLeft = $(event.target).cssNumber("margin-left") +  $(event.target).cssNumber("left");
						$(event.target).css("margin-top", "0px");
						$(event.target).css("margin-left", "0px");
						$(event.target).css("top", newTop+"px");
						$(event.target).css("left", newLeft+"px");
					} else {
						//Drop inside background from background
						//Do nothing
					}
				} else {
					//Drop outside background
					//Return to original position

					if($(event.target).attr("ddstart")==="scrollbar"){
						//Do nothing
					} else if($(event.target).attr("ddstart")==="background"){
						//Decompose top and left, in top,left,margin-top and margin-left
						//This way, top:0 and left:0 will lead to the original position

						//Get the parent (container in scrollbar)
						var parent = $(event.target).parent();
						var parent_offset = $(parent).offset();

						var newMarginTop = parent_offset.top - 20;
						var newMarginLeft = parent_offset.left + 12;
						var newTop = $(event.target).cssNumber("top") - newMarginTop;
						var newLeft = $(event.target).cssNumber("left") - newMarginLeft;
						$(event.target).css("margin-top", newMarginTop+"px");
						$(event.target).css("margin-left", newMarginLeft+"px");
						$(event.target).css("top", newTop+"px");
						$(event.target).css("left", newLeft+"px");	
					}

					$(event.target).animate({ top: 0, left: 0 }, 'slow', function(){
						//Animate complete
						$(event.target).css("position", "absolute");
						//Original margins
						$(event.target).css("margin-top","-20px");
						$(event.target).css("margin-left","12px");
						$(event.target).attr("ddend","scrollbar");
					});
				}
			}
		});
	};


	var _savePoisToJson = function(fc){
		var pois = [];
		var poisDOM = $("#subslides_list").find("div.draggable_sc_div[ddend='background']");

		var hasCurrentClass = $(fc).hasClass("current");
		if(!hasCurrentClass){
			$(fc).addClass("current");
		}
		$(fc).addClass("temp_shown");
		$(poisDOM).addClass("temp_shown");
		
		var fc_offset = $(fc).offset();

		$(poisDOM).each(function(index,poi){
				pois[index]= {};
				pois[index].id = $(fc).attr("id") + "_poi" + (index+1);
				pois[index].x = (100*($(poi).offset().left - fc_offset.left)/800).toString();
				pois[index].y = (100*($(poi).offset().top - fc_offset.top)/600).toString();
				pois[index].slide_id = $(poi).attr('slide_id');
		});

		if(!hasCurrentClass){
			$(fc).removeClass("current");
		}
		$(poisDOM).removeClass("temp_shown");
		$(fc).removeClass("temp_shown");

		return pois;
	}

	var _savePoisToDom = function(fc){
		var poisJSON = _savePoisToJson(fc);
		_savePoisJSONToDom(fc,poisJSON);
		return poisJSON;
	}

	var _savePoisJSONToDom = function(fc,poisJSON){
		$(fc).attr("poisData",JSON.stringify(poisJSON));
	}

	var _getPoisFromDoom = function(fc){
		var poisData = $(fc).attr("poisData");
		if(poisData){
			return JSON.parse($(fc).attr("poisData"));
		} else {
			return [];
		}
	}

	/*
	 * Callback from the V.Editor.Image module to add the background
	 */
	var onBackgroundSelected = function(contentToAdd){
		var fc = V.Slides.getCurrentSlide();

		if($(fc).attr("type")===V.Constant.FLASHCARD){
			$(fc).css("background-image", "url("+contentToAdd+")");
			$(fc).attr("avatar", "url("+contentToAdd+")");
			$(fc).find("div.change_bg_button").hide();

			//Update thumbnails
			V.Editor.Slideset.updateThumbnails(fc);
		}

		$.fancybox.close();
	}

	var getThumbnailURL = function(fc){
		var avatar = $(fc).attr('avatar');
		if(avatar){
			return V.Utils.getSrcFromCSS(avatar);
		} else {
			return (V.ImagesPath + "templatesthumbs/flashcard_template.png");
		}
	}


	////////////////////
	// JSON Manipulation
	////////////////////

	/*
	 * Used by VISH.Editor module to save the flashcard in the JSON
	 */
	var getSlideHeader = function(fc){
		var slide = {};
		slide.id = $(fc).attr('id');
		slide.type = V.Constant.FLASHCARD;
		slide.background = $(fc).css("background-image");
		if(V.Slides.getCurrentSlide()===fc){
			_savePoisToDom(fc);
		}
		slide.pois = _getPoisFromDoom(fc);
		slide.slides = [];
		return slide;
	}

	/////////////////
	// Clipboard
	/////////////////
	var preCopyActions = function(fcJSON,fcDOM){
		//TODO
	}

	var postCopyActions = function(fcJSON,fcDOM){
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
		onBackgroundSelected			: onBackgroundSelected,
		getThumbnailURL					: getThumbnailURL,
		preCopyActions					: preCopyActions,
		postCopyActions					: postCopyActions
	};

}) (VISH, jQuery);