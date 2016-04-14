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

		var presentationType = V.Editor.getPresentationType();
		if(presentationType !== V.Constant.PRESENTATION){
			disableToolbar();
			return;
		}

		if (V.StudentMode===true){
			//Student view modification in VEditor
			var draft = V.Utils.getOptions().draft;
			var notified = V.Utils.getOptions().notified;
			var publish_button = $("#toolbar_publish_wrapper");

			if(draft && notified){
				publish_button.addClass("menu_item_disabled");
				publish_button.children("p").html(V.I18n.getTrans("i.notified_teacher"));
				publish_button.find("i").removeClass().addClass("icon-button icon-bell-alt");
			} else if (draft) {
				publish_button.children("p").html(V.I18n.getTrans("i.notify_teacher"));
				publish_button.find("i").removeClass().addClass("icon-button icon-bell-alt");
				$('#toolbar_publish').attr('action', 'notifyTeacher');
			} else {
				publish_button.addClass("menu_item_disabled");
				publish_button.children("p").html(V.I18n.getTrans("i.Published"));
				publish_button.find("i").removeClass().addClass("icon-button icon-cloud-upload");
			}
		}

		if(!toolbarEventsLoaded){
			//Add listeners to toolbar buttons
			$.each($("#toolbar_wrapper a.tool_action, div.tool_action"), function(index, toolbarButton) {
				$(toolbarButton).on("click", function(event){
					if(typeof V.Editor.Tools[$(toolbarButton).attr("action")] == "function"){
						if(!$(toolbarButton).find(".toolbar_presentation_wrapper").hasClass("toolbar_presentation_wrapper_disabled")){
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
	};
	 
	var cleanToolbar = function(){
		var cSlide = V.Slides.getCurrentSlide();
		if(typeof cSlide != "undefined"){
			loadToolsForSlide(cSlide);
		}
	};

	var enableToolbar = function(){
		$("#toolbar_wrapper").show();
	};

	var disableToolbar = function(){
		$("#toolbar_wrapper").hide();
	};


   /*
	* Menu Toolbar and Menu itself
	*/
	//Enable and disable menu methods in VISH.Editor.Tools.Menu.js


   /*
	* Presentation Toolbar
	*/

	/*
	 * Update toolbar when load slide or events
	 */
	var loadToolsForSlide = function(slide){
		_cleanPresentationToolbar();

		var type = $(slide).attr("type");
		$(".toolbar_presentation_wrapper_slideTools:not(.toolbar_" + type + ")").hide();
		$(".toolbar_presentation_wrapper_slideTools.toolbar_" + type).show();
		$(".toolbar_presentation_wrapper_slideTools.toolbar_" + type).children().css("visibility","visible");

		switch(type){
			case V.Constant.STANDARD:
				$("#toolbar_background").find(".toolbar_presentation_wrapper").addClass("toolbar_presentation_wrapper_disabled");

				//If the slide contains only one element, automatically select the zone that contains it
				// var zone = $(slide).children("div.vezone:has('.delete_content')");
				// if($(zone).length === 1){
				// 	//The slide contains only one element in the zone: zone
				// 	V.Editor.selectArea($(zone));
				// }

				break;
			case V.Constant.FLASHCARD:
				break;
			case V.Constant.VTOUR:
				$("#toolbar_background_wrapper").children().css('visibility', 'hidden');
				break;
			default:
				return;
		}
	};

	var _cleanPresentationToolbar = function(){
		//Enable all buttons
		$(".toolbar_presentation_wrapper_slideTools").removeClass("toolbar_presentation_wrapper_disabled");
		cleanZoneTools();
	};

	/*
	 * Draft Mode: change publish button status
	 */
	var changePublishButtonStatus = function(status){
		switch(status){
			case "publish":
				_enablePublishButton();
				break;
			case "publishing":
				_enablePublishingButton();
				break;
			case "unpublish":
				_enableUnpublishButton();
				break;
			case "unpublishing":
				_enableUnpublishingButton();
				break;
			case "disabled":
				_disablePublishButton();
				break;
			default:
				return;
		}
	};

	var _enablePublishButton = function(){
		$("#waiting_overlay").hide();

		$("#toolbar_publish_wrapper").removeClass("toolbar_presentation_wrapper_loading");
		$("#toolbar_publish_wrapper").removeClass("toolbar_presentation_wrapper_disabled");
		var icon = $("#toolbar_publish").find("i.icon-download-alt");
		$(icon).removeClass("icon-rotate-90");
		$(icon).addClass("icon-rotate-270");
		$("#toolbar_publish").find("p.toolbar_presentation_title").html(V.I18n.getTrans("i.Publish"));
		$("#toolbar_publish").attr("action","publish");

		//Menu
		var menuItem = $(".menu_option.menu_action.publishMenuOption");
		$(menuItem).parent().removeClass("menu_item_disabled");
		$(menuItem).find("span").html(V.I18n.getTrans("i.Publish"));
		$(menuItem).attr("action","onPublishButtonClicked");
	};

	var _enablePublishingButton = function(){
		$("#waiting_overlay").show();

		$("#toolbar_publish_wrapper").addClass("toolbar_presentation_wrapper_loading");
		$("#toolbar_publish_wrapper").addClass("toolbar_presentation_wrapper_disabled");
		var icon = $("#toolbar_publish").find("i.icon-download-alt");
		$(icon).removeClass("icon-rotate-90");
		$(icon).addClass("icon-rotate-270");
		$("#toolbar_publish").find("p.toolbar_presentation_title").html(V.I18n.getTrans("i.Publishing"));

		//Menu
		var menuItem = $(".menu_option.menu_action.publishMenuOption");
		$(menuItem).parent().addClass("menu_item_disabled");
		$(menuItem).find("span").html(V.I18n.getTrans("i.Publishing"));
	};

	var _enableUnpublishButton = function(){
		$("#waiting_overlay").hide();

		$("#toolbar_publish_wrapper").removeClass("toolbar_presentation_wrapper_loading");
		$("#toolbar_publish_wrapper").removeClass("toolbar_presentation_wrapper_disabled");
		var icon = $("#toolbar_publish").find("i.icon-download-alt");
		$(icon).removeClass("icon-rotate-270");
		$(icon).addClass("icon-rotate-90");
		$("#toolbar_publish").find("p.toolbar_presentation_title").html(V.I18n.getTrans("i.Unpublish"));
		$("#toolbar_publish").attr("action","unpublish");

		//Menu
		var menuItem = $(".menu_option.menu_action.publishMenuOption");
		$(menuItem).parent().removeClass("menu_item_disabled");
		$(menuItem).find("span").html(V.I18n.getTrans("i.Unpublish"));
		$(menuItem).attr("action","onUnpublishButtonClicked");
	};

	var _enableUnpublishingButton = function(){
		$("#waiting_overlay").hide();

		$("#toolbar_publish_wrapper").addClass("toolbar_presentation_wrapper_disabled");
		$("#toolbar_publish_wrapper").addClass("toolbar_presentation_wrapper_loading");
		$("#toolbar_publish").find("p.toolbar_presentation_title").html(V.I18n.getTrans("i.Unpublishing"));

		//Menu
		var menuItem = $(".menu_option.menu_action.publishMenuOption");
		$(menuItem).parent().addClass("menu_item_disabled");
		$(menuItem).find("span").html(V.I18n.getTrans("i.Unpublishing"));
	};

	var _disablePublishButton = function(){
		$("#waiting_overlay").hide();
		
		$("#toolbar_publish_wrapper").removeClass("toolbar_presentation_wrapper_loading");
		$("#toolbar_publish_wrapper").addClass("toolbar_presentation_wrapper_disabled");
		$("#toolbar_publish").find("p.toolbar_presentation_title").html(V.I18n.getTrans("i.Publish"));

		//Menu
		var menuItem = $(".menu_option.menu_action.publishMenuOption");
		$(menuItem).parent().addClass("menu_item_disabled");
		$(menuItem).find("span").html(V.I18n.getTrans("i.Publish"));
	};

	/*
	 * Dirty Mode: change save buttons status
	 */
	var dirtyModeTimeout;
	var saveButtonStatus = "enabled";

	var changeSaveButtonStatus = function(status){
		switch(status){
			case "enabled":
				_enableSaveButton();
				break;
			case "loading":
				_loadingSaveButton();
				break;
			case "disabled":
				_disableSaveButton();
				break;
			default:
				return;
		}
	};

	var _enableSaveButton = function(){
		if(saveButtonStatus === "enabled"){
			return;
		}
		saveButtonStatus = "enabled";
		_stopDirtyTimeout();
		$("#toolbar_save").find(".toolbar_presentation_wrapper").removeClass("toolbar_presentation_wrapper_loading");
		$("#toolbar_save").find(".toolbar_presentation_wrapper").removeClass("toolbar_presentation_wrapper_disabled");
		$("#toolbar_save").find("p.toolbar_presentation_title").html(V.I18n.getTrans("i.Save"));

		//Menu
		$(".menu_option.menu_action[action='onSaveButtonClicked']").parent().removeClass("menu_item_disabled");
		$(".menu_option.menu_action[action='onSaveButtonClicked']").find("span").html(V.I18n.getTrans("i.Save"));
	};

	var _loadingSaveButton = function(){
		if(saveButtonStatus === "loading"){
			return;
		}
		saveButtonStatus = "loading";
		$("#toolbar_save").find(".toolbar_presentation_wrapper").addClass("toolbar_presentation_wrapper_disabled");
		$("#toolbar_save").find(".toolbar_presentation_wrapper").addClass("toolbar_presentation_wrapper_loading");
		$("#toolbar_save").find("p.toolbar_presentation_title").html(V.I18n.getTrans("i.Saving"));

		//Menu
		$(".menu_option.menu_action[action='onSaveButtonClicked']").parent().addClass("menu_item_disabled");
		$(".menu_option.menu_action[action='onSaveButtonClicked']").find("span").html(V.I18n.getTrans("i.Saving"));
	};

	var _disableSaveButton = function(){
		if(saveButtonStatus === "disabled"){
			return;
		}
		saveButtonStatus = "disabled";
		$("#toolbar_save").find(".toolbar_presentation_wrapper").removeClass("toolbar_presentation_wrapper_loading");
		$("#toolbar_save").find(".toolbar_presentation_wrapper").addClass("toolbar_presentation_wrapper_disabled");
		$("#toolbar_save").find("p.toolbar_presentation_title").html(V.I18n.getTrans("i.Saved"));

		_stopDirtyTimeout();
		dirtyModeTimeout = setTimeout(function(){
			changeSaveButtonStatus("enabled");
		}, 5000);

		//Menu
		$(".menu_option.menu_action[action='onSaveButtonClicked']").parent().addClass("menu_item_disabled");
		$(".menu_option.menu_action[action='onSaveButtonClicked']").find("span").html(V.I18n.getTrans("i.Saved"));
	};

	var _stopDirtyTimeout = function(){
		if(typeof dirtyModeTimeout != "undefined"){
			clearTimeout(dirtyModeTimeout);
		}
	};


   /*
	* Zone Tools
	*/
	var loadToolsForZone = function(zone){
		cleanZoneTool(V.Editor.getLastArea());
		
		var type = $(zone).attr("type");
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
	};

	var _setTooltipMargins = function(tooltip){
		var zone = $("div").has(tooltip);
		var slide = $("article").has(zone);

		V.Utils.addTempShown([slide,zone,tooltip]);

		//Adjust margin-top
		var zoneHeight = $(zone).height();
		var spanHeight = $(tooltip).height();
		var marginTop = ((zoneHeight-spanHeight)/2);
		
		V.Utils.removeTempShown([slide,zone,tooltip]);

		$(tooltip).css("margin-top",marginTop+"px");
	};

	var setAllTooltipMargins = function(callback){
		$("span.zone_tooltip").each(function(index,tooltip){
			_setTooltipMargins(tooltip);
		});
		if(typeof callback == "function"){
			callback(true);
		}
	};

	var hideZoneToolTip = function(tooltip){
		var zone = $("div").has(tooltip);
		$(tooltip).hide();
		$(tooltip).attr("visible","false");
		$(zone).attr("tooltip","false");
	};

	var cleanZoneTools = function(){
		$(".menuselect_hide").hide();
		$(".delete_content").hide();
		_cleanElementToolbar();
	};

	var cleanZoneTool = function(zone){
		_cleanElementToolbar();

		var tooltip = $(zone).find(".zone_tooltip");
		if(V.Editor.isZoneEmpty(zone)){
			$(zone).find(".menuselect_hide").remove();
			$(zone).removeClass("zoneUnselected").removeClass("zoneSelected").addClass("editable");
			showZoneToolTip(tooltip);
		} else {
			$(zone).find(".menuselect_hide").hide();
			$(zone).find(".delete_content").hide();
			hideZoneToolTip(tooltip);
		}
	};


   /*
	* Element Toolbar
	*/
	var _loadToolbarForElement = function(type){
		_cleanElementToolbar();

		var toolbarClass = "toolbar_" + type;
		$("#toolbar_element").children().hide();
		$("#toolbar_element").find("." + toolbarClass).css("display","inline-block");
		if (type == "quiz") {
			document.getElementById("toolbar_settings_wrapper").style.top = "-8px";
		}
		else{
			document.getElementById("toolbar_settings_wrapper").style.top = "-4px";
		}
	};

	var loadToolbarForObject = function(object){
		var objectInfo = V.Object.getObjectInfo(object);

		switch(objectInfo.type){
			case V.Constant.MEDIA.WEB:
			case V.Constant.MEDIA.WEB_APP:
				_loadToolbarForElement(V.Constant.MEDIA.WEB);
				break;
			default:
				_loadToolbarForElement("object");
				//object default toolbar
				break;
		}
	};

	var _cleanElementToolbar = function(){
		$("#toolbar_element").children().hide();
	};

	/*
	 * General actions
	 */
	 var exit = function(){
	 	V.Editor.Tools.Menu.exit();
	 }

   /*
	* Presentation actions
    */

  var displaySettings = function(){
		V.Editor.Settings.displaySettings();
	};

  var save = function(){
		V.Editor.Tools.Menu.onSaveButtonClicked();
	};

	var publish = function(){
		V.Editor.Tools.Menu.onPublishButtonClicked();
	};

	var unpublish = function(){
		V.Editor.Tools.Menu.onUnpublishButtonClicked();
	};

	var preview = function(){
		V.Editor.Preview.preview();
	};

	var selectTheme = function(){
		$("#hidden_button_to_launch_theme_fancybox").trigger("click");
	};

	var selectAnimation = function(){
		$("#hidden_button_to_launch_animation_fancybox").trigger("click");
	};

	var changeBackground = function(){
		$("#hidden_button_to_change_slide_background").trigger("click");
	};

	var changeVideo = function(){
		V.Editor.EVideo.onChangeVideo();
	};

	var notifyTeacher = function(){
		V.Editor.Tools.Menu.onSaveButtonClicked();
		V.Editor.Tools.Menu.notifyTeacherClicked();
	};

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
				if([V.Constant.MEDIA.WEB,V.Constant.MEDIA.WEB_APP].indexOf(objectInfo.type)!=-1){
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
	};

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
	};

	var _addUrlOnKeyDown = function(event){
		switch (event.keyCode) {
			case 13:
				addUrl();
				break;
			default:
				break;
		}
	};

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
	};


	/* Element Settings */
  	var showSettings = function(event){
  		switch($(V.Editor.getCurrentArea()).attr("type")){
  			case V.Constant.QUIZ:
  				V.Editor.Quiz.showQuizSettings();
  				break;
  			case V.Constant.OBJECT:
  				V.Editor.Object.showObjectSettings();
  				break;
  			default:
  				break;
  		}
  	};


	return {		
		init							: init,
		loadToolsForSlide				: loadToolsForSlide,
		loadToolsForZone				: loadToolsForZone,
		loadToolbarForObject			: loadToolbarForObject,
		cleanZoneTools 					: cleanZoneTools,
		cleanZoneTool 					: cleanZoneTool,
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
		displaySettings   				: displaySettings,
		publish							: publish,
		unpublish 						: unpublish,
		notifyTeacher					: notifyTeacher,
		preview 						: preview,
		selectTheme						: selectTheme,
		selectAnimation					: selectAnimation,
		changeBackground				: changeBackground,
		changeVideo						: changeVideo,
		addTooltipsToSlide				: addTooltipsToSlide,
		addTooltipToZone				: addTooltipToZone,
		showZoneToolTip					: showZoneToolTip,
		hideZoneToolTip					: hideZoneToolTip,
		setAllTooltipMargins			: setAllTooltipMargins,
		changePublishButtonStatus		: changePublishButtonStatus,
		changeSaveButtonStatus			: changeSaveButtonStatus,
		showSettings 					: showSettings,
		exit							: exit
	};

}) (VISH, jQuery);