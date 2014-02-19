/* 
 * Enable FullScreen for ViSH Viewer
 * IE documentation: http://msdn.microsoft.com/en-us/library/ie/dn265028(v=vs.85).aspx
 */

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
		//Defaults
		_pageIsFullScreen = false;
		_enterFsButton = false;
		_exitFsButton = false;
		_fallbackFs = false;

		// If FullScreen native support is not available try to use fallback options
		// Fallback is not possible in embeds...
		if((!_canUseNativeFs())&&(!V.Status.getIsEmbed())){

			var options = V.Utils.getOptions();
			if((options)&&(typeof options["fullScreenFallback"] == "object")){
				
				_enterFsButton = (V.Status.getIsInIframe())&&(typeof options["fullScreenFallback"]["enterFullscreenURL"] == "string");
				if(_enterFsButton){
					_enterFsUrl = options["fullScreenFallback"]["enterFullscreenURL"];
				}
				_exitFsButton = (!V.Status.getIsInIframe())&&(typeof options["fullScreenFallback"]["exitFullscreenURL"] == "string");
				if(_exitFsButton){
					_exitFsUrl = options["fullScreenFallback"]["exitFullscreenURL"];
				}

				if(V.Status.getIsInIframe()){
					_fallbackFs = _enterFsButton;
				} else {			
					_fallbackFs = _exitFsButton;
					_pageIsFullScreen = true;
				}
			}
		}

		_updateFsButtons();
	};

	var canFullScreen = function(){
		return (_canUseNativeFs())||(_fallbackFs);
	};

	var _canUseNativeFs = function(){
		return (V.Status.getDevice().features.fullscreen)&&(_getFsEnabled(document));
	};

	var isFullScreen  = function(){
		return _pageIsFullScreen;
	};

	var _setFullScreen = function(page_is_fullscreen){
		_pageIsFullScreen = page_is_fullscreen;
	};

	var enableFullScreen = function(){
		if(_canUseNativeFs()){
			//if we have Native FullScreen feature, use it
			$(document).on('click', '#page-fullscreen', _toggleFullScreen);
			$(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange",function(event){
				//Give some time...
				setTimeout(function(){
					_pageIsFullScreen = !_pageIsFullScreen;
					_updateFsButtons();
					V.ViewerAdapter.updateInterface();
				}, 400);
			});
		} else if(_fallbackFs) {
			//Use FullScreen fallback
			if((_pageIsFullScreen)&&(_exitFsButton)){
				$(document).on('click', '#page-fullscreen', function(){
					window.location = V.Utils.removeHashFromUrlString(_exitFsUrl) + '#' + V.Slides.getCurrentSlideNumber();
				});
			} else if((!_pageIsFullScreen)&&(_enterFsButton)){
				$(document).on('click', '#page-fullscreen', function(){
					V.Utils.sendParentToURL(V.Utils.removeHashFromUrlString(_enterFsUrl) + "?orgUrl="+V.Utils.removeHashFromUrlString(window.parent.location.href) + '#' + V.Slides.getCurrentSlideNumber());
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

	var exitFromNativeFullScreen = function(){
		if((_canUseNativeFs())&&(_isDocInFullScreen(document))){
			_toggleFullScreen();
		}
	};

	var _updateFsButtons = function(){
		if(_pageIsFullScreen){
			_enableFsEnterButon();
		} else {
			_enableFsLeaveButon();
		}
	};

	var _enableFsEnterButon = function(){
		$("#page-fullscreen").removeClass("fsoff").addClass("fson");
	};

	var _enableFsLeaveButon = function(){
		$("#page-fullscreen").removeClass("fson").addClass("fsoff");
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
		return myDoc.fullscreenElement || myDoc.mozFullScreenElement || myDoc.webkitFullscreenElement || myDoc.msFullscreenElement;
	};

	var _getFsEnabled = function(myDoc){
		return myDoc.fullscreenEnabled || myDoc.mozFullScreenEnabled || myDoc.webkitFullscreenEnabled || myDoc.msFullscreenEnabled;
	};

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
		} else if(myDoc.msExitFullscreen) {
			myDoc.msExitFullscreen();
		}
	};

	/* Check full screen support */
	var isFullScreenSupported = function(){
		var elem = document.createElement('div');
		if(elem && (elem.requestFullScreen || elem.mozRequestFullScreen || elem.webkitRequestFullScreen || elem.msRequestFullscreen)){
			return true;
		} else {
			return false;
		}
	};

	return {
		init						: init,
		isFullScreenSupported		: isFullScreenSupported,
		canFullScreen 				: canFullScreen,
		enableFullScreen			: enableFullScreen,
		isFullScreen 				: isFullScreen,
		exitFromNativeFullScreen	: exitFromNativeFullScreen
	};
    
}) (VISH, jQuery);