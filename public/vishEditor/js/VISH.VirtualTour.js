VISH.VirtualTour = (function(V,$,undefined){

  var virtualTours;
  // myVT = virtualTours['virtualTourId']
  // myVT.map
  // myVT.canvasId
  // myVT.center
  // myVT.pois
  // myVT.paths

  //Loading GoogleMaps library asynchronously
  var gMlLoaded = false;
  var gMlLoading = false;

  //Keep last increase param to manage resizing
  var lastIncrease;

  //Load maps queue 
  var _loadQueue;

  var init = function(presentation){
    virtualTours = new Array();
    _loadQueue = [];
  };

 /*
  * Vt is a JSON slide of VirtualTour type
  */
  var drawMap = function(vt){
    if(!gMlLoaded){
      if(gMlLoading){
        //wait for loading
        setTimeout(function(){
          drawMap(vt);
        },1000);
        return;
      }
      gMlLoading = true;
      V.Utils.Loader.loadGoogleLibrary("https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&libraries=places",function(){
        gMlLoaded = true;
        gMlLoading = false;
        drawMap(vt);
      });
      return;
    }

    //VT must be a slide of Virtual tour type
    if(vt.type!==V.Constant.VTOUR){
      return;
    }

    if(typeof virtualTours[vt.id] != "undefined"){
      //Already drawed
      return;
    }

    //Include canvas
    var canvas_id = V.Utils.getId(vt.id + "_canvas");
    var canvas =  $("<div id='"+canvas_id+"' class='map_canvas' style='height:"+"100%"+"; width:"+"100%"+"'></div>");
    $("#"+vt.id).append(canvas);

    var latlng = new google.maps.LatLng(vt.center.lat, vt.center.lng);
    if(typeof virtualTours[vt.id] == "undefined"){
      virtualTours[vt.id] = new Object();
      virtualTours[vt.id].id = vt.id
      virtualTours[vt.id].canvasId = canvas_id;
      virtualTours[vt.id].center = latlng;
      virtualTours[vt.id].zoom = parseInt(vt.zoom);
      virtualTours[vt.id].mapType = vt.mapType;
      virtualTours[vt.id].pois = new Array();
      virtualTours[vt.id].orgPois = vt.pois;
      virtualTours[vt.id].paths = [];
    }

    var lqL = _loadQueue.length;
    for(var i=0; i<lqL; i++){
      if(_loadQueue[i]===vt.id){
        loadMap(vt.id);
        _loadQueue.splice(_loadQueue.indexOf(vt.id),1);
      }
    }
  }

  var loadMap = function(vtId){
    //vt is a JSON object representing a Virtual Tour
    //is different in comparison with the JSON slide 
    var vt = virtualTours[vtId];

    if(typeof vt == "undefined"){
      //vt not drawed
      //wait for drawing...
      _loadQueue.push(vtId);
      return;
    }

    if(typeof vt.map != "undefined"){
      //vt already loaded
      return;
    }

    $("#"+vt.id).addClass("temp_shown");

    var canvasId = vt.canvasId;
    var myOptions = {
      zoom: vt.zoom,
      center: vt.center,
      mapTypeId: vt.mapType
    };

    var map = new google.maps.Map(document.getElementById(canvasId), myOptions);
    vt.map = map;

    $(vt.orgPois).each(function(index,poi){
      vt.pois[poi.id] = poi;
      _addMarkerToCoordinates(vt,poi.lat,poi.lng,poi.id);
    });

    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
      //this part runs when the mapobject is created and rendered
      $("#"+vtId).removeClass("temp_shown");
      google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
          //this part runs when the mapobject shown for the first time
      });
    });

    google.maps.event.addDomListener(map, 'idle', function() {
    });
    google.maps.event.addDomListener(window, 'resize', function() {
    });
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
    loadMap         : loadMap,
    aftersetupSize  : aftersetupSize,
    getVirtualTours : getVirtualTours
  };

}) (VISH, jQuery);