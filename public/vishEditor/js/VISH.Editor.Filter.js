/*
 * Filter VISH Editor functionality based on status: device, browser, etc.
 * Disable no cross-browser features in the corresponding browsers.
 * Attention! Rendering Filter is managed by V.Renderer.Filter.
 */

VISH.Editor.Filter = (function(V,$,undefined){

	var init  = function(){
		var device = V.Status.getDevice();
		var browser = device.browser;

		switch(browser.name){
			case V.Constant.IE:
				//Disable websnapshot in Internet Explorer
				$("#tab_object_snapshot").hide();
				break;
			case V.Constant.UNKNOWN:
				//Disable websnapshot in Unknown browsers
				$("#tab_object_snapshot").hide();
				break;
		}
	}


	return {
		init        			: init
	};

}) (VISH,jQuery);