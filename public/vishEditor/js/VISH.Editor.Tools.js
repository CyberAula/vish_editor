VISH.Editor.Tools = (function(V,$,undefined){
	
	var toolbarEventsLoaded = false;
	var INCREASE_SIZE = 1.05; //Constant to multiply or divide the actual size of the element


	/*
	 * Toolbar is divided in three zones.
	 * 1) Menu botton (Menu toolbar)
	 * 1) Presentation toolbar
	 * 3) Element toolbar
	 */

	var init = function(){
		cleanZoneTools();
		cleanToolbar();

		if(!toolbarEventsLoaded){
			//Add listeners to toolbar buttons
			$.each($("img.toolbar_icon"), function(index, toolbarButton) {
				$(toolbarButton).on("click", function(event){
					if(typeof V.Editor.Tools[$(toolbarButton).attr("action")] == "function"){
						V.Editor.Tools[$(toolbarButton).attr("action")](this);
					}
				});
			});

			//Add key event for Add Url Input
			$(document).on('keydown', '.tools_input_addUrl', _addUrlOnKeyDown);

			toolbarEventsLoaded = true;
		}

		loadPresentationToolbar();

		V.Editor.Tools.Menu.init();
	}
	 


   /*
	* Tools
	*/

	var loadToolsForZone = function(zone){

		cleanZoneTools();
		
		var type = $(zone).clone().attr("type");

		switch(type){
			case "text":  
				loadToolbarForElement(type);
				break;
			case "image":
				loadToolbarForElement(type);
				break;
			case "video":
				loadToolbarForElement(type);
				break;
			case "object":
				var object = $(zone).find(".object_wrapper").children()[0];
				loadToolbarForObject(object);
				break;
			case "snapshot":
				loadToolbarForElement("snapshot");
				break;
			case "quiz":
				loadToolbarForElement("quiz");
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
		_cleanElementToolbar();
	}



    /*
     * Toolbar
     */

	var cleanToolbar = function(){
		_cleanPresentationToolbar();
		_cleanElementToolbar();
	}

	var enableToolbar = function(){
		$("#toolbar_wrapper").show();
	}

	var disableToolbar = function(){
		$("#toolbar_wrapper").hide();
	}


   /*
	* Menu Toolbar and Menu itself
	*/
	//Enable and disable menu methods in V.Editor.Tools.Menu.js


   /*
	* Presentation Toolbar
	*/
	var loadPresentationToolbar = function(){
		var presentationType = V.Editor.getPresentationType();
		switch(presentationType){
			case V.Constant.PRESENTATION:			
				$("#hidden_button_to_launch_theme_fancybox").fancybox({
					'autoDimensions' : false,
					'width': 600,
					'scrolling': 'no',
					'height': 400,
					'padding' : 0
				});
				$("#toolbar_presentation").find("img.toolbar_presentation").show();
				break;
			case V.Constant.FLASHCARD:
				$("#hidden_button_to_launch_picture_fancybox_for_flashcard").fancybox({
					'autoDimensions' : false,
					'width': 800,
					'scrolling': 'no',
					'height': 600,
					'padding' : 0,
					"onStart"  : function(data) {						
						V.Editor.Image.setAddContentMode(V.Constant.FLASHCARD);
						V.Utils.loadTab('tab_pic_from_url');
					},
					"onClosed"  : function(data) {				
						V.Editor.Image.setAddContentMode(V.Constant.NONE);
					}
				});
				$("#toolbar_presentation").find("img.toolbar_flashcard").show();
				break;
			case V.Constant.GAME:
				$("#toolbar_presentation").find("img.toolbar_game").show();
				break;
			case V.Constant.QUIZ_SIMPLE:
				//Toolbar has no sense here...
				disableToolbar();
				//Also add new slides has no sense...
				$("#menubarCarrousel").hide();
				break;
			case V.Constant.VTOUR:
				$("#toolbar_presentation").find("img.toolbar_vtour").show();
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
	* Element Toolbar
	*/

	var loadToolbarForElement = function(type){
		_cleanElementToolbar();
		if(type=="text" || type=="quiz"){
			_loadTextToolbar();
			return;
		}
		
		var toolbarClass = "toolbar_" + type;
		$("#toolbar_element").find("img").hide();
		$("#toolbar_element").find("img." + toolbarClass).show();
	}

	var _loadTextToolbar = function(){
		$("#toolbar_element").find("img").hide();
		$("#toolbar_text").show();
		// $(".nicEdit-panel").show();
		$("#toolbar_text").show();
	}

	var loadToolbarForObject = function(object){
		var objectInfo = V.Object.getObjectInfo(object);

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
		//Wysiwyg Toolbar
		// $(".nicEdit-panel").hide();
		$("#toolbar_text").hide();
		$("#toolbar_text").hide();
		//Generic Toolbars
		$("#toolbar_element").find("img").hide();
	}



   /*
	* Presentation actions
    */

	var selectTheme = function(){
		$("#hidden_button_to_launch_theme_fancybox").trigger("click");
	}

	var changeFlashcardBackground = function(){
		$("#hidden_button_to_launch_picture_fancybox_for_flashcard").trigger("click");
	}


   /*
	* Element actions
	*/

	var zoomMore = function(){
    	_changeZoom("+");
	};
	
	var zoomLess = function(){
    	_changeZoom("-");
	};

	var resizeMore = function(){
		_resize("+");
	};

	var resizeLess = function(){
		_resize("-");
	};
	

	var _resize = function(action){
		var object, objectInfo, resizeFactor;
		var area = V.Editor.getCurrentArea();
		var type = $(area).attr("type");

		if(action=="+"){
			resizeFactor = INCREASE_SIZE;
		} else {
			resizeFactor = 1/INCREASE_SIZE;
		}

		switch(type){
			case "snapshot":
				var snapshot_wrapper = area.children(":first");
				var proportion = $(snapshot_wrapper).height()/$(snapshot_wrapper).width();
				var originalWidth = $(snapshot_wrapper).width();

				//Change width
				snapshot_wrapper.width(originalWidth*resizeFactor);
				snapshot_wrapper.height(originalWidth*resizeFactor*proportion);

				break;
			case "object":
				var parent = area.children(":first");
				object = parent.children(":first");
				objectInfo = V.Object.getObjectInfo(object);
				
				var newWidth, newHeight;
				var aspectRatio = parent.width()/parent.height();
				var originalHeight = object.height();
				var originalWidth = object.width();
				var parentoriginalHeight = parent.height();
				var parentoriginalWidth = parent.width();

				//Change width
				$(parent).width(parentoriginalWidth*resizeFactor);
				$(parent).height(parentoriginalHeight*resizeFactor);

				var styleZoom = V.Utils.getZoomFromStyle($(object).attr("style"));
				if(styleZoom!=1){
					newWidth = newWidth/styleZoom;
					newHeight = Math.round(newWidth/aspectRatio);
					newWidth = Math.round(newWidth);
				} else {
					newHeight = parentoriginalHeight*resizeFactor;
					newWidth = parentoriginalWidth*resizeFactor;
				}	
					
				$(object).width(newWidth);
				$(object).height(newHeight);
				break;
			case "image":
				object = $(area).find("img");

				var originalHeight = object.height();
				var originalWidth = object.width();

				//Change width
				object.width(originalWidth*resizeFactor);
				object.height(originalHeight*resizeFactor);

				break;
			case "video":
				object = $(area).find("video");

				var originalHeight = object.height();
				var originalWidth = object.width();

				//Change width
				object.width(originalWidth*resizeFactor);
				object.height(originalHeight*resizeFactor);

				break;
			default:
				break;
		}
	};

	var _changeZoom = function(action){
		var object, objectInfo, zoom;
		var area = V.Editor.getCurrentArea();
		var type = $(area).attr("type");    
		switch(type){
			case "object":
				var parent = area.children(":first");
				object = parent.children(":first");
				objectInfo = V.Object.getObjectInfo(object);
				if(objectInfo.type==="web"){
					var iframe = $(area).find("iframe");
					zoom = V.Utils.getZoomFromStyle($(iframe).attr("style"));

					if(action=="+"){
						zoom = zoom + 0.1;
					} else {
						zoom = zoom - 0.1;
					}

					$(iframe).attr("style",V.Editor.Utils.addZoomToStyle($(iframe).attr("style"),zoom));

					//Resize object to fix in its wrapper
					V.Editor.Object.autofixWrapperedObjectAfterZoom(iframe,zoom);
				}				
				break;
			default:
				break;
		}
	}

	var addLink = function(){
		$.fancybox(
			$("#tools_addUrl").html(),
			{
				'autoDimensions'	: false,
				'scrolling': 'no',
				'width'         	: 800,
				'height'        	: 215,
				'showCloseButton'	: true,
				'padding' 			: 0,
				'onStart'			: function(){
				},
				'onComplete'		: function(){
					var area = V.Editor.getCurrentArea();
					var hyperlink = $(area).attr("hyperlink");
					if(hyperlink){
						$(".tools_input_addUrl").val(hyperlink);
						$(".removeUrlButton").show();
					} else {
						$(".removeUrlButton").hide();
					}
				},
				'onClosed'	: function(){
					$(".removeUrlButton").hide();
				}
			}
		);
	} 

	var _addUrlOnKeyDown = function(event){
		switch (event.keyCode) {
			case 13:
				addUrl();
				break;
			default:
				break;
		}
	}

	var addUrl = function(){
		var url;
		$(".tools_input_addUrl").each(function(index,input){
			if($($(input).parent().parent()).attr("id") !== "tools_addUrl"){
				url = $(input).val();
			}
		});
		if(url){
			url = V.Editor.Utils.autocompleteUrls(url);

			var area = V.Editor.getCurrentArea();
			switch($(area).attr("type")){
				case "image":
					$(area).attr("hyperlink",url);
					break;
				default:
					//Currently only for images
					break;
			}
		}
		$.fancybox.close();
	};

	var removeUrl = function(){
		var area = V.Editor.getCurrentArea();
		$(area).removeAttr("hyperlink");
		$.fancybox.close();
	}
  
	return {
		init							: init,
		loadPresentationToolbar			: loadPresentationToolbar,
		loadToolsForZone				: loadToolsForZone,
		loadToolbarForObject			: loadToolbarForObject,
		loadToolbarForElement			: loadToolbarForElement,
		cleanZoneTools 					: cleanZoneTools,
		cleanToolbar					: cleanToolbar,
		enableToolbar					: enableToolbar,
		disableToolbar					: disableToolbar,
		selectTheme						: selectTheme,
		changeFlashcardBackground		: changeFlashcardBackground,
		addLink							: addLink,
		addUrl 							: addUrl,
		removeUrl 						: removeUrl,
		resizeMore						: resizeMore,
		resizeLess						: resizeLess,
		zoomMore 						: zoomMore,
		zoomLess 						: zoomLess
	};

}) (VISH, jQuery);