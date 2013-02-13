VISH.Status.Device = (function(V,$,undefined){
	
	var init = function(callback){
		V.Status.Device.Browser.init();
		V.Status.Device.Features.init();
		_fillDevice(callback);
	};

	var _fillDevice = function(callback){
		var device = {};
		device.browser = {};
		device.features = {};

		device.browser = V.Status.Device.Browser.fillBrowser();
		_fillUserAgentBeforeViewport(device);
		_loadViewportForDevice(device,function(){
			//On viewport loaded
			_fillUserAgentAfterViewport(device);
			_fillScreen(device);
			device.features = V.Status.Device.Features.fillFeatures();
			if(typeof callback === "function"){
				callback(device);
			}
		});
	}

	var _fillUserAgentBeforeViewport = function(device){
		device.pixelRatio = window.devicePixelRatio || 1;
		
		//Apple devices
		device.iPhone = /iPhone/i.test(navigator.userAgent);
		device.iPhone4 = (device.iPhone && device.pixelRatio == 2);
		device.iPad = /iPad/i.test(navigator.userAgent);
		device.iOS = device.iPhone || device.iPad;
		device.applePhone = device.iPhone || device.iPhone4;
		device.appleTablet = device.iPad;

		//Android devices
		device.android = /android/i.test(navigator.userAgent);
	}

	var _loadViewportForDevice = function(device,callback){
		if((device.iOS)&&(device.browser.name===V.Constant.SAFARI)){
			_setViewportForIphone(callback);
		} else if(device.android){
			if(device.browser.name===V.Constant.CHROME){
				_setViewportForChromeForAndroid(callback);
			} else if(device.browser.name===VISH.Constant.ANDROID_BROWSER){
				_setViewportForAndroidBrowser(callback);
			}
		} else {
			if(typeof callback === "function"){
				callback();
			}
		}
	}

	//////////////
	// VIEWPORT
	//////////////

	var WAITING_TIME_FOR_VIEWPORT_LOAD = 1250;

	/*
	 * Take a look at meta viewport browser compatibility
	 * http://www.quirksmode.org/mobile/tableViewport.html#metaviewport
	 *
	 * Totally remove viewport is not supported in Safari or Android browsers
	 * Change its content "on fly" fails in some devices.
	 * So, its preferable to load an initial suitable viewport according to the specific device
	 */
	var _setViewport = function(viewportContent,callback){
		var viewport = $("head>meta[name='viewport']");
		if(viewport.length===0){
			//Insert viewport
			$("head").prepend('<meta name="viewport" content="'+viewportContent+'"/>');
		} else {
			//Change viewport
			$(viewport).attr("content",viewportContent);
		}
		setTimeout(function(){
			if(typeof callback === "function"){
				callback();
			}
		},WAITING_TIME_FOR_VIEWPORT_LOAD);
	}

	var _setViewportForAndroidBrowser = function(callback){
		//We cant specify width=device-width due to a iframe loading bug.
		//It can't be solved
		_setViewport("user-scalable=yes",callback);
	}

	var _setViewportForChromeForAndroid = function(callback){
		_setViewport("width=device-width,height=device-height,user-scalable=yes",callback);
	}

	var _setViewportForIphone = function(callback){
		_setViewport("user-scalable=yes",callback);
	}

	var _fillUserAgentAfterViewport = function(device){
		//Android devices
		//Differentiate between phones and tablets
		device.androidPhone = false;
		device.androidTablet = false;
		
		if(device.android){
			// There are phones that don't include "mobile" in the UA string, and tablets that do.
			// However, if UA contains tablet, it's a tablet.

			//First intent: Look for Tablet in userAgent
			if(/tablet/i.test(navigator.userAgent)){
				device.androidTablet = true;
			} else {
				//Second intent: Check screen size

				//We will consider android tablets devices with a screen that are at least 960dp x 720dp (in landscape)
				//Taken from: http://developer.android.com/guide/practices/screens_support.html
				var maxWidth = 960 * device.pixelRatio;
				var maxHeight = 720 * device.pixelRatio;

				if(device.browser.name===V.Constant.ANDROID_BROWSER){
					//Fix Viewport bug
					//With android browser the width can't be specified in the viewport.
					//So, width in portrait and width in landscape are unreliable values.
			
					//Overwrite maxWidth
					maxWidth = 1101 * device.pixelRatio;

					var landscape = window.screen.availWidth > window.screen.availHeight;
					if(landscape){
						if(window.screen.availHeight>=maxHeight){
							device.androidTablet = true;
						} else {
							device.androidPhone = true;
						}
					} else {
						if(window.screen.availHeight>=maxWidth){
							device.androidTablet = true;
						} else {
							device.androidPhone = true;
						}
					}
				} else {
					// Reliable detection (just for Chrome for Android)
					var landscape = window.screen.availWidth > window.screen.availHeight;
					if(landscape){
						if((window.screen.availWidth>=maxWidth)&&(window.screen.availHeight)>=maxHeight){
							device.androidTablet = true;
						} else {
							device.androidPhone = true;
						}
					} else {
						if((window.screen.availWidth>=maxHeight)&&(window.screen.availHeight)>=maxWidth){
							device.androidTablet = true;
						} else {
							device.androidPhone = true;
						}
					}
				}
			}
		}

		//Phones and Tablets
		device.mobile = device.applePhone || device.androidPhone;
		device.tablet = device.appleTablet || device.androidTablet;

		if((!device.mobile)&&(!device.tablet)){
			device.desktop = true;
		} else {
			device.desktop = false;
		}

		 // Force mobile or tablet
		 // device.desktop = false;
		 // device.mobile = true;
		 // device.tablet = false;

		 // if(device.mobile){
		 // 	alert("mobile");
		 // } else if(device.tablet){
		 // 	alert("tablet");
		 // } else if(device.desktop){
		 // 	alert("desktop");
		 // }
	};

	/*
	 * Must be called after viewport is loaded
	 */
	var _fillScreen = function(device){
		device.viewport = {
			width: window.innerWidth,
			height: window.innerHeight
		};
		device.screen = {
			rWidth: window.screen.availWidth * device.pixelRatio,
			rHeight: window.screen.availHeight * device.pixelRatio,
			width: window.screen.availWidth,
			height: window.screen.availHeight
		};
	}

	return {
		init            : init
	};

}) (VISH, jQuery);
