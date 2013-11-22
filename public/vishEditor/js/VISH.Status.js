VISH.Status = (function(V,$,undefined){
	var _device;
	var _isInIframe;
	var _isAnotherDomain;
	var _isOnline;
	var _isSlave;
	var _isPreventDefault;

	//Focus management
	var _isVEFocused;
	var _isWindowFocused;
	var _isCKEditorInstanceFocused;
	
	var init = function(callback){
		_checkIframe();
		_checkDomain();
		_isVEFocused = false;
		_isWindowFocused = false;
		_isCKEditorInstanceFocused = false;

		V.Status.Device.init(function(returnedDevice){
			//Device and its viewport loaded
			_device = returnedDevice;

			_checkOnline();

			if(typeof callback === "function"){
				callback();
			}
		});
	};

   /*
	* Use to see if we are inside an iframe
	*/
	var _checkIframe = function(){
		_isInIframe = ((window.location != window.parent.location) ? true : false);
		return _isInIframe;
	}

   /*
	* Use to see if we are embeded in another domain
	*/
	var _checkDomain = function(){
		_isAnotherDomain = false;

		if(_checkIframe()){
			try {
				var parent = window.parent;
				while(parent!=window.top){
					if(typeof parent.location.href === "undefined"){
						_isAnotherDomain = true;
						break;
					} else {
						parent = parent.parent;
					}
				}

				if(typeof window.top.location.href === "undefined"){
					_isAnotherDomain = true;
				}
			} catch(e) {
				_isAnotherDomain = true;
			}
		}

		return _isAnotherDomain;
	}


	/*
	 * This function is done like this because navigator.online lies
	 */
	var _checkOnline = function(){	
		//uncomment when navigator.online works,
		//even if it works in all browsers we can remove the ajax call
		//but now (10-2012) it gives false positive and false negative and it can´t be used
		//if (navigator.onLine) {
		        // Check to see if we are really online by making a call for a static JSON resource on
		        // the originating Web site. If we can get to it, we're online. If not, assume we're
		        // offline.
		        $.ajax({
		            async: true,
		            cache: false,
		            error: function (req, status, ex) {
		                V.Debugging.log("Error: " + ex);
		                // We might not be technically "offline" if the error is not a timeout, but
		                // otherwise we're getting some sort of error when we shouldn't, so we're
		                // going to treat it as if we're offline.
		                // Note: This might not be totally correct if the error is because the
		                // manifest is ill-formed.
		                _isOnline = false;
		            },
		            success: function (data, status, req) {
		                _isOnline = true;
		            },
		            timeout: 5000,
		            type: "GET",
		            url: V.ImagesPath+"blank.gif"
		        });
		    //}
		    //else {
		    //    _isOnline = false;
		    //}		
	};
	

	//////////////////////////
	// Getters and Setters
	//////////////////////////

	var getDevice = function(){
		return _device;
	};

	var getIsEmbed = function(){
		return _isAnotherDomain;
	};

	var getIsInIframe = function(){
		return _isInIframe;
	};

	var getIframe = function(){
		if((_isInIframe)&&(!_isAnotherDomain)){
			return window.frameElement;
		} else {
			return null;
		}
	};

	var isOnline = function(){
		return _isOnline;
	};

	var isSlaveMode = function(){
		if(typeof _isSlave!=='undefined'){
			return _isSlave;
		} else {
			return false;
		}
	};

	var setSlaveMode = function(slaveMode){
		if(slaveMode!==_isSlave){
			if(slaveMode===true){
				V.Events.unbindViewerEventListeners();
				V.VideoPlayer.HTML5.showControls(false);
				_isSlave=true;
			} else {
				V.Events.bindViewerEventListeners();
				V.VideoPlayer.HTML5.showControls(true);
				_isSlave=false;
			}
		}
	};

	var isPreventDefaultMode = function(){
		if(typeof _isPreventDefault !=='undefined'){
			return _isPreventDefault;
		} else {
			return false;
		}
	};

	var setPreventDefaultMode = function(preventDefault){
		if(preventDefault!==_isPreventDefault){
			if(preventDefault===true){
				_isPreventDefault=true;
			} else {
				_isPreventDefault=false;
			}
		}
	};

	var setWindowFocus = function(focus){
		if(typeof focus == "boolean"){
			_isWindowFocused = focus;
			_updateFocus(!focus);
		}
	};

	var setCKEditorInstanceFocused = function(focus){
		if(typeof focus == "boolean"){
			_isCKEditorInstanceFocused = focus;
			_updateFocus(!focus);
		}
	};

	var _updateFocus = function(delayUpdate){
		if(delayUpdate===true){
			setTimeout(function(){
				_updateFocus();
			},100);
			return;
		}
		var updatedFocus = ((_isWindowFocused)||(_isCKEditorInstanceFocused));
		
		if(updatedFocus!=_isVEFocused){
			_isVEFocused = updatedFocus;
			var params = new Object();
			params.focus = updatedFocus;
			V.EventsNotifier.notifyEvent(V.Constant.Event.onVEFocusChange,params);
		}
	};

	var isVEFocused = function(){
		return _isVEFocused;
	};


	return {
		init						: init,
		getDevice					: getDevice,
		getIsEmbed 					: getIsEmbed,
		getIsInIframe				: getIsInIframe,
		getIframe					: getIframe,
		isOnline 					: isOnline,
		isSlaveMode 				: isSlaveMode,
		setSlaveMode				: setSlaveMode,
		isPreventDefaultMode 		: isPreventDefaultMode,
		setPreventDefaultMode 		: setPreventDefaultMode,
		setWindowFocus				: setWindowFocus,
		setCKEditorInstanceFocused	: setCKEditorInstanceFocused,
		isVEFocused 				: isVEFocused
	};

}) (VISH, jQuery);
