VISH.Editor.VirtualTour.Creator = (function(V,$,undefined){

	//Point to current virtual tour (vt).
	//Singleton: Only one virtual tour can be edited in a Vish Editor instance.
	var virtualTourId;
	//Point to the current pois
	var currentPois = undefined;

	//Map vars
	var canvas;
	var map;
	var overlay;


	var init = function(){
		virtualTourId = null;
		canvas = $("#vt_canvas");
	};

	var getCurrentVirtualTourId = function(){
		return virtualTourId;
	}

	/*
	 * Switch to Virtual Tour creator in order to allow the creation of a 
	 * new virtual tour using the current slides
	 */
	var onLoadMode = function(){
		loadVirtualTour();
		//change thumbnail onclick event (preview slide instead of go to edit it)
		//it will change itself depending on presentationType, also remove drag and drop to order slides
		//also a _redrawPois functions is passed to show the pois, do them draggables, etc
		V.Editor.Thumbnails.redrawThumbnails();
		V.Editor.Tools.init();
	};

	/*
	 * Method to call before leave the virtual tour mode
	 * Store the current pois.
	 */
	var onLeaveMode = function(){
		currentPois = _getCurrentPois();
		$("#vtour-background").hide();
	}

	/*
	 * Load a virtual tour in the creator mode
	 * @presentation must be undefined for new virtual tour, or a previous vt
	 * (presentation[type='VirtualTour']) if we are editing an existing vt
	 */
	var loadVirtualTour = function(presentation){
		V.Editor.setPresentationType(V.Constant.VTOUR);
		
		V.Editor.Slides.hideSlides();

		//Show background
		$("#vtour-background").show();

		if(presentation){
			//If we are editing an existing vt
			var virtualTour = presentation.slides[0];
			virtualTourId = virtualTour.id;
			$("#vtour-background").attr("VirtualTour_id", virtualTourId);
		} else {
			//Create new vt
			if(!getCurrentVirtualTourId()){
				virtualTourId = V.Utils.getId("article");
			}
			$("#vtour-background").attr("VirtualTour_id", getCurrentVirtualTourId());
		}
		_loadMap(presentation);
	};

	var _loadMap = function(vt){
		if(!vt){
			//Default values
			vt = {};
			vt.center = {"lat":34,"long":2};
			vt.zoom = 2;
			vt.mapType = V.Constant.VTour.DEFAULT_MAP;
		}
		var latlng = new google.maps.LatLng(vt.center.lat, vt.center.long);
		var myOptions = {
			zoom: vt.zoom,
			center: latlng,
			mapTypeId: vt.mapType
		};
		map = new google.maps.Map($(canvas)[0], myOptions);
		overlay = new google.maps.OverlayView();
		overlay.draw = function() {};
		overlay.setMap(map);
	}

	/*
	 * Redraw the pois of the vt
	 * This actions must be called after thumbnails have been rewritten
	 */
	var redrawPois = function(){

		$(canvas).droppable({
			accept: function(event, ui){
				return true;
			},
			drop: function(event, ui) {

			}
		});

		//Show draggable items
		$(".draggable_arrow_div").show();
		// //Apply them the style to get the previous position
		// _applyStyleToPois();

		var reverted = false;
		$(".draggable_arrow_div").draggable({
			// revert: "invalid", //Go to original position on non-droppable elements
			//This function simulates the "invalid value" functionality, but keeps 
			//the returned value in the 'reverted' var
			revert: function(dropped){
				reverted = !dropped;
				return reverted;
			},
			stop: function( event, ui ) {
				if(reverted){
					return;
				}
				//Compensate div dimensions
				var pageX = event.pageX - 55;
				var pageY = event.pageY - 30;
				var point = new google.maps.Point(pageX,pageY);
				var position = overlay.getProjection().fromContainerPixelToLatLng(point);
				if(_isPositionInViewport(position)){
					var marker = _addMarkerToPosition(position);
					$(event.target).hide();
				} else {
					//Not in map viewport
					//Trigger revert event...
					$(event.target).animate({ top: 0, left: 0 }, 'slow');
				}
			}
		});

		google.maps.event.addListener(map, 'click', function(event) {
			if(event){
				var lat = event.latLng.lat();
				var lng = event.latLng.lng();
				_addMarkerToCoordinates(lat,lng);
			}
		});

		$(".carrousel_element_single_row_slides").droppable();
		$(".image_carousel").css("overflow", "visible");
		$("#menubar").css("z-index", "1075");
		$(".draggable_arrow_div").css("z-index", "1075");
	};

	var _applyStyleToPois = function(){
		if(typeof currentPois === "undefined"){
			//We are loading a virtual tour, get the pois from the vt
			var presentation = V.Editor.getPresentation();
			if(presentation && presentation.slides && presentation.slides[0] && presentation.slides[0].pois){
				currentPois = presentation.slides[0].pois;
			} else {
				return;
			}
		}

		// if(typeof currentPois !== "undefined"){
		// 	$.each(currentPois, function(index, val) { 
		// 		$("#" + val.id).css("position", "fixed");
		// 		$("#" + val.id).offset({ top: 600*parseInt(val.y)/100 + 75, left: 800*parseInt(val.x)/100 + 55});
		// 		$("#" + val.id).attr("moved", "true");
		// 	});
		// }
	};

	///////////////////
	/// MAP Utils
	//////////////////

	var _addMarkerToCoordinates = function(lat,long){
		return _addMarkerToPosition(new google.maps.LatLng(lat,long));
	}

	var _addMarkerToPosition = function(myLatlng,id){
		var marker = new google.maps.Marker({
			position: myLatlng, 
			map: map,
			draggable: true,
			id: id,
			title:"("+myLatlng.lat()+","+myLatlng.lng()+")"
		});

		google.maps.event.addListener(marker, 'click', function(event) {
			V.Debugging.log("Click on marker with id: ");
			V.Debugging.log(marker.id);
		});

		return marker;
	}

	var _isPositionInViewport = function(position) {
		return map.getBounds().contains(position);
	}

	/*
	 * Returns the array of pois to be stored in the JSON
	 * Pois are nested!
	 */
	var getPois = function(){
		// var pois = [];
		// $(".draggable_arrow_div[moved='true']").each(function(index,s){
		// 	pois[index]= {};
		// 	pois[index].id = V.Utils.getId(getCurrentFlashcardId()+"_"+s.id,true);
		// 	pois[index].x = (100*($(s).offset().left - 48)/800).toString(); //to be relative to his parent, the flashcard-background
		// 	pois[index].y = (100*($(s).offset().top - 38)/600).toString(); //to be relative to his parent, the flashcard-background
		// 	pois[index].slide_id = V.Utils.getId(getCurrentFlashcardId()+"_"+$(s).attr('slide_id'),true);
		// });
		// return pois;
	};

	/*
	 * Return the current array of pois, without nesting.
	 * The id matches the id of the DOM element.
	 */
	var _getCurrentPois = function(){
		// var pois = [];
		// $(".draggable_arrow_div[moved='true']").each(function(index,s){
		// 	pois[index]= {};
		// 	pois[index].id = s.id;
		// 	pois[index].x = (100*($(s).offset().left - 48)/800).toString(); //to be relative to his parent, the flashcard-background
		// 	pois[index].y = (100*($(s).offset().top - 38)/600).toString(); //to be relative to his parent, the flashcard-background
		// 	pois[index].slide_id = $(s).attr('slide_id');
		// });
		// return pois;
	};

	var hidePois = function(){
		$(".draggable_arrow_div").hide();
	};

	var hasPoiInMap = function(){

	};

	/*
	 * Carrousel onClick callback
	 */
	var onClickCarrouselElement = function(event){
		switch($(event.target).attr("action")){
			case "plus":
				V.Debugging.log("Show message warning that we are changing to presentation and change");
					$.fancybox(
						$("#message2_form").html(),
						{
							'autoDimensions'	: false,
							'scrolling'			: 'no',
							'width'         	: 550,
							'height'        	: 200,
							'showCloseButton'	: false,
							'padding' 			: 5		
						}
					);
			  break;
			case "goToSlide":
			  	V.Editor.Preview.preview({forcePresentation: true, slideNumberToPreview: parseInt($(event.target).attr("slideNumber"))});
			  break;
			default:
			  break;
		}
	 }


	////////////////////
	// JSON Manipulation
	////////////////////

	/*
	 * Prepare slide to nest
	 */
	var prepareToNestInFlashcard = function(slide){
		return V.Editor.Utils.prepareSlideToNest(virtualTourId,slide);
	}

	/*
	 * Revert the nest of the slides
	 */
	var undoNestedSlidesInFlashcard = function(fc){
		fc.slides = _undoNestedSlides(fc.id,fc.slides);
		fc.pois = _undoNestedPois(fc.id,fc.pois);
		return fc;
	}

	var _undoNestedSlides = function(fcId,slides){
		if(slides){
			var sl = slides.length;
			for(var j=0; j<sl; j++){
				slides[j] = V.Editor.Utils.undoNestedSlide(fcId,slides[j]);
			}
		}
		return slides;
	}

	var _undoNestedPois = function(fcId,pois){
		if(pois){
			var lp = pois.length;
			for(var k=0; k<lp; k++){
				pois[k].id = pois[k].id.replace(fcId+"_","");
				pois[k].slide_id = pois[k].slide_id.replace(fcId+"_","");
			}
		}
		return pois;
	}

	return {
		init 				 		: init,
		getCurrentVirtualTourId		: getCurrentVirtualTourId,
		onLoadMode			 		: onLoadMode,
		onLeaveMode 				: onLeaveMode,
		loadVirtualTour		 		: loadVirtualTour,
		redrawPois 			 		: redrawPois,
		getPois			 			: getPois,
		hidePois			 		: hidePois,
		hasPoiInMap	 				: hasPoiInMap,
		onClickCarrouselElement 	: onClickCarrouselElement,
		prepareToNestInFlashcard 	: prepareToNestInFlashcard,
		undoNestedSlidesInFlashcard : undoNestedSlidesInFlashcard
	};

}) (VISH, jQuery);