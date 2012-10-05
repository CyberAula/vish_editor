VISH.Status = (function(V,$,undefined){
	var device;
	var isInIframe;
	
	var init = function(){
		device = {};
		device.browser = {};
		device.features = {};
		fillBrowser();	
		fillUserAgent();
		fillFeatures();
	};
	
	var fillFeatures = function(){
		//To see if we are inside an iframe
		setIsInIframe((window.location != window.parent.location) ? true : false);
		// V.Debugging.log("We are in iframe: " + getIsInIframe());		
		
		//Fullscreen support
		var elem = document.getElementById("page-fullscreen");
		if(elem && (elem.requestFullScreen || elem.mozRequestFullScreen || elem.webkitRequestFullScreen)){
			if(!isInIframe){
				device.features.fullscreen = true;
			} else {
				//fullscreen supported by browser, let´s check that the iframe is the same domain as the vish_editor
				//and that we are not in preview in the editor (in that case we don't want fullscreen)
				try	{
					if((window.parent.location.host === window.location.host) && (!window.parent.VISH || !window.parent.VISH.Editor || !(typeof window.parent.VISH.Editor.Preview.getPreview === "function"))){
				    	device.features.fullscreen = true; 
					}
				} catch (e)	{
				    device.features.fullscreen = false;
				}
			}
		}
		
		//Touchscreen detection
		device.features.touchScreen = !!('ontouchstart' in window);


		// V.Debugging.log("We are in iframe: " + getIsInIframe());		
		// V.Debugging.log("Fullscreen supported: " + device.features.fullscreen);
		// V.Debugging.log("TouchScreen supported: " + device.features.touchScreen);
	};
	
	var fillUserAgent = function(){

		// Probe user agent string
		device.pixelRatio = window.devicePixelRatio || 1;
		device.viewport = {
			width: window.innerWidth,
			height: window.innerHeight
		};
		device.screen = {
			width: window.screen.availWidth * device.pixelRatio,
			height: window.screen.availHeight * device.pixelRatio
		};
		
		//Apple devices
		device.iPhone = /iPhone/i.test(navigator.userAgent);
		device.iPhone4 = (device.iPhone && device.pixelRatio == 2);
		device.iPad = /iPad/i.test(navigator.userAgent);
		device.iOS = device.iPhone || device.iPad;
		device.applePhone = device.iPhone || device.iPhone4;
		device.appleTablet = device.iPad;

		//Android devices
		device.android = /android/i.test(navigator.userAgent);
		if(device.android){
			device.androidPhone = false;
			device.androidTablet = false;

			//First intent: Look for Tablet in userAgent
			if(/tablet/i.test(navigator.userAgent)){
				device.androidTablet = true;
			} else {
				//Second intent: Check screen size

				//We will consider android tablets devices with a screen that are at least 960dp x 720dp
				//Taken from: http://developer.android.com/guide/practices/screens_support.html
				var maxWidth = 1024 * 1.5;
				var maxHeight = 720 * 1.5;

				var landscape = window.screen.availWidth > window.screen.availHeight;
				if(landscape){
					if((window.screen.availWidth>=maxWidth)&&(window.screen.availHeight)>=maxHeight){
						device.androidTablet = true;
					} else {
						device.androidPhone = true;
					}
				} else {
					if((window.screen.availHeight>=maxWidth)&&(window.screen.availWidth)>=maxHeight){
						device.androidTablet = true;
					} else {
						device.androidPhone = true;
					}
				}
			}

		} else {
			device.androidPhone = false;
			device.androidTablet = false;
		}

		//Phones and Tablets
		device.mobile = device.applePhone || device.androidPhone;
		device.tablet = device.appleTablet || device.androidTablet;

		if((!device.mobile)&&(!device.tablet)){
			device.desktop = true;
		} else {
			device.desktop = false;
		}

		 // V.Debugging.log("isMobile " + device.mobile);
		 // V.Debugging.log("isTablet: " + device.tablet);
		 // V.Debugging.log("Screen width: " + device.screen.width);
		 // V.Debugging.log("Screen height: " + device.screen.height);
		// V.Debugging.log("Visdevicel Viewport width: " + device.viewport.width);
		// V.Debugging.log("Visdevicel Viewport height: " + device.viewport.height);
		// V.Debugging.log("Layout Viewport width: " + document.documentElement.clientWidth);
		// V.Debugging.log("Layout Viewport height: " + document.documentElement.clientHeight);
		// V.Debugging.log("HTML element width: " +  document.documentElement.offsetWidth);
		// V.Debugging.log("HTML element height: " +  document.documentElement.offsetHeight);
		// V.Debugging.log("window.screen.availWidth: " + window.screen.availWidth);
		// V.Debugging.log("window.screen.availHeight: " + window.screen.availHeight);

		 // alert("isMobile " + device.mobile);
		 // alert("isTablet: " + device.tablet);
		 // alert("Screen width: " + device.screen.width);
		 // alert("Screen height: " + device.screen.height);
		 // alert("Visdevicel Viewport width: " + device.viewport.width);
		 // alert("Visdevicel Viewport height: " + device.viewport.height);
		 // alert("Layout Viewport width: " + document.documentElement.clientWidth);
		 // alert("window.screen.availWidth: " + window.screen.availWidth);

	};

	var fillBrowser = function(){
		var version;

		version = _getInternetExplorerVersion();
		if(version!=-1){
			device.browser.name = VISH.Constant.IE;
			device.browser.version = version;
			return;
		}

		version = _getFirefoxVersion();
		if(version!=-1){
			device.browser.name = VISH.Constant.FIREFOX;
			device.browser.version = version;
			return;
		}

		version = _getGoogleChromeVersion();
		if(version!=-1){
			device.browser.name = VISH.Constant.CHROME;
			device.browser.version = version;
			return;
		}

		//No browser founded
		device.browser.name = VISH.Constant.UNKNOWN;
		device.browser.name = -1;
	}

	var _getInternetExplorerVersion = function() {
		var rv = -1; //No explorer
		if (navigator.appName === VISH.Constant.UA_IE) {
			var ua = navigator.userAgent;
			var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null){
				rv = parseFloat(RegExp.$1);
			} 
		}
		return rv;
	}
			
	var _getFirefoxVersion = function() {
      var rv = -1; //No firefox
      if (navigator.appName === VISH.Constant.UA_NETSCAPE) {
          var ua = navigator.userAgent;
          var re = new RegExp(".* Firefox/([0-9.]+)");
          if (re.exec(ua) != null){
           	rv = parseFloat(RegExp.$1);
          } 
      }
      return rv;
    }

	var _getGoogleChromeVersion = function() {
      var rv = -1; //No Google Chrome
      if (navigator.appName === VISH.Constant.UA_NETSCAPE) {
          var ua = navigator.userAgent;
          var re = new RegExp(".* Chrome/([0-9.]+)");
           if (re.exec(ua) != null){
           	rv = parseFloat(RegExp.$1);
           }
      }
      return rv;
    }
	
	var getIsInIframe = function(){
		return isInIframe;
	};
	
	var setIsInIframe = function(isIframe){
		isInIframe = isIframe;
	};

	var getIframe = function(){
		if(isInIframe){
			return window.frameElement;
		} else {
			return null;
		}
	};

	var getDevice = function(){
		return device;
	}
	
	return {
		init            : init,
		getIsInIframe	: getIsInIframe,
		getIframe   	: getIframe,
		getDevice		: getDevice
	};

}) (VISH, jQuery);
