VISH.Status = (function(V,$,undefined){
	var _device;

	//In an iframe or not
	var _isInIframe;
	//In the same domain (no iframe or embed in the same domain) or not
	var _isAnotherDomain;

	//Online or offline
	var _isOnline;

	//Preview
	var _is_preview;
	var _is_preview_insertMode;

	//SCORM Package (same domain but external site)
	var _scorm;

	//External or Internal site
	var _isInExternalSite;
	var _isInVishSite;
	var _isLocalFile;

	//Uniq mode (to show only one slide of an excursion)
	var _uniqMode;

	//Mode
	var _isSlave;
	var _isPreventDefault;

	//Focus management
	var _isVEFocused;
	var _isWindowFocused;
	var _isCKEditorInstanceFocused;
	
	var init = function(callback){
		_checkIframe();
		_checkDomain();
		_checkSite();
		_checkPreview();
		_checkUniqMode();
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
	};

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
	};

   /*
	* Use to see if we are inside an iframe
	*/
	var _checkSite = function(){
		var options = V.Utils.getOptions();

		//SCORM package
		if(typeof options["scorm"] == "boolean"){
			_scorm = options["scorm"];
		} else {
			_scorm = false;
		}

		if(!_isAnotherDomain){
			_isLocalFile = (window.top.location.href.indexOf("file://")===0);
		} else {
			_isLocalFile = false;
		}
		
		_isInExternalSite = ((_isAnotherDomain)||(_scorm));
		_isInVishSite = ((!_isInExternalSite)&&(V.Configuration.getConfiguration()["mode"]===V.Constant.VISH));
	};

	var _checkPreview = function(){
		var options = V.Utils.getOptions();

		if(typeof options["preview"] == "boolean"){
			_is_preview = options["preview"];
		} else {
			_is_preview = false;
		}

		_is_preview_insertMode = false;
		if(_is_preview){
			var presentation = V.Viewer.getCurrentPresentation();
			if(presentation.insertMode===true){
				_is_preview_insertMode = true;
			}
		}
	};

	var _checkUniqMode = function(){
		var hashParams = V.Utils.getHashParams();
		if(hashParams["uniq"] === "true"){
			_uniqMode = true;
		} else {
			_uniqMode = false;
		}
	};

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

				if(_isLocalFile){
					var img = $("<img style='display:none' src='"+ V.ImagesPath + "blank.gif" + "' />");
					$(img).load(function(response){
						_isOnline = true;
					});
					$(img).error(function(response){
						_isOnline = false;
					});
					$("section.slides").append(img);

					//By default assume online
					_isOnline = true;
					return;
				};

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

	var getIsScorm = function(){
		return _scorm;
	};

	var getIsLocalFile = function(){
		return _isLocalFile;
	}

	var getIsInExternalSite = function(){
		return _isInExternalSite;
	};

	var getIsInVishSite = function(){
		return _isInVishSite;
	};

	var getIsPreview = function(){
		return _is_preview;
	};

	var getIsPreviewInsertMode = function(){
		return _is_preview_insertMode;
	};

	var getIsUniqMode = function(){
		return _uniqMode;
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
		getIsScorm					: getIsScorm,
		getIsInExternalSite			: getIsInExternalSite,
		getIsInVishSite				: getIsInVishSite,
		getIsPreview 				: getIsPreview,
		getIsPreviewInsertMode		: getIsPreviewInsertMode,
		getIsUniqMode				: getIsUniqMode,
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
