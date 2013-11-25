VISH.Editor.Tools = (function(V,$,undefined){
	
	var toolbarEventsLoaded = false;
	var INCREASE_SIZE = 1.05; //Constant to multiply or divide the actual size of the element


	/*
	 * Toolbar is divided in three zones.
	 * 1) Menu
	 * 1) Presentation toolbar (always visible and updated when current slide changed)
	 * 3) Element toolbar
	 */

	var init = function(){
		cleanToolbar();
		cleanZoneTools();

		var presentationType = V.Editor.getPresentationType();
		if(presentationType !== V.Constant.PRESENTATION){
			disableToolbar();
			return;
		}

		if(!toolbarEventsLoaded){
			//Add listeners to toolbar buttons
			$.each($("#toolbar_wrapper a.tool_action, img.toolbar_icon"), function(index, toolbarButton) {
				$(toolbarButton).on("click", function(event){
					if(typeof V.Editor.Tools[$(toolbarButton).attr("action")] == "function"){
						if(!$(toolbarButton).parent().hasClass("toolbar_presentation_wrapper_disabled")){
							V.Editor.Tools[$(toolbarButton).attr("action")](this);
						}
					}
					return false; //Prevent iframe to move
				});
			});

			//Add key event for Add Url Input
			$(document).on('keydown', '.tools_input_addUrl', _addUrlOnKeyDown);

			toolbarEventsLoaded = true;
		}

		V.Editor.Tools.Menu.init();
	}
	 
	var cleanToolbar = function(){
		loadToolsForSlide(V.Slides.getCurrentSlide());
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
	//Enable and disable menu methods in VISH.Editor.Tools.Menu.js


   /*
	* Presentation Toolbar
	*/

	/*
	 * Update toolbar when load slide
	 */
	var loadToolsForSlide = function(slide){
		_cleanPresentationToolbar();

		var type = $(slide).attr("type");
		switch(type){
			case V.Constant.STANDARD:
				$("#toolbar_background").parent().addClass("toolbar_presentation_wrapper_disabled");
				break;
			case V.Constant.FLASHCARD:
				break;
			case V.Constant.VTOUR:
				$("#toolbar_background").parent().addClass("toolbar_presentation_wrapper_disabled");
				break;
			default:
				return;
		}
	}

	var _cleanPresentationToolbar = function(){
		//Enable all buttons
		$(".toolbar_presentation_wrapper").removeClass("toolbar_presentation_wrapper_disabled");
	}


   /*
	* Zone Tools
	*/
	var loadToolsForZone = function(zone){
		cleanZoneTools(V.Editor.getLastArea());
		
		var type = $(zone).clone().attr("type");

		switch(type){
			case "text":  
				_loadToolbarForElement(type);
				break;
			case "image":
				_loadToolbarForElement(type);
				break;
			case "video":
				_loadToolbarForElement(type);
				break;
			case "object":
				var object = $(zone).find(".object_wrapper").children()[0];
				loadToolbarForObject(object);
				break;
			case "snapshot":
				_loadToolbarForElement("snapshot");
				break;
			case "quiz":
				_loadToolbarForElement("quiz");
				break;
			case undefined:
				//Add menuselect button and hide tooltips
				$(zone).find(".menuselect_hide").show();
				hideZoneToolTip($(zone).find(".zone_tooltip"));
				return;
			default:
				break;
		}

		//Add delete content button
		$(zone).find(".delete_content").show();
	};

	var addTooltipsToSlide = function(slide){
		var zones = $(slide).find("div.vezone");
		for (var i = 0; i < zones.length; i++) {
			addTooltipToZone(zones[i]);
		};
	};

	var addTooltipToZone = function(zone,hidden){
		var style = "";
		var visible = "true";
		if(hidden === true){
			style = "style='display:none'";
			visible = "false";
		}
		var tooltip = "<span class='zone_tooltip' visible='" + visible + "' " + style + " >"+V.I18n.getTrans('i.ZoneTooltip')+"</span>";
		$(zone).append(tooltip);

		tooltip = $(zone).find(".zone_tooltip");
		if(hidden === true){
			hideZoneToolTip(tooltip);
		} else {
			showZoneToolTip(tooltip);
		}
	};

	var showZoneToolTip = function(tooltip){
		var zone = $("div").has(tooltip);

		$(tooltip).show();
		$(tooltip).attr("visible","true");
		$(zone).attr("tooltip","true");

		if($(tooltip).css("margin-top")==="0px"){	
			_setTooltipMargins(tooltip);
		}
	}

	var _setTooltipMargins = function(tooltip){
		var zone = $("div").has(tooltip);
		var slide = $("article").has(zone);

		$(slide).addClass("temp_shown");
		$(zone).addClass("temp_shown");
		$(tooltip).addClass("temp_shown");

		//Adjust margin-top
		var zoneHeight = $(zone).height();
		var spanHeight = $(tooltip).height();
		var marginTop = ((zoneHeight-spanHeight)/2);
		
		$(slide).removeClass("temp_shown");
		$(zone).removeClass("temp_shown");
		$(tooltip).removeClass("temp_shown");

		$(tooltip).css("margin-top",marginTop+"px");
	}

	var setAllTooltipMargins = function(callback){
		$("span.zone_tooltip").each(function(index,tooltip){
			_setTooltipMargins(tooltip);
		});
		if(typeof callback == "function"){
			callback(true);
		}
	}

	var hideZoneToolTip = function(tooltip){
		var zone = $("div").has(tooltip);
		$(tooltip).hide();
		$(tooltip).attr("visible","false");
		$(zone).attr("tooltip","false");
	}

	var cleanZoneTools = function(zone){
		$(".menuselect_hide").hide();
		$(".delete_content").hide();
		_cleanElementToolbar();

		var tooltip = $(zone).find(".zone_tooltip");	
		if(V.Editor.isZoneEmpty(zone)){
			showZoneToolTip(tooltip);
		} else {
			hideZoneToolTip(tooltip);
		}
	}

   /*
	* Element Toolbar
	*/

	var _loadToolbarForElement = function(type){
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
	}

	var loadToolbarForObject = function(object){
		var objectInfo = V.Object.getObjectInfo(object);

		switch(objectInfo.type){
			case "web":
				_loadToolbarForElement(objectInfo.type);
				break;
			default:
				_loadToolbarForElement("object");
				//object default toolbar
				break;
		}
	}

	var _cleanElementToolbar = function(){
		//Wysiwyg Toolbar
		$("#toolbar_text").hide();
		//Generic Toolbars
		$("#toolbar_element").find("img").hide();
	}


   /*
	* Presentation actions
    */

    var save = function(){
		V.Editor.Tools.Menu.onSaveButtonClicked();
	}

	var publish = function(){
		V.Editor.Tools.Menu.onPublishButtonClicked();
	}

	var preview = function(){
		V.Editor.Preview.preview();
	}

	var selectTheme = function(){
		$("#hidden_button_to_launch_theme_fancybox").trigger("click");
	}

	var selectAnimation = function(){
		$("#hidden_button_to_launch_animation_fancybox").trigger("click");
	}


	var changeBackground = function(){
		$("#hidden_button_to_change_slide_background").trigger("click");
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
		loadToolsForSlide				: loadToolsForSlide,
		loadToolsForZone				: loadToolsForZone,
		loadToolbarForObject			: loadToolbarForObject,
		cleanZoneTools 					: cleanZoneTools,
		cleanToolbar					: cleanToolbar,
		enableToolbar					: enableToolbar,
		disableToolbar					: disableToolbar,
		addLink							: addLink,
		addUrl 							: addUrl,
		removeUrl 						: removeUrl,
		resizeMore						: resizeMore,
		resizeLess						: resizeLess,
		zoomMore 						: zoomMore,
		zoomLess 						: zoomLess,
		save 							: save,
		publish							: publish,
		preview 						: preview,
		selectTheme						: selectTheme,
		selectAnimation					: selectAnimation,
		changeBackground				: changeBackground,
		addTooltipsToSlide				: addTooltipsToSlide,
		addTooltipToZone				: addTooltipToZone,
		showZoneToolTip					: showZoneToolTip,
		hideZoneToolTip					: hideZoneToolTip,
		setAllTooltipMargins			: setAllTooltipMargins
	};

}) (VISH, jQuery);