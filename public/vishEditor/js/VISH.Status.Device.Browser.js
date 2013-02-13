VISH.Status.Device.Browser = (function(V,$,undefined){
	
	var init = function(){
	};

	var fillBrowser = function(){
		var browser = {};
		var version;

		version = _getInternetExplorerVersion();
		if(version!=-1){
			browser.name = VISH.Constant.IE;
			browser.version = version;
			return browser;
		}

		version = _getFirefoxVersion();
		if(version!=-1){
			browser.name = VISH.Constant.FIREFOX;
			browser.version = version;
			return browser;
		}

		version = _getGoogleChromeVersion();
		if(version!=-1){
			browser.name = VISH.Constant.CHROME;
			browser.version = version;
			return browser;
		}

		version = _getSafariVersion();
		if(version!=-1){
			browser.name = VISH.Constant.SAFARI;
			browser.version = version;
			return browser;
		}

		//No browser founded
		browser.name = V.Constant.UNKNOWN;
		browser.name = -1;
		return browser;
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

	var _getSafariVersion = function() {
		var rv = -1; //No Safari
		if (navigator.appName === VISH.Constant.UA_NETSCAPE) {
			var ua = navigator.userAgent;
			if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) {
				var rv = -2; //Safari with unknown version

				//Try to get Safari Version
				var re = new RegExp(".* Version/([0-9.]+)");
				if (re.exec(ua) != null){
					rv = parseFloat(RegExp.$1);
				}
			}
		}
		return rv;
	}
	
	return {
		init            		: init,
		fillBrowser				: fillBrowser
	};

}) (VISH, jQuery);
