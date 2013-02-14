VISH.Status.Device.Features = (function(V,$,undefined){
	
	var init = function(){
	};

	var fillFeatures = function(){
		var features = {};

		//Fullscreen support
		var elem = document.getElementById("page-fullscreen");
		if(elem && (elem.requestFullScreen || elem.mozRequestFullScreen || elem.webkitRequestFullScreen)){
			if(!V.Status.getIsInIframe()){
				features.fullscreen = true;
			} else {
				//fullscreen supported by browser, let´s check that the iframe is the same domain as the vish_editor
				//and that we are not in preview in the editor (in that case we don't want fullscreen)
				try	{
					if((window.parent.location.host === window.location.host) && (!window.parent.VISH || !window.parent.VISH.Editor || !(typeof window.parent.VISH.Editor.Preview.getPreview === "function"))){
				    	features.fullscreen = true; 
					}
				} catch (e)	{
				    features.fullscreen = false;
				}
			}
		}
		
		//Touchscreen detection
		features.touchScreen = !!('ontouchstart' in window);

		//LocalStorage detection
		features.localStorage = V.Storage.checkLocalStorageSupport();

		//Session management
		features.history = (typeof history === "object")&&(typeof history.back === "function")&&(typeof history.go === "function");

		return features;
	};
	
	return {
		init            		: init,
		fillFeatures 			: fillFeatures
	};

}) (VISH, jQuery);
