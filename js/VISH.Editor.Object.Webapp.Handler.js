VISH.Editor.Object.Webapp.Handler = (function(V,$,undefined){
	
	var init = function(){
	};

	var onWAPPConnected = function(origin,originId){
		// V.Debugging.log("onWAPPConnected: " + origin);

		var iframe = $("iframe[src='" + origin + "']");

		if($(iframe).length>0){
			$(iframe).each(function(index,iframe){
				if(typeof $(iframe).attr("wappid")==="undefined"){
					V.Editor.Object.Webapp.convertIframeToWebApp(iframe);
				}
			});
		}
	};
			
	return {
		init 					: init,
		onWAPPConnected			: onWAPPConnected
	};

}) (VISH, jQuery);
