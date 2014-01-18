VISH.FullScreen = (function(V,$,undefined){

	//Internals
	var _pageIsFullScreen;

	//Fullscreen fallbacks
	var _fallbackFs;
	var _enterFsButton;
	var _enterFsUrl;
	var _exitFsButton;
	var _exitFsUrl;


	var init = function(){
		var options = V.Utils.getOptions();
		if(options){
			_enterFsButton = (!_canUseNativeFs())&&(V.Status.getIsInIframe())&&(typeof options["enterFullscreenURL"] !== "undefined")&&(!V.Status.getIsEmbed());
			if(_enterFsButton){
				// _enterFsUrl = options["fullscreen"];
				_enterFsUrl = options["enterFullscreenURL"]
			}
			_exitFsButton = (!_canUseNativeFs())&&(!V.Status.getIsInIframe())&&(typeof options["exitFullscreenURL"] !== "undefined")&&(!V.Status.getIsEmbed());
			if(_exitFsButton){
				_exitFsUrl = options["exitFullscreenURL"];
			}
			_fallbackFs = ((_enterFsButton)&&(_exitFsButton));
		} else {
			_enterFsButton = false;
			_exitFsButton = false;
			_fallbackFs = false;
		}
	};

	var canFullScreen = function(){
		return (_canUseNativeFs())||(_fallbackFs);
	};

	var _canUseNativeFs = function(){
		return (V.Status.getDevice().features.fullscreen);
	};

	var isFullScreen  = function(){
		return _pageIsFullScreen;
	};

	var setFullScreen = function(page_is_fullscreen){
		_pageIsFullScreen = page_is_fullscreen;
	};

	var enableFullScreen = function(){
		if(_canUseNativeFs()){
			//if we have Native FullScreen feature, use it
			$(document).on('click', '#page-fullscreen', _toggleFullScreen);
			$(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange",function(event){
				//Give some time...
				setTimeout(function(){
					_pageIsFullScreen = !_pageIsFullScreen;
					V.ViewerAdapter.updateInterface();
				}, 400);
			});
		} else if(_fallbackFs) {
			//Use FullScreen fallback

			if((_pageIsFullScreen)&&(_exitFsButton)){
				//we are in "simulated" fullscreen ,showing the .full version and we need a close fullscreen
				$("#page-fullscreen").css("background-image", 'url("'+V.ImagesPath+'vicons/fullscreen.png")');
				$("#page-fullscreen").css("background-position", "0px 0px");

				$(document).on('click', '#page-fullscreen', function(){
					//Try fallback first
					if((_exitFsUrl)&&(!V.Status.getIsEmbed())){
							window.location = _exitFsUrl;
					} else if(V.Status.getDevice().features.history){
						//Use feature history if its allowed
						history.back();
					}
				});
			} else if((!_pageIsFullScreen)&&(_enterFsButton)){
				$(document).on('click', '#page-fullscreen', function(){
					if(typeof window.parent.location.href !== "undefined"){
						V.Utils.sendParentToURL(_enterFsUrl+"?orgUrl="+window.parent.location.href);
					} else {
						//In embed mode, we dont have access to window.parent properties (like window.parent.location)
						V.Utils.sendParentToURL(_enterFsUrl+"?embed=true");
					}
				});
			}
		}
	};

	var _toggleFullScreen = function (){
		if(V.Status.isSlaveMode()){
			return;
		}

		var myDoc = document;
		var myElem = document.documentElement;
		
		if(!_isDocInFullScreen(myDoc)){
			_launchFullscreenForElement(myDoc,myElem);
		} else {
			_cancelFullscreen(myDoc);
		}
	};

	var onFullscreenEvent = function(fullscreen){
		if(typeof fullscreen != "boolean"){
			fullscreen = _pageIsFullScreen;
		}
		if(fullscreen){
			_onEnterFullScreen();
		} else {
			_onLeaveFullScreen();
		}
	};

	var _onEnterFullScreen = function(){
		$("#page-fullscreen").css("background-image", 'url("'+V.ImagesPath+'vicons/fullscreenback.png")');
		$("#page-fullscreen").css("background-position", "0px 0px");
		$("#page-fullscreen").hover(function(){
			$("#page-fullscreen").css("background-position", "-30px -40px");
		}, function() {
			$("#page-fullscreen").css("background-position", "0px 0px");
		});
	}

	var _onLeaveFullScreen = function(){
		$("#page-fullscreen").css("background-image", 'url("'+V.ImagesPath+'vicons/fullscreen.png")');
		$("#page-fullscreen").css("background-position", "0px 0px");
		$("#page-fullscreen").hover(function(){
			$("#page-fullscreen").css("background-position", "-40px -40px");
		}, function(){
			$("#page-fullscreen").css("background-position", "0px 0px");
		});
	};


	/*
	 * Wrapper for HTML5 FullScreen API. Make it cross-browser
	 */

	var _isDocInFullScreen = function(myDoc){
		if(typeof myDoc.mozFullScreen == "boolean"){
			return myDoc.mozFullScreen;
		} else if(typeof myDoc.webkitIsFullScreen == "boolean"){
			return myDoc.webkitIsFullScreen;
		} else {
			var fsElement = _getFsElement(myDoc);
			return ((typeof fsElement != "undefined")&&(fsElement!=null));
		}
	};

	var _getFsElement = function(myDoc){
		return myDoc.fullscreenElement || myDoc.mozFullScreenElement || myDoc.webkitFullscreenElement;
	};

	var _getFsEnabled = function(myDoc){
		return myDoc.fullscreenEnabled || myDoc.mozFullScreenEnabled || myDoc.webkitFullscreenEnabled;
	}

	var _launchFullscreenForElement = function(myDoc,element){
		if(element.requestFullscreen) {
			element.requestFullscreen();
		} else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			setTimeout(function(){
				if (!myDoc.webkitCurrentFullScreenElement){
					// Element.ALLOW_KEYBOARD_INPUT does not work, document is not in full screen mode
					//Fix known Safari bug
					element.webkitRequestFullScreen();
				}
			},250);
		} else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	};

	var _cancelFullscreen = function(myDoc) {
		if(myDoc.exitFullscreen) {
			myDoc.exitFullscreen();
		} else if(myDoc.cancelFullScreen) {
			myDoc.cancelFullScreen();
		} else if(myDoc.mozCancelFullScreen) {
			myDoc.mozCancelFullScreen();
		} else if(myDoc.webkitExitFullscreen) {
			myDoc.webkitExitFullscreen();
		} else if (myDoc.webkitCancelFullScreen) {
			myDoc.webkitCancelFullScreen();
		}
	};

	/* Check full screen support */
	var isFullScreenSupported = function(){
		var elem = document.createElement('div');
		if(elem && (elem.requestFullScreen || elem.mozRequestFullScreen || elem.webkitRequestFullScreen)){
			return true;
		} else {
			return false;
		}
	};

	return {
		init					: init,
		isFullScreenSupported	: isFullScreenSupported,
		canFullScreen 			: canFullScreen,
		enableFullScreen		: enableFullScreen,
		isFullScreen 			: isFullScreen,
		setFullScreen			: setFullScreen,
		onFullscreenEvent		: onFullscreenEvent
	};
    
}) (VISH, jQuery);