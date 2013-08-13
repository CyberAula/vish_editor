VISH.Editor.VirtualTour.Creator = (function(V,$,undefined){

	//Point to current virtual tour (vt).
	//Singleton: Only one virtual tour can be edited in a Vish Editor instance.
	var virtualTourId;
	//Point to the current pois
	var currentPois = undefined;
	//Point to the current markers
	var markers;

	//Map vars
	var canvas;
	var map;
	var overlay;

	//Geocoder
	var geocoder;

	//Internal
	var initialized = false;
	var single_click;
	var click_timer;
	var trustOrgPois = false;
	//Loading GoogleMaps library asynchronously
	var gMlLoaded = false;



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

		// Draw previous pois
		_restorePois();

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
					var poi_id = $(event.target).attr("id");
					var slide_id = $(event.target).attr("slide_id");
					var marker = _addMarkerToPosition(position,poi_id,slide_id);
				} else {
					//Not in map viewport
					//Trigger revert event...
					$(event.target).animate({ top: 0, left: 0 }, 'slow');
				}
			}
		});

		$(".carrousel_element_single_row_slides").droppable();
	};

	var _restorePois = function(){
		if(!gMlLoaded){
			//Wait for loading GMapsLibrary
			setTimeout(function(){
				_restorePois();
			}, 1000 );
			return;
		}

		if((typeof currentPois === "undefined")&&(trustOrgPois)){
			//We are loading a virtual tour, get the pois from the json
			var presentation = V.Editor.getPresentation();
			if(presentation && presentation.slides && presentation.slides[0] && presentation.slides[0].pois){
				currentPois = presentation.slides[0].pois;
			} else {
				return;
			}
		}

		if(typeof currentPois !== "undefined"){
			$.each(currentPois, function(index, poi) {
				if($("#"+poi.id).length>0){
					_addMarkerToCoordinates(poi.lat,poi.lng,poi.id,poi.slide_id);
				}
			});
		}
	};





	///////////
	// More Utils
	///////////

	/*
	 * Returns the array of pois to be stored in the JSON
	 * Pois are nested!
	 */
	var getPois = function(){
		var pois = [];
		for(var key in markers){
			var marker = markers[key];
			var poi = {};
			poi.lat = marker.position.lat().toString();
			poi.lng = marker.position.lng().toString();
			poi.id = virtualTourId+"_"+marker.poi_id;
			poi.slide_id = virtualTourId+"_"+marker.slide_id;
			pois.push(poi);
		};
		return pois;
	};

	/*
	 * Return the current array of pois, without nesting.
	 * The id matches the id of the DOM element.
	 */
	var _getCurrentPois = function(){
		var pois = [];
		for(var key in markers){
			var marker = markers[key];
			var poi = {};
			poi.lat = marker.position.lat();
			poi.lng = marker.position.lng();
			poi.id = marker.poi_id;
			poi.slide_id = marker.slide_id;
			pois.push(poi);
		};
		return pois;
	};

	var _hasPoiInMap = function(){
		return _getCurrentPois().length>0;
	};

	/*
	 * Carrousel onClick callback
	 */
	var onClickCarrouselElement = function(event){
		switch($(event.target).attr("action")){
			case "plus":
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
			  	V.Editor.Preview.preview({slideNumberToPreview: parseInt($(event.target).attr("slideNumber"))});
			  break;
			default:
			  break;
		}
	 };


	////////////////////
	// Validate
	////////////////////

	/*
	 * OnValidationError: 	Return the id of the form to be show
	 * OnValidationSuccess: Return true
	 */
	var validateOnSave = function(){
		if(!_hasPoiInMap()){
			return "message6_form";
		}
		return true;
	};


	////////////////////
	// JSON Manipulation
	////////////////////

	/*
	 * Used by V.Editor module to save the flashcard in a JSON file
	 */
	var getSlideHeader = function(){
		var slide = {};
		slide.id = virtualTourId;
		slide.type = V.Constant.VTOUR;
		var center = map.getCenter();
		slide.center = { lat: center.lat().toString(), lng: center.lng().toString() };
		slide.zoom = map.getZoom().toString();
		slide.mapType = _getMapType(map);
		slide.width = "100%";
		slide.height = "100%";
		slide.pois = getPois();
		slide.slides = [];
		return slide;
	};

	var _getMapType = function(map){
		if((map)&&(map.mapTypeId)){
			return map.mapTypeId;
		} else {
			return V.Constant.VTour.DEFAULT_MAP;
		}
	};


	return {
		init 						: init,
		getId 						: getId,
		onLoadMode					: onLoadMode,
		onLeaveMode					: onLeaveMode,
		loadSlideset				: loadSlideset,
		redrawPois					: redrawPois,
		getPois						: getPois,
		onClickCarrouselElement 	: onClickCarrouselElement,
		getSlideHeader				: getSlideHeader,
		validateOnSave				: validateOnSave
	};

}) (VISH, jQuery);