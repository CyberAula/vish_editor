VISH.Editor.Object.Webapp.Handler = (function(V,$,undefined){
	
	var init = function(){
	};

	var onWAPPConnected = function(origin,originId){
		console.log("onWAPPConnected: " + origin);

		var iframe = $("iframe[src='" + origin + "']");
		var iframeLength = $(iframe).length;

		if(iframeLength<1){
			return;
		} else if(iframeLength===1){
			V.Editor.Object.Webapp.convertIframeToWebApp(iframe);
		} else {
			$(iframe).each(function(index,iframe){
				if($(iframe).attr("wappid")==="undefined"){
					V.Editor.Object.Webapp.convertIframeToWebApp(iframe);
					return;
				}
			});
		}
	};
			
	return {
		init 					: init,
		onWAPPConnected			: onWAPPConnected
	};

}) (VISH, jQuery);
