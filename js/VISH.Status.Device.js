VISH.Status.Device = (function(V,$,undefined){
	
	var init = function(callback){
		V.Status.Device.Browser.init();
		V.Status.Device.Features.init();
		_fillDevice(callback);
	};

	var _fillDevice = function(callback){
		//Look device in the cache
		var storedDevice = V.Storage.get(V.Constant.Storage.Device);
		// var storedDevice = undefined;
		
		if(typeof storedDevice != "undefined"){
			device = storedDevice;
			_loadViewportForDevice(device,function(){
				fillScreen(device); //Update screen	
				if(typeof callback === "function"){
					callback(device);
				}
			});
			return;
		}

		//No device in the cache
		//Categorize it
		var device = {};
		device.browser = {};
		device.features = {};

		device.browser = V.Status.Device.Browser.fillBrowser();
		_fillUserAgentBeforeViewport(device);
		_loadViewportForDevice(device,function(){
			//On viewport loaded
			_fillUserAgentAfterViewport(device);
			fillScreen(device);
			device.features = V.Status.Device.Features.fillFeatures(device.browser);

			//Store device
			V.Storage.add(V.Constant.Storage.Device,device,false);

			//Fix for Android Browsers
			if((device.android)&&(device.browser.name===V.Constant.ANDROID_BROWSER)){
				if((device.hasTestingViewport===true)&&(V.Storage.isSupported())){
					//We need to reload the page with the real viewport
					_reloadOnAndroidTestingViewport(callback,device);
					return;
				}
			}

			if(typeof callback === "function"){
				callback(device);
			}
		});
	}

	var _reloadOnAndroidTestingViewport = function(callback,device){
		var attempts = 0;
		var maxAttempts = 3;

		//Ensure that the device has been stored
		var initialDevice = V.Storage.get(V.Constant.Storage.Device);
		if(typeof storedDevice !== "undefined"){
			location.reload(true);
			return;
		}

		//Wait with a timer
		var waitTimer = setInterval(function(){
			var storedDevice = V.Storage.get(V.Constant.Storage.Device);
			if(typeof storedDevice !== "undefined"){
				clearInterval(waitTimer);
				location.reload(true);
			} else {
				attempts++;
				if(attempts>=maxAttempts){
					clearInterval(waitTimer);
					callback(device);
				}
			}
		},1000);
	};

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
	};

	var _loadViewportForDevice = function(device,callback){
		if((device.iOS)&&(device.browser.name===V.Constant.SAFARI)){
			_setViewportForIphone(callback);
		} else if(device.android){
			if(device.browser.name===V.Constant.CHROME){
				_setViewportForChromeForAndroid(callback);
			} else if(device.browser.name===V.Constant.ANDROID_BROWSER){
				/*
				 * Some magic to fix android browser bug
				 * 1. If no device information, load "testing" viewport to get and store it
				 * Then, page will be reloaded with device information stored.
				 * 2. If device information exists, load "real"/"functional" viewport.
				 *
				 * We need to do this, because with "real" viewport we can't access to screen dimensions
				 * in a reliable way in order to differenciate between android smartphones and tablets.
				 * Also, "testing" viewport is not valid because Android browser has a crucial bug related to iframe loading.
				 * Changing the viewport "on fly" not work in all devices. So, we need to reload the page.
				 * Since LocalStorage is supported in all Android Browsers, this is a cross-device solution.
				 * http://caniuse.com/namevalue-storage
				 */

				 //device.desktop===undefined means that isn't a stored device
				if(typeof device.desktop === "undefined"){
					device.hasTestingViewport = true; //Indicate that the viewport is only for testing
					_setTestingViewportForAndroidBrowser(callback);
				} else {
					 //Some tablets presents unreliable behaviours when viewport is loaded dinamically
					 //In iframe there are no problems...
					 //In addition, we need a server functionality (require Vish)
					 //Currently disabled

					 // if((device.tablet)&&(!V.Status.getIsInIframe())&&((V.Utils.getOptions().configuration.mode===V.Constant.VISH))){
					 // 	//Is already loaded the static viewport?
					 // 	//Look in URL params and options
					 // 	if((V.Utils.getOptions().staticViewport)||(V.Utils.getParamsFromUrl(window.location.href).hasOwnProperty("viewport"))){
					 // 		callback();
					 // 	} else {
						//  	var url = V.Utils.addParamToUrl(window.location.href,"viewport","A");  
						// 	window.location.href = url;
					 // 	}
					 // 	return;
					 // }

					_setViewportForAndroidBrowser(callback);
				}
			}
		} else {
			if(typeof callback === "function"){
				callback();
			}
		}
	};

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
	};

	var _setViewportForAndroidBrowser = function(callback){
		//We cant specify width=device-width due to a iframe loading bug.
		//It can't be solved
		_setViewport("user-scalable=yes",callback);
	};

	var _setTestingViewportForAndroidBrowser = function(callback){
		_setViewport("width=device-width,height=device-height,user-scalable=yes",callback);
	};

	var _setViewportForChromeForAndroid = function(callback){
		_setViewport("width=device-width,height=device-height,user-scalable=yes",callback);
	}

	var _setViewportForIphone = function(callback){
		_setViewport("user-scalable=yes",callback);
	};

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
		// device.mobile = false;
		// device.tablet = true;

		//Force Android with Android Native Browser
		// device.android = true;
		// device.browser.name = V.Constant.ANDROID_BROWSER;

		// if(device.mobile){
		// 	alert("mobile");
		// } else if(device.tablet){
		// 	alert("tablet");
		// } else if(device.desktop){
		// 	alert("desktop");
		// }

		//Add extra device information (useful for the tracking system)
		if(typeof navigator == "object"){
			device.userAgent = navigator.userAgent;
			device.appName = navigator.appName;
			device.appVersion = navigator.appVersion;
			device.platform = navigator.platform;
			device.language = navigator.language;
		}
	};

	/*
	 * Must be called after viewport is loaded
	 */
	var fillScreen = function(device){
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

		return device;
	};

	return {
		init  		: init,
		fillScreen	: fillScreen
	};

}) (VISH, jQuery);
