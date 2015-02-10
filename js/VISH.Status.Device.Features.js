VISH.Status.Device.Features = (function(V,$,undefined){
	
	var init = function(){
	};

	var fillFeatures = function(browser){
		var features = {};

		//Fullscreen support
		features.fullscreen = V.FullScreen.isFullScreenSupported();
		
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

		//Iframe sandbox
		features.sandbox = "sandbox" in document.createElement("iframe");

		//PDF native reader
		features.pdfReader = false;
		if((typeof navigator.mimeTypes == "object")&&("application/pdf" in navigator.mimeTypes)){
			features.pdfReader = true;
		}

		//Support for CSS3 3D Transforms (feature detection based on browser: http://caniuse.com/#feat=transforms3d)
		features.css3d = false;
		if(((browser.name===V.Constant.CHROME)&&(browser.version>12))||((browser.name===V.Constant.FIREFOX)&&(browser.version>16))||((browser.name===V.Constant.SAFARI)&&(browser.version>4))){
			features.css3d = true;
		}

		return features;
	};
	
	return {
		init            		: init,
		fillFeatures 			: fillFeatures
	};

}) (VISH, jQuery);
