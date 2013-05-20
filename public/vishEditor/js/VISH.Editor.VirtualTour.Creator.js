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


	var init = function(){
		if(initialized){
			return;
		}
		virtualTourId = null;
		markers = {};
		canvas = $("#vt_canvas");
		clickTimer = null;
		single_click = false;
		_loadVTourCreatorEvents();

		initialized = true;
	};

	var _loadVTourCreatorEvents = function(){
		$("#vt_search_input").on('keydown', function(event){
			switch (event.keyCode) {
				case 13: //Enter
					event.preventDefault();
					//_onSearchAddress launched by the autocomplete 'place_changed' event
					// _onSearchAddress();
					break;	
				default:
					break;
			};
		}); 
		$("#vt_search_button").on('click', function(event){
			event.preventDefault();
			_onSearchAddress();
		});
	};

	var getId = function(){
		return virtualTourId;
	};

	/*
	 * Switch to Virtual Tour creator in order to allow the creation of a 
	 * new virtual tour using the current slides
	 */
	var onLoadMode = function(){
		loadSlideset();
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
	var loadSlideset = function(presentation){
		var virtualTour;

		V.Editor.setPresentationType(V.Constant.VTOUR);
		
		V.Editor.Slides.hideSlides();

		//Show background
		$("#vtour-background").show();

		if(presentation){
			//If we are editing an existing vt
			virtualTour = presentation.slides[0];
			virtualTourId = virtualTour.id;
			$("#vtour-background").attr("VirtualTour_id", virtualTourId);
			//When we load a virtual tour, we can trust in the json pois
			//Otherwise, this pois may be belong to another slideset (e.g flashcard)
			trustOrgPois = true;
		} else {
			//Create new vt
			if(!virtualTourId){
				virtualTourId = V.Utils.getId("article");
			}
			$("#vtour-background").attr("VirtualTour_id", virtualTourId);
		}

		//Prevent multiple maps creation
		if(typeof map == "undefined"){
			_loadMap(virtualTour);
		} else {
			//Reset markers
			_removeAllMarkers();
		}
	};

	var _loadMap = function(vt){
		if(!gMlLoaded){
			V.Utils.Loader.loadGoogleLibrary("https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&libraries=places",function(){
				gMlLoaded = true;
				_loadMap(vt);
			});
			return;
		}
		
		if(!vt){
			//Default values
			vt = {};
			vt.center = {"lat":34,"lng":2};
			vt.zoom = 2;
			vt.mapType = V.Constant.VTour.DEFAULT_MAP;
		}

		var latlng = new google.maps.LatLng(vt.center.lat, vt.center.lng);
		var myOptions = {
			zoom: parseInt(vt.zoom),
			center: latlng,
			streetViewControl: false,
			mapTypeId: vt.mapType
		};
		map = new google.maps.Map($(canvas)[0], myOptions);
		overlay = new google.maps.OverlayView();
		overlay.draw = function() {};
		overlay.setMap(map);
		_loadLabel();

		//Load geocoder
		geocoder = new google.maps.Geocoder();

		//Autocomplete
		var input = document.getElementById('vt_search_input');
		var options = {
			//Four types are supported: 
			// 'establishment' for businesses, 
			// 'geocode' for addresses, 
			// '(regions)' for administrative regions 
			// and '(cities)' for localities. If nothing is specified, all types are returned.
			// types: ["geocode"]
		};

		autocomplete = new google.maps.places.Autocomplete(input,options);

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			_onSearchAddress();
		});

		//Map events
		google.maps.event.addListener(map, 'click', function() {
			$("#vt_search_input").blur();
		});

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


	///////////////////
	/// MAP Utils
	//////////////////

	var _addMarkerToCoordinates = function(lat,lng,poi_id,slide_id){
		return _addMarkerToPosition(new google.maps.LatLng(lat,lng),poi_id,slide_id);
	}

	var _addMarkerToPosition = function(myLatlng,poi_id,slide_id){
		// Create label
		var label = new Label({
			map: map
		});

		var slideNumber;
		var slideNumberPattern = /([0-9]+)/g;
		var regexResult = slideNumberPattern.exec(poi_id);
		if((regexResult!==null)&&(regexResult[0])){
			slideNumber = regexResult[0];
		}

		var	pinImage = new google.maps.MarkerImage("https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld="+slideNumber+"|FF776B|000000",
        new google.maps.Size(25, 40),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));

		var marker = new google.maps.Marker({
			position: myLatlng, 
			map: map,
			draggable: true,
			icon: pinImage,
			poi_id: poi_id,
			slide_id: slide_id,
			label : label,
			title:"("+myLatlng.lat().toFixed(3)+","+myLatlng.lng().toFixed(3)+")"
		});

		//Set label properties
		if(slideNumber){
			label.bindTo('position', marker, 'position');
			// In the current version we use a dinamyc image instead of a label to indicate slideNumber
			// label.set('text', slideNumber);
		}

		google.maps.event.addListener(marker, 'click', function(event) {
			// Allow doble click event

			// if(single_click){
			// 	return;
			// }
			// single_click = true;
			// click_timer = setTimeout(function(){
			// 	single_click = false;
			// 	_onClick(marker);
			// }, 200);

			_onClick(marker);
		});

		// google.maps.event.addListener(marker, 'dblclick', function(event) {
		// 	if(!single_click){
		// 		return;
		// 	}
		// 	clearTimeout(click_timer);
		// 	single_click = false;
		// 	_onDoubleClick(marker);
		// });

		//Hide the poi arrow after add the marker
		$("#"+poi_id).hide();

		//Store the marker
		markers[poi_id] = marker;

		return marker;
	};

	var _onClick = function(marker){
		var point = overlay.getProjection().fromLatLngToContainerPixel(marker.position);

		var arrow = $("#"+marker.poi_id);

		//We need to show the arrow to properly get the offset
		$(arrow).show();

		//Current Left Offset
		var currentLeftOffset = $(arrow).offset().left;
		//Calculate original offset
		$(arrow).css('left',0);
		var originalLeftOffset = $(arrow).offset().left;
		
		var top = point.y - 650;
		var left = point.x  - originalLeftOffset + 25;
		$(arrow).css('top',top);
		$(arrow).css('left',left);

		$("#"+marker.poi_id).animate({ top: 0, left: 0 }, 'slow');
		_removeMarker(marker);
	};

	var _onDoubleClick = function(marker){
	};

	var _removeAllMarkers = function(){
		for(var key in markers){
			_removeMarker(markers[key]);
		}
	};

	var _removeMarker = function(marker){
		marker.setMap(null);
		if(marker.label){
			marker.label.onRemove();
		};
		if(typeof markers[marker.poi_id] !== "undefined"){
			delete markers[marker.poi_id];
		}
	};

	var _isPositionInViewport = function(position) {
		return map.getBounds().contains(position);
	};


	//////////////////
	// LABELS (based on Marc Ridey solution)
	// http://blog.mridey.com/2009/09/label-overlay-example-for-google-maps.html
	/////////////////

	/*
	 * Label Constructor
	 */
	function Label(opt_options) {
		// Initialization
		this.setValues(opt_options);

		// Label specific
		var span = this.span_ = document.createElement('span');
		$(span).addClass("poi_label");
		// span.id = "testingLabels";

		var div = this.div_ = document.createElement('div');
		$(div).addClass("poi_label_container");
		div.appendChild(span);
	};

	/*
	 * Label Init
	 */
	var labelsInit = false;

	function _loadLabel(){
		if(labelsInit){
			return;
		}

		Label.prototype = new google.maps.OverlayView;

		Label.prototype.onAdd = function() {
			var pane = this.getPanes().overlayImage;
			pane.appendChild(this.div_);

			// Ensures the label is redrawn if the text or position is changed.
			var me = this;
			this.listeners_ = [
				google.maps.event.addListener(this, 'position_changed',
					function() { me.draw(); }),
				google.maps.event.addListener(this, 'text_changed',
					function() { me.draw(); })
			];
		};

		Label.prototype.onRemove = function() {
			this.div_.parentNode.removeChild(this.div_);

			// Label is removed from the map, stop updating its position/text.
			for (var i = 0, I = this.listeners_.length; i < I; ++i) {
				google.maps.event.removeListener(this.listeners_[i]);
			}
		};

		Label.prototype.draw = function() {
			var projection = this.getProjection();
			var position = projection.fromLatLngToDivPixel(this.get('position'));

			var div = this.div_;
			div.style.left = position.x + 'px';
			div.style.top = position.y + 'px';
			div.style.display = 'block';
			div.style.zIndex = "2000";

			if(typeof this.get('text') != "undefined"){
				this.span_.innerHTML = this.get('text').toString();
			}
		};

		labelsInit = true;
	};


	///////////
	// Find Addresses
	///////////

	var _onSearchAddress = function(){
		var text = $("#vt_search_input").val();
		if((typeof text == "string")&&(text!="")){
			_getAddressForText(text,function(location){
				if(location){
					map.setCenter(location.address);
					map.fitBounds(location.bounds);
					$("#vt_search_input").val("");
					$("#vt_search_input").attr("placeholder","Search places");
				} else {
					$("#vt_search_input").val("");
					$("#vt_search_input").attr("placeholder","No results");
				}
			});
		};
	};

	var _getAddressForText = function(addressText,callback) {
		geocoder.geocode( { 'address': addressText}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				var addrLocation = results[0].geometry.location;
				var bounds = results[0].geometry.bounds;
				var location = {
					address: addrLocation,
					bounds: bounds
				};
				if(typeof callback === "function"){
					callback(location);
				}
			} else {
				// V.Debugging.log('Geocode was not successful for the following reason: ' + status);
				if(typeof callback === "function"){
					callback(null);
				}
			}
		});
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
			  	V.Editor.Preview.preview({forcePresentation: true, slideNumberToPreview: parseInt($(event.target).attr("slideNumber"))});
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