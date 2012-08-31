VISH.Editor.Tools = (function(V,$,undefined){
	
	/*
	 * Toolbar is divided in three zones.
	 * 1) Presentation toolbar
	 * 2) Slide toolbar
	 * 3) Element toolbar
	 */


	var init = function(){

		cleanZoneTools();
		cleanToolbar();

		//Add listeners to toolbar buttons
		$.each($("img.toolbar_icon"), function(index, toolbarButton) {
			$(toolbarButton).on("click", function(event){
				if(typeof VISH.Editor.Tools[$(toolbarButton).attr("action")] == "function"){
					VISH.Editor.Tools[$(toolbarButton).attr("action")](this);
				}
			});
		});

		loadPresentationToolbar();
		loadSlidesToolbar();
	} 
	 


   /*
	* Tools
	*/

	var loadToolsForZone = function(zone){
		cleanZoneTools();

		var type = $(zone).attr("type");

		switch(type){
			case "text":  
				loadToolbarForElement(type);
				break;
			case "image":
				_showSlider($(zone).find("img").attr("id"));
				loadToolbarForElement(type);
				break;
			case "video":
				_showSlider($(zone).find("video").attr("id"));
				loadToolbarForElement(type);
				break;
			case "object":
				_showSlider($(zone).find(".object_wrapper").attr("id"));
				var object = $(zone).find(".object_wrapper").children()[0];
				loadToolbarForObject(object);
				break;
			case "snapshot":
				_showSlider($(zone).find(".snapshot_wrapper").attr("id"));
				loadToolbarForElement("snapshot");
				break;
			case undefined:

				//Add menuselect button
				$(zone).find(".menuselect_hide").show();
				return;
			default:
				break;
		}

		//Add delete content button
		$(zone).find(".delete_content").show();
	};


	var cleanZoneTools = function(zone){
		$(".menuselect_hide").hide();
		$(".delete_content").hide();
		$(".theslider").hide();
		_cleanElementToolbar();
	}

	var cleanToolbar = function(){
		_cleanPresentationToolbar();
		_cleanSlideToolbar();
		_cleanElementToolbar();
	}

	var enableToolbar = function(){
		$("#toolbar_wrapper").show();
	}

	var disableToolbar = function(){
		$("#toolbar_wrapper").hide();
	}


   /*
	* Presentation Toolbar
	*/

	var loadPresentationToolbar = function(){
		//All buttons of presentation toolbar are always visible unless the following cases:
		// * Presentation that contain inside flascards or games

		var presentation = VISH.Editor.getExcursion();

		if(!presentation){
			//Case: New presentation
			$("#toolbar_presentation").find("img").show();
			//Select presentation as default option
			//Code here [...]
			return;
		}

		switch(presentation.type){
			case "presentation":
				$("#toolbar_presentation").find("img").show();
				break;
			case "flashcard":
				$("#toolbar_presentation").find("img").show();
				break;
			case "game":
				$("#toolbar_presentation").find("img").show();
				break;
			case "quiz_simple":
				//Toolbar has no sense here...
				disableToolbar();
				//Also add new slides has no sense...
				$("#menubarCarrousel").hide();
				break;
			default:
				//Unknown presentation type
				disableToolbar();
				break;
		}
	}

	var _cleanPresentationToolbar = function(){
		$("#toolbar_presentation").find("img").hide();
	}

   /*
	* Slides Toolbar
	*/
	var loadSlidesToolbar = function(){
		if(VISH.Slides.isSlideSelected()){
			$("#toolbar_slide").find("img").show();
		} else {
			_cleanSlideToolbar();
		}
	}

	var _cleanSlideToolbar = function(){
		$("#toolbar_slide").find("img").hide();
	}

   /*
	* Element Toolbar
	*/

	var loadToolbarForElement = function(type){
		_cleanElementToolbar();

		if(type=="text"){
			_loadNiceEditorToolbar();
			return;
		}
		
		var toolbarClass = "toolbar_" + type;
		$("#toolbar_element").find("img").hide();
		$("#toolbar_element").find("img." + toolbarClass).show();
	}

	var _loadNiceEditorToolbar = function(){
		$("#toolbar_element").find("img").hide();
		$(".nicEdit-panel").show();
	}

	var loadToolbarForObject = function(object){
		var objectInfo = VISH.Editor.Object.getObjectInfo(object);

		switch(objectInfo.type){
			case "web":
				loadToolbarForElement(objectInfo.type);
				break;
			default:
				loadToolbarForElement("object");
				//object default toolbar
				break;
		}
	}

	var _cleanElementToolbar = function(){
		//NiceEditor Toolbar
		$(".nicEdit-panel").hide();
		//Generic Toolbars
		$("#toolbar_element").find("img").hide();
	}

	var _showSlider = function(id){
		if(id){
			id = id.substring(9);
			$("#sliderId" + id).show(); 
		}
	}
	
	

   /*
	* Presentation actions
	*/
	 var switchMode = function(object){
	 	var mode = $(object).attr("mode");
	 	switch(mode){
	 		case "presentation":
	 			VISH.Debugging.log("Presentation clicked");
	 			break;
	 		case "flashcard":
	 			VISH.Debugging.log("Flashcard clicked");
	 			break;
	 		case "game":
	 			VISH.Debugging.log("Game clicked");
	 			break;
	 		default:
	 			break;
	 	}
	 }


   /*
	* Slide actions
	*/
	var moveSlide = function(object){
	 	var direction = $(object).attr("direction");
	 	switch(direction){
	 		case "right":
	 			VISH.Debugging.log("moveSlide to right");
	 			break;
	 		case "left":
	 			VISH.Debugging.log("moveSlide to left");
	 			break;
	 		default:
	 			break;
	 	}
	 }
	
   /*
	* Element actions
	*/

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

					$(iframe).attr("style",VISH.Editor.Utils.addZoomToStyle($(iframe).attr("style"),zoom));

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
		init							: init,
		loadPresentationToolbar			: loadPresentationToolbar,
		loadSlidesToolbar				: loadSlidesToolbar,
		loadToolsForZone				: loadToolsForZone,
		loadToolbarForObject			: loadToolbarForObject,
		loadToolbarForElement			: loadToolbarForElement,
		cleanZoneTools 					: cleanZoneTools,
		cleanToolbar					: cleanToolbar,
		switchMode 						: switchMode,
		enableToolbar					: enableToolbar,
		disableToolbar					: disableToolbar,
		moveSlide						: moveSlide,
		zoomMore 						: zoomMore,
		zoomLess 						: zoomLess
	};

}) (VISH, jQuery);