VISH.Editor.ViewerAdapter = (function(V,$,undefined){

	//Full Screen
	var _fsButton;

	//Internals
	var _initialized = false;


	var init = function(options){
		if(_initialized){
			return;
		} 
		_initialized = true;

		//Init vars
		_fsButton = V.FullScreen.canFullScreen();


		////////////////
		//Init interface
		///////////////

		//Init fullscreen
		if(_fsButton){
			V.FullScreen.enableFullScreen();
			$("#page-fullscreen").show();
		} else {
			$("#page-fullscreen").hide();
		}

	};

	var updateInterface = function(){
		var device = V.Status.getDevice();
		var editorDOM = $("section.slides_editor");

		var document_width = $(document).width();
		var document_height = $(document).height();
		var document_aspectRatio = document_width/document_height;

		//Apply Scale (needed for fullscreen)
		var scale = 1;
		var extraHeaderHeight = 0;

		if(V.FullScreen.isFullScreen()){
			//Extra header
			if(device.desktop){
				if(device.browser.name===V.Constant.CHROME){
					//Add a tiny header to prevent default chrome fullscreen dialog to appear
					extraHeaderHeight = 10;
				}
			} else if (device.features.touchScreen===true) {
				//Add a header to prevent native text tools to hide VE tools on some devices
				if(device.browser.name===V.Constant.CHROME){
					extraHeaderHeight = 55;
				}
			}
			
			var original_width = 1200;
			var original_height = 750 + extraHeaderHeight;
			var original_aspectRatio = original_width/original_height;

			if(document_aspectRatio>original_aspectRatio){
				//Adapt height
				scale = document_height/original_height;
			} else {
				//Adapt width
				scale = document_width/original_width;
			}			
		}

		//Show/Hide Extra header
		$(editorDOM).css("top", extraHeaderHeight);
		
		V.Utils.addScale3DToElement($(editorDOM),scale);

		//Margins (to center the editor in the screen)
		var marginLeft = Math.max(0,(document_width-$(editorDOM).width()*scale)/2);
		$("section.slides_editor").css("margin-left",marginLeft+"px");
	};


	return {
		init 					: init,
		updateInterface 		: updateInterface
	};

}) (VISH, jQuery);