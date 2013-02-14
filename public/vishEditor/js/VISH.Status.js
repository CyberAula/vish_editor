VISH.Status = (function(V,$,undefined){
	var _device;
	var _isInIframe;
	var _isEmbed;
	var _isOnline;
	var _isSlave;
	var _isPreventDefault;
	
	var init = function(callback){
		VISH.Status.Device.init(function(returnedDevice){
			//Device and its viewport loaded
			_device = returnedDevice;

			_checkIframe();
			_checkEmbed();
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
	}

   /*
	* Use to see if we are in embed mode
	*/
	var _checkEmbed = function(){
		_isEmbed = (V.Utils.getOptions()["embed"]===true);
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
		                VISH.Debugging.log("Error: " + ex);
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
		            url: VISH.ImagesPath+"blank.gif"
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
		return _isEmbed;
	};

	var getIsInIframe = function(){
		return _isInIframe;
	};

	var getIframe = function(){
		if(_isInIframe){
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
				VISH.Events.unbindViewerEventListeners();
				VISH.VideoPlayer.HTML5.showControls(false);
				_isSlave=true;
			} else {
				VISH.Events.bindViewerEventListeners();
				VISH.VideoPlayer.HTML5.showControls(true);
				_isSlave=false;
			}
		}
	}

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
	}


	return {
		init					: init,
		getDevice				: getDevice,
		getIsEmbed				: getIsEmbed,
		getIsInIframe			: getIsInIframe,
		getIframe				: getIframe,
		isOnline 				: isOnline,
		isSlaveMode 			: isSlaveMode,
		setSlaveMode			: setSlaveMode,
		isPreventDefaultMode 	: isPreventDefaultMode,
		setPreventDefaultMode 	: setPreventDefaultMode
	};

}) (VISH, jQuery);
