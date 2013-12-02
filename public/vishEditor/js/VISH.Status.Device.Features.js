VISH.Status.Device.Features = (function(V,$,undefined){
	
	var init = function(){
	};

	var fillFeatures = function(){
		var features = {};

		//Fullscreen support
		var elem = document.createElement('div');
		if(elem && (elem.requestFullScreen || elem.mozRequestFullScreen || elem.webkitRequestFullScreen)){
			features.fullscreen = true;
		} else {
			features.fullscreen = false;
		}
		
		//Touchscreen detection
		features.touchScreen = !!('ontouchstart' in window);

		//LocalStorage detection
		features.localStorage = V.Storage.checkLocalStorageSupport();

		//Session management
		features.history = ((typeof history === "object")&&(typeof history.back === "function")&&(typeof history.go === "function"));

		if((features.history)&&(typeof history.pushState == "function")){
			features.historypushState = true;
		} else {
			features.historypushState = false;
		}

		//FileReader API
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			features.reader = true;
		} else {
			features.reader = false;
		}

		return features;
	};
	
	return {
		init            		: init,
		fillFeatures 			: fillFeatures
	};

}) (VISH, jQuery);
