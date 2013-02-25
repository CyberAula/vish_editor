VISH.VirtualTour = (function(V,$,undefined){

  var virtualTours;
  // myVT = virtualTours['virtualTourId']
  // myVT.map
  // myVT.canvasId
  // myVT.center
  // myVT.pois
  // myVT.paths

  //Keep last increase param to manage resizing
  var lastIncrease;

  var init = function(presentation){
    virtualTours = new Array();
  };

 /*
  * Vt is a slide of VirtualTour type
  */
  var drawMap = function(vt){
    //VT must be a slide of Virtual tour type
    if(vt.type!==V.Constant.VTOUR){
      return;
    }

    //Include canvas
    var canvas_id = V.Utils.getId(vt.id + "_canvas");
    var canvas =  $("<div id='"+canvas_id+"' class='map_canvas' style='height:"+"100%"+"; width:"+"100%"+"'></div>");
    $("#"+vt.id).append(canvas);

    var latlng = new google.maps.LatLng(vt.center.lat, vt.center.lng);
    var myOptions = {
      zoom: parseInt(vt.zoom),
      center: latlng,
      mapTypeId: vt.mapType
    };

    if(typeof virtualTours[vt.id] === "undefined"){
      virtualTours[vt.id] = new Object();
      virtualTours[vt.id].canvasId = canvas_id;
      virtualTours[vt.id].center = latlng;
      virtualTours[vt.id].pois = new Array();
      virtualTours[vt.id].paths = [];
    }

    var map = new google.maps.Map(document.getElementById(canvas_id), myOptions);
    virtualTours[vt.id].map = map;

    $(vt.pois).each(function(index,poi){
      virtualTours[vt.id].pois[poi.id] = poi;
      _addMarkerToCoordinates(vt,poi.lat,poi.lng,poi.id);
    });

    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
      //this part runs when the mapobject is created and rendered
      google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
          //this part runs when the mapobject shown for the first time
      });
    });

    // google.maps.event.addDomListener(map, 'idle', function() {
    // });
    // google.maps.event.addDomListener(window, 'resize', function() {
    // });

  }

  var _addMarkerToCoordinates = function(vt,lat,lng,poi_id){
    return _addMarkerToPosition(vt,new google.maps.LatLng(lat,lng),poi_id);
  }

  var _addMarkerToPosition = function(vt,myLatlng,poi_id){
    var marker = new google.maps.Marker({
      position: myLatlng, 
      map: virtualTours[vt.id].map,
      draggable: false,
      poi_id: poi_id,
      title:"("+myLatlng.lat().toFixed(3)+","+myLatlng.lng().toFixed(3)+")"
    });

    google.maps.event.addListener(marker, 'click', function(event) {
      var poi = _getPoi(vt,marker.poi_id);
      V.Slides.openSubslide(poi.slide_id,true);
    });

    return marker;
  }

  var _getPoi = function(vt,poiId){
    if((typeof virtualTours[vt.id] !== "undefined")&&(typeof virtualTours[vt.id].pois[poiId] !== "undefined")){
      return virtualTours[vt.id].pois[poiId];
    }
  }

  var aftersetupSize = function(increase){
    // if(typeof lastIncrease == "undefined"){
    //   lastIncrease = increase;
    //   return;
    // }
    
    // var increaseDiff = increase - lastIncrease;

    // for(key in virtualTours){
    //   var vt = virtualTours[key];
    //   var newZoom = _getZoomForIncreaseDiff(vt.map.zoom,increaseDiff);
    //   if(newZoom !== vt.map.zoom){
    //     vt.map.setZoom(newZoom);
    //     lastIncrease = increase;
    //   }
    // }
  }

  var _getZoomForIncreaseDiff = function(zoom, increaseDiff){
    //+-1 zoom for each 30%
    var absIncreaseDiff = Math.floor(Math.abs(increaseDiff)/0.3);

    if(increaseDiff > 0){
      var newZoom = zoom + absIncreaseDiff;
    } else {
      var newZoom = zoom - absIncreaseDiff;
    }
    //Zoom always between 1 and 20
    return Math.max(Math.min(newZoom,20),1);
  }

 /*
  * For testing purposes
  */
  var getVirtualTours = function(){
    return virtualTours;
  }

  return {
    init		        : init,
    drawMap         : drawMap,
    aftersetupSize  : aftersetupSize,
    getVirtualTours : getVirtualTours
  };

}) (VISH, jQuery);