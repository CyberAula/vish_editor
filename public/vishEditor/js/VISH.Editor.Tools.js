VISH.Editor.Tools = (function(V,$,undefined){
	
	var toolbarEventsLoaded = false;
	

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
					if(typeof VISH.Editor.Tools[$(toolbarButton).attr("action")] == "function"){
						VISH.Editor.Tools[$(toolbarButton).attr("action")](this);
					}
				});
			});

			//Add key event for Add Url Input
			$(document).on('keydown', '.tools_input_addUrl', _addUrlOnKeyDown);

			toolbarEventsLoaded = true;
		}

		loadPresentationToolbar();

		VISH.Editor.Tools.Menu.init();
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
		$(".theslider").hide();
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
	//Enable and disable menu methods in VISH.Editor.Tools.Menu.js


   /*
	* Presentation Toolbar
	*/
	var loadPresentationToolbar = function(){
		var presentationType = VISH.Editor.getPresentationType();
		switch(presentationType){
			case "presentation":			
				$("#hidden_button_to_launch_theme_fancybox").fancybox({
					'autoDimensions' : false,
					'width': 600,
					'scrolling': 'no',
					'height': 400,
					'padding' : 0
				});
				$("#toolbar_presentation").find("img.toolbar_presentation").show();
				break;
			case "flashcard":
				$("#hidden_button_to_launch_picture_fancybox_for_flashcard").fancybox({
					'autoDimensions' : false,
					'width': 800,
					'scrolling': 'no',
					'height': 600,
					'padding' : 0,
					"onStart"  : function(data) {						
						V.Editor.Image.setAddContentMode(VISH.Constant.FLASHCARD);
						V.Utils.loadTab('tab_pic_from_url');
					}
				});
				$("#toolbar_presentation").find("img.toolbar_flashcard").show();
				break;
			case "game":
				$("#toolbar_presentation").find("img.toolbar_game").show();
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
	* Element Toolbar
	*/

	var loadToolbarForElement = function(type){
		_cleanElementToolbar();
		if(type=="text" || type=="quiz"){
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
		var objectInfo = VISH.Object.getObjectInfo(object);

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
	
	

 //   /*
	// * Slide actions
	// */
	// var moveSlide = function(object){
	//  	var direction = $(object).attr("direction");
	//  	var movement = null;
	//  	var article = null;
	//  	switch(direction){
	//  		case "right":
	//  			movement = "after";
	//  			article = $("article.next");
	//  			var slide_position = V.Slides.getNumberOfSlide($("article.current")[0])+2;
	//  			break;
	//  		case "left":
	//  			movement = "before";
	//  			article = $("article.past");
	//  			var slide_position = V.Slides.getNumberOfSlide($("article.current")[0]);
	//  			break;
	//  		default:
	//  			return;
	//  	}

	//  	if((movement!=null)&&(article!=null)){
	//  		V.Slides.moveSlideTo($("article.current")[0],article,movement);
	// 		V.Editor.Utils.redrawSlides();
	// 		V.Editor.Thumbnails.redrawThumbnails();
	// 		setTimeout(function(){
	// 				V.Editor.Thumbnails.selectThumbnail(slide_position);
	// 			}, 200);
	// 		V.Slides.goToSlide(slide_position);
	// 	 }
	//  }
	


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
				var objectInfo = VISH.Object.getObjectInfo(object);
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
					var area = VISH.Editor.getCurrentArea();
					var hyperlink = $(area).attr("hyperlink");
					if(hyperlink){
						$(".tools_input_addUrl").val(hyperlink);
					}
				},
				'onClosed'			: function(){
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
			url = VISH.Utils.autocompleteUrls(url);

			var area = VISH.Editor.getCurrentArea();
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
		zoomMore 						: zoomMore,
		zoomLess 						: zoomLess
	};

}) (VISH, jQuery);