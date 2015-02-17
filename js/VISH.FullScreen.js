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
		if(!V.Editing){
			return ((_canUseNativeFs())||(_fallbackFs));
		} else {
			return ((false)&&(_canUseNativeFs())&&(V.Status.getDevice().features.css3d));
		}
	};

	var _canUseNativeFs = function(){
		return (V.Status.getDevice().features.fullscreen)&&(_getFsEnabled());
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
					if(isSomeElementInFullScreen()){
						//Prevent VV to be resized when a element enters in fullscreen.
						return;
					}
					_pageIsFullScreen = !_pageIsFullScreen;
					_updateFsButtons();
					if(!V.Editing){
						V.ViewerAdapter.updateInterface();
					} else {
						V.Editor.ViewerAdapter.updateInterface();
					}
				}, 400);
			});
		} else if((_fallbackFs)&&(!V.Editing)) {
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

		if(!_isDocumentFullScreen()){
			_launchFullscreenForElement(document.documentElement);
		} else {
			_cancelFullscreen();
		}
	};

	var exitFromNativeFullScreen = function(){
		if((_canUseNativeFs())&&(_isDocumentFullScreen())){
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
	 var _isBrowserInFullScreen = function(){
	 	var fsElement = _getFsElement();
		return ((typeof fsElement !== "undefined")&&(fsElement !== null));
	};

	/* To test if the application is in fullscreen */
	var _isDocumentFullScreen = function(){
		return $(_getFsElement()).is("html");
	};

	var isSomeElementInFullScreen = function(){
		return (_isBrowserInFullScreen()&&!_isDocumentFullScreen());
	};

	var _isElementInFullScreen = function(elem){
		return ((typeof elem !== "undefined")&&(elem !== null)&&(elem===_getFsElement()));
	};

	var _getFsElement = function(){
		return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
	};

	var _getFsEnabled = function(){
		return document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;
	};

	var _launchFullscreenForElement = function(element){
		if(element.requestFullscreen) {
			element.requestFullscreen();
		} else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			setTimeout(function(){
				if (!document.webkitCurrentFullScreenElement){
					// Element.ALLOW_KEYBOARD_INPUT does not work, document is not in full screen mode
					//Fix known Safari bug
					element.webkitRequestFullScreen();
				}
			},250);
		} else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	};

	var _cancelFullscreen = function() {
		_cancelFullscreenForElement(document)
	};

	var _cancelFullscreenForElement = function(elem) {
		if(elem.exitFullscreen) {
			elem.exitFullscreen();
		} else if(elem.cancelFullScreen) {
			elem.cancelFullScreen();
		} else if(elem.mozCancelFullScreen) {
			elem.mozCancelFullScreen();
		} else if(elem.webkitExitFullscreen) {
			elem.webkitExitFullscreen();
		} else if (elem.webkitCancelFullScreen) {
			elem.webkitCancelFullScreen();
		} else if(elem.msExitFullscreen) {
			elem.msExitFullscreen();
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
		isSomeElementInFullScreen	: isSomeElementInFullScreen,
		exitFromNativeFullScreen	: exitFromNativeFullScreen
	};
    
}) (VISH, jQuery);