/*
 * Filter VISH Editor functionality based on status: device, browser, etc.
 * Disable no cross-browser features in the corresponding browsers.
 * Attention! Rendering Filter is managed by VISH.Renderer.Filter.
 */

VISH.Editor.Filter = (function(V,$,undefined){

	var init  = function(){
		var device = VISH.Status.getDevice();
		var browser = device.browser;

		switch(browser.name){
			case VISH.Constant.IE:
				//Disable websnapshot in Internet Explorer
				$("#tab_object_snapshot").hide();
				break;
			case VISH.Constant.UNKNOWN:
				//Disable websnapshot in Unknown browsers
				$("#tab_object_snapshot").hide();
				break;
		}
	}


	return {
		init        			: init
	};

}) (VISH,jQuery);