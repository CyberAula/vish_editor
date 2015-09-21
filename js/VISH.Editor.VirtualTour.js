VISH.Editor.VirtualTour = (function(V,$,undefined){

	//Internal
	var initialized = false;
	var geocoder;

	//Loading GoogleMaps library asynchronously
	var gMlLoaded = false;

	//Store virtual tour data
	var vts;

	var init = function(){
		if(!initialized){
			vts = {};
			_loadEvents();
			V.Utils.Loader.loadGoogleLibrary("https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&libraries=places",function(){
				geocoder = new google.maps.Geocoder();
				gMlLoaded = true;

				//Notify event
				var el = document;
				var evt = document.createEvent('Event');
				evt.initEvent('googleMapsLibraryLoadedinVE', true, true);
				el.dispatchEvent(evt);
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
		return "<article id='"+slidesetId+"' type='"+V.Constant.VTOUR+"' slidenumber='"+options.slideNumber+"'><div class='delete_slide'></div><img class='help_in_slide help_in_vt' src='"+V.ImagesPath+"vicons/helptutorial_circle_blank.png'/><div class='vt_canvas'></div><div class='vt_search'><input class='vt_search_input' type='text' placeholder='" + V.I18n.getTrans("i.Searchplaces") + "'></input><button class='vt_search_button'><img class='vt_search_button_img' src='"+V.ImagesPath+"icons/gsearch.png'/></button></div></article>";
	};


	var _drawMap = function(vtJSON,vtDOM){
		
		if(!vtJSON){
			//Default values
			vtJSON = {};
			vtJSON.center = {"lat":34,"lng":2};
			vtJSON.zoom = 2;
			vtJSON.mapType = V.Constant.VTour.DEFAULT_MAP;
			vtJSON.pois = [];
		}

		var vtId = $(vtDOM).attr("id");

		if(typeof vts[vtId] == "undefined"){
			vts[vtId] = vtJSON;
			vts[vtId].markers = {};
		}

		if(vts[vtId].drawed === true){
			//Already drawed
			return;
		}

		if(!gMlLoaded){
			//Wait for GMap library to load
			$(document).on('googleMapsLibraryLoadedinVE', function(){
				_drawMap(vtJSON,vtDOM);
			});
			return;
		}

		vts[vtId].drawed = true;
		V.Utils.addTempShown(vtDOM);

		var latlng = new google.maps.LatLng(vtJSON.center.lat, vtJSON.center.lng);
		var myOptions = {
			zoom: parseInt(vtJSON.zoom),
			center: latlng,
			streetViewControl: false,
			mapTypeId: vtJSON.mapType
		};
		var canvas = $(vtDOM).find("div.vt_canvas");
		vts[vtId].map = new google.maps.Map($(canvas)[0], myOptions);
		vts[vtId].overlay = new google.maps.OverlayView();
		vts[vtId].overlay.draw = function() {};
		vts[vtId].overlay.setMap(vts[vtId].map);
		_loadLabel();

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
		var autocomplete = new google.maps.places.Autocomplete(input,options);

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			_onSearchAddress();
		});

		//Map events
		google.maps.event.addListener(vts[vtId].map, 'click', function() {
			$(".vt_search_input").blur();
		});

		google.maps.event.addListenerOnce(vts[vtId].map, 'idle', function(){
			//Add pois
			$(vtJSON.pois).each(function(index,poi){
				_addMarkerToCoordinates(poi.lat,poi.lng,poi.slide_id,index+1,vts[vtId]);
				$(".draggable_sc_div[slide_id='"+poi.slide_id+"']").hide();
			});

			// do something only the first time the map is loaded
			V.Utils.removeTempShown(vtDOM);
		});
	};


	//////////////////
	// LABELS (based on Marc Ridey solution)
	// http://blog.mridey.com/2009/09/label-overlay-example-for-google-maps.html
	/////////////////

	/*
	 * Label Constructor
	 */
	function Label(opt_options){
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
					var map = _getCurrentTour().map;
					map.setCenter(location.address);
					if(location.bounds){
						map.fitBounds(location.bounds);
					} else if(location.viewport){
						map.fitBounds(location.viewport);
					}
					
					$(currentInput).val("");
					$(currentInput).attr("placeholder",V.I18n.getTrans("i.Searchplaces"));
				} else {
					$(currentInput).val("");
					$(currentInput).attr("placeholder",V.I18n.getTrans("i.Noresultsfound"));
				}
			});
		};
	};

	var _getAddressForText = function(addressText,callback){
		geocoder.geocode( { 'address': addressText}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				var addrLocation = results[0].geometry.location;
				var bounds = results[0].geometry.bounds;
				var viewport = results[0].geometry.viewport;
				var location = {
					address: addrLocation,
					bounds: bounds,
					viewport: viewport
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

	var _addMarkerToCoordinates = function(lat,lng,slide_id,slideNumber,vtJSON){
		return _addMarkerToPosition(new google.maps.LatLng(lat,lng),slide_id,slideNumber,vtJSON);
	};

	var _addMarkerToPosition = function(myLatlng,slide_id,slideNumber,vtJSON){
		var vt;
		if(vtJSON){
			vt = vtJSON;
		} else {
			vt = _getCurrentTour();
		}
	
		var map = vt.map;

		// Create label
		var label = new Label({
			map: map
		});

		if(!slideNumber){
			slideNumber = parseInt($(".draggable_sc_div[slide_id='"+slide_id+"']").attr("slidenumber"));
		}
		var	pinImage = _getPinImageForSlideNumber(slideNumber);
		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			draggable: true,
			icon: pinImage,
			slide_id: slide_id,
			title:"("+myLatlng.lat().toFixed(3)+","+myLatlng.lng().toFixed(3)+")"
		});

		//Set label properties
		label.bindTo('position', marker, 'position');
		// In the current version we use a dinamyc image instead of a label to indicate slideNumber
		// label.set('text', slideNumber);

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
		if(typeof vt.markers == "undefined"){
			vt.markers = {};
		}
		vt.markers[slide_id] = marker;

		return marker;
	};

	var _getPinImageForSlideNumber = function(slideNumber){
		var pinText = String.fromCharCode(64+parseInt(slideNumber));
		var	pinImage = new google.maps.MarkerImage("https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld="+pinText+"|FF776B|000000",
		new google.maps.Size(25, 40),
		new google.maps.Point(0,0),
		new google.maps.Point(10, 34));
		return pinImage;
	};

	var _onClick = function(marker){
		// Return the arrow to original position.
		// Arrow is always in background

		// The point in pixels in the map
		var vt = _getCurrentTour();
		var point = vt.overlay.getProjection().fromLatLngToContainerPixel(marker.position);

		var arrow = $(".draggable_sc_div[slide_id='"+marker.slide_id+"']");

		//We need to show the arrow to properly get the offset
		$(arrow).show();

		//1. Move the arrow to the PIN of the map
		var vtDOM = V.Slides.getCurrentSlide();
		var canvas = $(vtDOM).find("div.vt_canvas");
		var xDif = ($(vtDOM).outerWidth() - $(canvas).outerWidth())/2;
		var yDif = ($(vtDOM).outerHeight() - $(canvas).outerHeight())/2;
		var vt_offset = $(vtDOM).offset();
		var top = point.y + vt_offset.top + yDif - 38;
		var left = point.x + vt_offset.left + xDif - 25;


		//2. Decompose top and left, in top,left,margin-top and margin-left
		//This way, top:0 and left:0 will lead to the original position

		//Get the parent (container in scrollbar)
		var parent = $(arrow).parent();
		var parent_offset = $(parent).offset();

		var newMarginTop = parent_offset.top - 20;
		var newMarginLeft = parent_offset.left + 12;
		var newTop = top - newMarginTop;
		var newLeft = left - newMarginLeft;

		$(arrow).css("position", "fixed");
		$(arrow).css("margin-top", newMarginTop+"px");
		$(arrow).css("margin-left", newMarginLeft+"px");
		$(arrow).css("top", newTop+"px");
		$(arrow).css("left", newLeft+"px");

		//3. Return arrow to original position
		$(arrow).animate({ top: 0, left: 0 }, 'slow', function(){
			//Animate complete
			$(arrow).css("position", "absolute");
			//Original margins
			$(arrow).css("margin-top","-20px");
			$(arrow).css("margin-left","12px");
			$(arrow).attr("ddend","scrollbar");
		});

		_removeMarker(marker);
	};

	var _onDoubleClick = function(marker){
	};

	var _removeAllMarkers = function(){
		var markers = _getCurrentTour().markers;
		for(var key in markers){
			_removeMarker(markers[key]);
		}
	};

	var _removeMarker = function(marker){
		marker.setMap(null);
		if(marker.label){
			marker.label.onRemove();
		};

		var markers = _getCurrentTour().markers;
		if(typeof markers[marker.slide_id] !== "undefined"){
			delete markers[marker.slide_id];
		}
	};

	var _isPositionInViewport = function(position) {
		return _getCurrentTour().map.getBounds().contains(position);
	};

	var _getCurrentTour = function(){
		return vts[$(V.Slides.getCurrentSlide()).attr("id")];
	};

	////////////////
	// Slideset Callbacks
	////////////////

	/*
	 * Complete the vt scaffold to draw the virtual tour in the presentation
	 */
	var draw = function(slidesetJSON,scaffoldDOM){
		_drawMap(slidesetJSON,scaffoldDOM);
	};

	var onEnterSlideset = function(vt){
	};

	var onLeaveSlideset = function(vt){
	};

	var loadSlideset = function(vt){
		//Show Arrows
		$("#subslides_list").find("div.draggable_sc_div[ddend='scrollbar']").show();
	};

	var unloadSlideset = function(vt){
	};

	var beforeCreateSlidesetThumbnails = function(vt){
		_drawPois(vt);
	};

	var beforeRemoveSlideset = function(vt){
		var vtId = $(vt).attr("id");
		if(typeof vts[vtId] !== "undefined"){
			delete vts[vtId];
		}
	};

	var beforeRemoveSubslide = function(vt,subslide){
		var subslideId = $(subslide).attr("id");
		var slideNumber = $(subslide).attr("slideNumber");

		//Remove the subslide markers (if exist)
		var markers = _getCurrentTour().markers;
		Object.keys(markers).forEach(function(key){
			var marker = markers[key];
			if(marker.slide_id===subslideId){
				_removeMarker(marker);
			} else {
				//Adjust pinImages of the rest of the markers
				var markerArrow = $(".draggable_sc_div[slide_id='"+marker.slide_id+"']");
				var markerSlideNumber = $(markerArrow).attr("slideNumber");
				if(markerSlideNumber > slideNumber){
					$(markerArrow).attr("slideNumber", markerSlideNumber-1);
					marker.setIcon(_getPinImageForSlideNumber(markerSlideNumber-1));
				}
			}
		});

		// //Adjust pinImages of the rest of markers
		// var rMl = removedMarkers.length;
		// for(var k=0; k<rMl; k++){
		// 	var deletedSlideNumber = removedMarkers[k].slideNumber;
		// 	Object.keys(markers).forEach(function(key){
		// 		var marker = markers[key];
		// 		if(marker.slideNumber > deletedSlideNumber){
		// 			marker.slideNumber = marker.slideNumber-1;
		// 			marker.setIcon(_getPinImageForSlideNumber(marker.slideNumber));
		// 		}
		// 	});
		// }

	};

	/*
	 * Redraw the pois of the virtual tour
	 * This actions must be called after thumbnails have been rewritten
	 */
	var _drawPois = function(vtDOM){
		var vt = _getCurrentTour();
		if(!vt){
			return;
		}
		var markers = vt.markers;
		
		//Create arrows for existing subslides
		var subslides = $(vtDOM).find("article");
		$("#subslides_list").find("div.wrapper_barbutton").each(function(index,div){
			var slide = subslides[index];
			if(slide){
				var slide_id = $(slide).attr("id");
				var arrowDiv = $('<div class="draggable_sc_div" slide_id="'+ slide_id +'" slideNumber="'+(index+1)+'"" >');
				$(arrowDiv).append($('<img src="'+V.ImagesPath+'icons/flashcard_button.png" class="fc_draggable_arrow">'));
				$(arrowDiv).append($('<p class="draggable_number"  data-tooltip="Drag me to the map">'+String.fromCharCode(64+index+1)+'</p>'));
				$(div).prepend(arrowDiv);

				if(typeof markers[slide_id] != "undefined"){
					$(arrowDiv).hide();
				}
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

				var canvas = $(vtDOM).find("div.vt_canvas");
				var xDif = ($(vtDOM).outerWidth() - $(canvas).outerWidth())/2;
				var yDif = ($(vtDOM).outerHeight() - $(canvas).outerHeight())/2;
				var vt_offset = $(vtDOM).offset();
				var poi_offset = $(event.target).offset();

				//Compensate margins and adjust to put marker in map
				var myX = poi_offset.left-vt_offset.left-xDif+25;
				var myY = poi_offset.top-vt_offset.top-yDif+34;

				var point = new google.maps.Point(myX,myY);
				var position = _getCurrentTour().overlay.getProjection().fromContainerPixelToLatLng(point);
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

					var slide_id = $(event.target).attr("slide_id");
					_addMarkerToPosition(position,slide_id);
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


	var getThumbnailURL = function(vt){
		return (V.ImagesPath + "templatesthumbs/tVTour.png");
	};


	////////////////////
	// JSON Manipulation
	////////////////////

	/*
	 * Used by VISH.Editor module to save the virtual tour in the JSON
	 */
	var getSlideHeader = function(vtDOM){
		var vtId = $(vtDOM).attr('id');
		var vt = vts[vtId];

		var slide = {};
		slide.id = vtId;
		slide.type = V.Constant.VTOUR;
		slide.map_service = V.Constant.VTour.SERVICES.GMaps;

		var center = vt.map.getCenter();
		slide.center = { lat: center.lat().toString(), lng: center.lng().toString() };
		slide.zoom = vt.map.getZoom().toString();
		slide.mapType = _getMapType(vt.map);
		slide.width = "100%";
		slide.height = "100%";

		//Get pois
		var pois = [];
		for(var key in vt.markers){
			var marker = vt.markers[key];
			var poi = {};
			poi.lat = marker.position.lat().toString();
			poi.lng = marker.position.lng().toString();
			poi.slide_id = marker.slide_id;
			pois.push(poi);
		};
		slide.pois = pois;

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


	/////////////////
	// Clipboard
	/////////////////
	var preCopyActions = function(vtJSON,vtDOM){
	};

	var postCopyActions = function(vtJSON,vtDOM){
	};


	return {
		init 				 			: init,
		getDummy						: getDummy,
		draw 							: draw,
		onEnterSlideset					: onEnterSlideset,
		onLeaveSlideset					: onLeaveSlideset,
		loadSlideset					: loadSlideset,
		unloadSlideset					: unloadSlideset,
		beforeCreateSlidesetThumbnails	: beforeCreateSlidesetThumbnails,
		beforeRemoveSlideset			: beforeRemoveSlideset,
		beforeRemoveSubslide			: beforeRemoveSubslide,
		getSlideHeader					: getSlideHeader,
		getThumbnailURL					: getThumbnailURL,
		preCopyActions					: preCopyActions,
		postCopyActions					: postCopyActions
	};

}) (VISH, jQuery);