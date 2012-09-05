VISH.Status = (function(V,$,undefined){
	var ua = {};
	var features = {};
	var isInIframe;
	
	var init = function(){
		fillUserAgent();
		fillFeatures();		
	};
	
	var fillFeatures = function(){
		//to see if we are inside an iframe
		setIsInIframe((window.location != window.parent.location) ? true : false);
		V.Debugging.log("We are in iframe: " + getIsInIframe());		
		
		//fullscreen supported
		var elem = document.getElementById("page-fullscreen");
		if(elem && (elem.requestFullScreen || elem.mozRequestFullScreen || elem.webkitRequestFullScreen)){
			if(!isInIframe){
				features.fullscreen = true;
			} else {
				//fullscreen supported by browser, let´s check that the iframe is the same domain as the vish_editor
				//and that we are not in preview in the editor (in that case we don't want fullscreen)
				try	{
					if((window.parent.location.host === window.location.host) && (!(typeof window.parent.VISH.Editor.Preview.getPreview == "function"))){
				    	features.fullscreen = true; 
					}
				} catch (e)	{
				    features.fullscreen = false;
				}
			}
		}
		V.Debugging.log("Fullscreen supported: " + features.fullscreen);
		
		//touchscreen detection
		features.touchScreen = !!('ontouchstart' in window);
		V.Debugging.log("TouchScreen supported: " + features.touchScreen);
	};
	
	var fillUserAgent = function(){
		// Probe user agent string
		ua.pixelRatio = window.devicePixelRatio || 1;
		ua.viewport = {
			width: window.innerWidth,
			height: window.innerHeight
		};
		ua.screen = {
			width: window.screen.availWidth * ua.pixelRatio,
			height: window.screen.availHeight * ua.pixelRatio
		};
		
		//Apple devices
		ua.iPhone = /iPhone/i.test(navigator.userAgent);
		ua.iPhone4 = (ua.iPhone && ua.pixelRatio == 2);
		ua.iPad = /iPad/i.test(navigator.userAgent);
		ua.iOS = ua.iPhone || ua.iPad;
		ua.applePhone = ua.iPhone || ua.iPhone4;
		ua.appleTablet = ua.iPad;

		//Android devices
		ua.android = /android/i.test(navigator.userAgent);
		if(ua.android){
			ua.androidPhone = false;
			ua.androidTablet = false;

			//First intent: Look for Tablet in userAgent
			if(/tablet/i.test(navigator.userAgent)){
				ua.androidTablet = true;
			} else {
				//Second intent: Check screen size

				//We will consider android tablets devices with a screen that are at least 960dp x 720dp
				//Taken from: http://developer.android.com/guide/practices/screens_support.html

				var landscape = window.screen.availWidth > window.screen.availHeight;
				if(landscape){
					if((window.screen.availWidth>=1024)&&(window.screen.availHeight)>=720){
						ua.androidTablet = true;
					} else {
						ua.androidPhone = true;
					}
				} else {
					if((window.screen.availHeight>=1024)&&(window.screen.availWidth)>=720){
						ua.androidTablet = true;
					} else {
						ua.androidPhone = true;
					}
				}
			}

		} else {
			ua.androidPhone = false;
			ua.androidTablet = false;
		}

		//Phones and Tablets
		ua.mobile = ua.applePhone || ua.androidPhone;
		ua.tablet = ua.appleTablet || ua.androidTablet;

		if((!ua.mobile)&&(!ua.tablet)){
			ua.desktop = true;
		} else {
			ua.desktop = false;
		}

		V.Debugging.log("isMobile " + ua.mobile);
		V.Debugging.log("isTablet: " + ua.tablet);
		V.Debugging.log("Screen width: " + ua.screen.width);
		V.Debugging.log("Screen height: " + ua.screen.height);
		V.Debugging.log("Visual Viewport width: " + ua.viewport.width);
		V.Debugging.log("Visual Viewport height: " + ua.viewport.height);
		V.Debugging.log("Layout Viewport width: " + document.documentElement.clientWidth);
		V.Debugging.log("Layout Viewport height: " + document.documentElement.clientHeight);
		V.Debugging.log("HTML element width: " +  document.documentElement.offsetWidth);
		V.Debugging.log("HTML element height: " +  document.documentElement.offsetHeight);
		V.Debugging.log("window.screen.availWidth: " + window.screen.availWidth);
		V.Debugging.log("window.screen.availHeight: " + window.screen.availHeight);
	};

	var updateOrientation = function() {  
    	  V.Debugging.log("updateOrientation called with " + window.orientation);
  	};
	
	var getIsInIframe = function(){
		return isInIframe;
	};
	
	var setIsInIframe = function(isIframe){
		isInIframe = isIframe;
	};
	
	return {
		features		: features,
		getIsInIframe	: getIsInIframe,
		init            : init,
		ua				: ua
		
	};

}) (VISH, jQuery);
