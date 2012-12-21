VISH.VirtualTour = (function(V,$,undefined){

  var virtualTours;
  // myVT = virtualTours['virtualTourId']
  // myVT.map
  // myVT.pois
  // myVT.paths


  var init = function(presentation){
    virtualTours = new Array();
  };

  var drawMap = function(vt){
    //VT must be a slide of Virtual tour type
    if(!vt.type===VISH.Constant.VTOUR){
      return;
    }

    V.Debugging.log("drawMap : " +JSON.stringify(vt));

    //Include canvas
    var canvas_id = "canvas_" + vt.id;
    var canvas =  $("<div id='"+canvas_id+"' class='map_canvas' style='height:"+"100%"+"; width:"+"100%"+"'></div>");
    $("#"+vt.id).append(canvas);

    var latlng = new google.maps.LatLng(vt.center.lat, vt.center.lng);
    var myOptions = {
      zoom: vt.zoom,
      center: latlng,
      mapTypeId: vt.mapType
    };

    if(typeof virtualTours[vt.id] === "undefined"){
      virtualTours[vt.id] = new Object();
      virtualTours[vt.id].pois = new Array();
      virtualTours[vt.id].paths = [];
    }

    virtualTours[vt.id].map = new google.maps.Map(document.getElementById(canvas_id), myOptions);

    $(vt.pois).each(function(index,poi){
      virtualTours[vt.id].pois[poi.id] = poi;
      addMarkerToCoordinates(vt,poi.lat,poi.lng,poi.id);
    });
  }

  var addMarkerToCoordinates = function(vt,lat,lng,poi_id){
    return addMarkerToPosition(vt,new google.maps.LatLng(lat,lng),poi_id);
  }

  var addMarkerToPosition = function(vt,myLatlng,poi_id){
    var marker = new google.maps.Marker({
      position: myLatlng, 
      map: virtualTours[vt.id].map,
      draggable: false,
      poi_id: poi_id,
      title:"("+myLatlng.lat()+","+myLatlng.lng()+")"
    });

    google.maps.event.addListener(marker, 'click', function(event) {
      var poi = getPoi(vt,marker.poi_id);
      V.Slides.showFlashcardSlide(poi.slide_id,true);
    });

    return marker;
  }

  var getPoi = function(vt,poiId){
    if((typeof virtualTours[vt.id] !== "undefined")&&(typeof virtualTours[vt.id].pois[poiId] !== "undefined")){
      return virtualTours[vt.id].pois[poiId];
    }
  }

	return {
		init		      : init,
    drawMap       : drawMap
	};

}) (VISH, jQuery);