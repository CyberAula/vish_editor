VISH.Editor.Tools = (function(V,$,undefined){
	
	var init = function(){
	   //Add listeners to toolbar buttons
	   $.each($("img.toolbar_icon"), function(index, toolbarButton) {
				$(toolbarButton).on("click", function(event){
					if(typeof VISH.Editor.Tools[$(toolbarButton).attr("action")] == "function"){
						VISH.Editor.Tools[$(toolbarButton).attr("action")]();
					}
        });
     });
	} 
	 
	var loadZoneTools = function(zone){
		
		cleanZoneTools();
		
		var zoneType = $(zone).attr("type");
		
    if(!zoneType){
			//Add menuselect button
			$(zone).find(".menuselect_hide").show();
			return;
		}
		
		//Add delete content button
    $(zone).find(".delete_content").show();

		switch(zoneType){
			case "text":  
         $(".nicEdit-panel").show();
				 break;
      case "image":
        _showSlider($(zone).find("img").attr("id"));
        break;
      case "video":
        _showSlider($(zone).find("video").attr("id"));
        break;
			case "object":
			  _showSlider($(zone).find(".object_wrapper").attr("id"));
			  var object = $(zone).find(".object_wrapper").children()[0];
        loadToolbarForObject(object);
        break;
			case "snapshot":
        _showSlider($(zone).find(".snapshot_wrapper").attr("id"));
				_loadToolbar("snapshot");
        break;
      default:
        break;
    }

  };
	
	
	 var cleanZoneTools = function(){
    $(".menuselect_hide").hide();
    $(".delete_content").hide();
    $(".theslider").hide();
    _cleanToolbars();
  }
	
	var _cleanToolbars = function(){
		//NiceEditor Toolbar
    $(".nicEdit-panel").hide();
		//Generic Toolbars
		$(".toolbar_wrapper").hide();
	}
	
	
	var loadToolbarForObject = function(object){
		 var objectInfo = VISH.Editor.Object.getObjectInfo(object);
        
      switch(objectInfo.type){
        case "web":
          _loadToolbar(objectInfo.type);
          break;
        default:
          _loadToolbar("object");
          //object default toolbar
        break;
      }
	}
	
	var _loadToolbar = function(type){
		if(type=="text"){
			$(".toolbar_wrapper").hide();
			$(".nicEdit-panel").show();
			return;
		}
		$(".nicEdit-panel").hide();
		
		//Generic toolbars
		var toolbarClass = "toolbar_" + type;
    $(".toolbar_wrapper").show();
    $(".toolbar_wrapper").find("img").hide();
    $(".toolbar_wrapper").find("img." + toolbarClass).show();
	}
	
	
	var _showSlider = function(id){
		if(id){
      id = id.substring(9);
      $("#sliderId" + id).show(); 
    }
	}
	
	
	
	var zoomMore = function(){
    _changeZoom("+");
	}
	
	 var zoomLess = function(){
    _changeZoom("-");
  }
	
	var _changeZoom = function(action){
    var area = VISH.Editor.getCurrentArea();
    var type = $(area).attr("type");    
    switch(type){
      case "object":
        var object = area.children()[0].children[0];
        var objectInfo = VISH.Editor.Object.getObjectInfo(object);
        if(objectInfo.type==="web"){
          var iframe = $(area).find("iframe");
          var zoom = VISH.Utils.getZoomFromStyle($(iframe).attr("style"));
					if(action=="+"){
						zoom = zoom + 0.1;
					} else {
						zoom = zoom - 0.1;
					}
          $(iframe).attr("style",VISH.Utils.addZoomToStyle($(iframe).attr("style"),zoom));
					
					//Resize object to fix in its wrapper
					VISH.Editor.Object.autofixWrapperedObjectAfterZoom(iframe,zoom);
        }
        break;
      case "snapshot":
        break;
      default:
        break;
    }
	}
	 
  
	return {
		init              : init,
		loadZoneTools  : loadZoneTools,
		cleanZoneTools : cleanZoneTools,
		loadToolbarForObject : loadToolbarForObject,
		zoomMore : zoomMore,
		zoomLess : zoomLess
	};

}) (VISH, jQuery);