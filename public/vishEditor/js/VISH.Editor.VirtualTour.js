VISH.Editor.VirtualTour = (function(V,$,undefined){

	//Internal
	var initialized = false;

	//Loading GoogleMaps library asynchronously
	var gMlLoaded = false;

	//Point to the current markers
	var markers;

	//Deprecated
	var overlay;


	var init = function(){
		if(!initialized){
			_loadEvents();
			V.Utils.Loader.loadGoogleLibrary("https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&libraries=places",function(){
				gMlLoaded = true;
			});
			initialized = true;
		}
	};

	var _loadEvents = function(){
		$(document).on('keydown','input.vt_search_input', function(event){
			if(event.keyCode === 13){
				event.preventDefault();
				//_onSearchAddress launched by the autocomplete 'place_changed' event
				// _onSearchAddress();
			}
		});
		$(document).on('click','button.vt_search_button', function(event){
			event.preventDefault();
			_onSearchAddress();
		});
	};

	var getDummy = function(slidesetId,options){
		return "<article id='"+slidesetId+"' type='"+V.Constant.VTOUR+"' slidenumber='"+options.slideNumber+"'><div class='delete_slide'></div><img class='help_in_slide help_in_vt' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div class='vt_canvas'></div><div class='vt_search'><input class='vt_search_input' type='text' placeholder='Search places'></input><button class='vt_search_button'><img class='vt_search_button_img' src='/vishEditor/images/vtour/gsearch.png'/></button></div></article>";
	};


	var _loadMap = function(vtDOM){
		if(!gMlLoaded){
			return;
		}

		//Get vt data in JSON
		var vt = undefined;
		
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
		var canvas = $(vtDOM).find("div.vt_canvas");
		map = new google.maps.Map($(canvas)[0], myOptions);
		overlay = new google.maps.OverlayView();
		overlay.draw = function() {};
		overlay.setMap(map);
		_loadLabel();

		//Load geocoder
		geocoder = new google.maps.Geocoder();

		//Autocomplete
		var input = $(vtDOM).find("input.vt_search_input")[0];
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
			$(".vt_search_input").blur();
		});

	}


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
		var currentVT = V.Slides.getCurrentSlide();
		var currentInput = $(currentVT).find("input.vt_search_input");
		var text = $(currentInput).val();
		if((typeof text == "string")&&(text!="")){
			_getAddressForText(text,function(location){
				if(location){
					map.setCenter(location.address);
					map.fitBounds(location.bounds);
					$(currentInput).val("");
					$(currentInput).attr("placeholder","Search places");
				} else {
					$(currentInput).val("");
					$(currentInput).attr("placeholder","No results");
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


	///////////////////
	/// MAP Utils
	//////////////////

	var _addMarkerToCoordinates = function(lat,lng,poi_id,slide_id,slideNumber){
		return _addMarkerToPosition(new google.maps.LatLng(lat,lng),poi_id,slide_id,slideNumber);
	}

	var _addMarkerToPosition = function(myLatlng,poi_id,slide_id,slideNumber){
		// Create label
		var label = new Label({
			map: map
		});

		var pinText = String.fromCharCode(64+parseInt(slideNumber));
		var	pinImage = new google.maps.MarkerImage("https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld="+pinText+"|FF776B|000000",
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

	////////////////
	// Slideset Callbacks
	////////////////

	/*
	 * Complete the vt scaffold to draw the virtual tour in the presentation
	 */
	var draw = function(slidesetJSON,scaffoldDOM){
		
	};

	var onEnterSlideset = function(vt){
		markers = [];
		_loadMap(vt);
	};

	var onLeaveSlideset = function(vt){
		markers = [];
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
		var POIdata = [];

		//Draw POIS
		_drawPois(vt,POIdata);
	}

	/*
	 * Redraw the pois of the virtual tour
	 * This actions must be called after thumbnails have been rewritten
	 */
	var _drawPois = function(vt,POIdata){
		var pois = {};

		//Index pois based on slide_id
		for(var i=0; i<POIdata.length; i++){
			var myPoi = POIdata[i];
			//Create new POI
			pois[myPoi.slide_id] = {};
			pois[myPoi.slide_id].id = myPoi.id;
			pois[myPoi.slide_id].slide_id = myPoi.slide_id;
		};

		var subslides = $(vt).find("article");

		$("#subslides_list").find("div.wrapper_barbutton").each(function(index,div){
			var slide = subslides[index];
			if(slide){
				var slide_id = $(slide).attr("id");
				var poi_id = $(vt).attr("id") + "_poi" + (index+1);
				var arrowDiv = $('<div class="draggable_sc_div" slide_id="'+ slide_id +'" poi_id="'+ poi_id +'" slideNumber="'+(index+1)+'"" >');
				$(arrowDiv).append($('<img src="'+V.ImagesPath+'flashcard/flashcard_button.png" class="fc_draggable_arrow">'));
				$(arrowDiv).append($('<p class="draggable_number">'+String.fromCharCode(64+index+1)+'</p>'));
				$(div).prepend(arrowDiv);

				var poi = pois[slide_id];
				if(poi){
					//Do something
				};
			};
		});

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
				//Chek if poi is inside map

				var canvas = $(vt).find("div.vt_canvas");
				var xDif = ($(vt).outerWidth() - $(canvas).outerWidth())/2;
				var yDif = ($(vt).outerHeight() - $(canvas).outerHeight())/2;
				var vt_offset = $(vt).offset();
				var poi_offset = $(event.target).offset();

				//Compensate margins and adjust to put marker in map
				var myX = poi_offset.left-vt_offset.left-xDif+25;
				var myY = poi_offset.top-vt_offset.top-yDif+34;

				var point = new google.maps.Point(myX,myY);
				var position = overlay.getProjection().fromContainerPixelToLatLng(point);
				var insideMap = _isPositionInViewport(position);

				//Check that the vtour is showed at the current moment
				insideMap = (insideMap && V.Editor.Slideset.getCurrentSubslide()==null);

				if(insideMap){
					$(event.target).attr("ddend","background");

					//Drop inside background from scrollbar
					//Transform margins to top and left
					var newTop = $(event.target).cssNumber("margin-top") +  $(event.target).cssNumber("top");
					var newLeft = $(event.target).cssNumber("margin-left") +  $(event.target).cssNumber("left");
					$(event.target).css("margin-top", "0px");
					$(event.target).css("margin-left", "0px");
					$(event.target).css("top", newTop+"px");
					$(event.target).css("left", newLeft+"px");

					var poi_id = $(event.target).attr("id");
					var slide_id = $(event.target).attr("slide_id");
					var slideNumber = $(event.target).attr("slideNumber");
					var marker = _addMarkerToPosition(position,poi_id,slide_id,slideNumber);
					$(event.target).hide();

				} else {
					//Drop outside background (always from scrollbar in virtual tours)
					//Return to original position
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