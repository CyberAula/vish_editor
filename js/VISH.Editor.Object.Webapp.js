VISH.Editor.Object.Webapp = (function(V,$,undefined){
	
	var init = function(){
		V.Editor.Object.Webapp.Handler.init();
	};

	var generatePreviewWrapper = function(url){
		url = V.Utils.checkUrlProtocol(V.Utils.addParamToUrl(url,"wmode","opaque"));
		return "<iframe class='objectPreview' objecttype='"+V.Constant.MEDIA.WEB_APP+"' src='" + url + "' wmode='opaque'></iframe>";
	};

	var generateWrapper = function(url){
		url = V.Utils.checkUrlProtocol(V.Utils.addParamToUrl(url,"wmode","opaque"));
		var wappId = V.Utils.getId("wapp");
		url = V.Utils.addParamToUrl(url,"wappid",wappId);
		return "<iframe objecttype='"+V.Constant.MEDIA.WEB_APP+"' src='" + url + "' wmode='opaque' wappid='" + wappId + "'></iframe>";
	};

	var afterDraw = function(iframe){
		//Modify iframe which contains a Web App after drawing it.
	};

	var convertIframeToWebApp = function(iframe){
		//Modify an iframe which contains a web page to reflect that it contains a web app that uses the WAPP API.
		if($(iframe).attr("objecttype")!=V.Constant.MEDIA.WEB_APP){
			$(iframe).attr("objecttype",V.Constant.MEDIA.WEB_APP);
		}
		if(typeof $(iframe).attr("wappid")==="undefined"){
			var wappId = V.Utils.getId("wapp");
			$(iframe).attr("wappid",wappId);
			var iframeURL = $(iframe).attr("src");
			iframeURL = V.Utils.checkUrlProtocol(V.Utils.addParamToUrl(iframeURL,"wappid",wappId));
			$(iframe).attr("src",iframeURL);
		}

		var iframeZoneParent = $(iframe).parents(".vezone");
		var _settings = {};
		try {
			_settings = JSON.parse($(iframeZoneParent).attr("elSettings"));
		} catch (e) {};

		//Apply new settings
		_settings.wappAPI_supported = true;
		$(iframeZoneParent).attr("elSettings",JSON.stringify(_settings));
	};
			
	return {
		init 							: init,
		generatePreviewWrapper 			: generatePreviewWrapper,
		generateWrapper 				: generateWrapper,
		afterDraw						: afterDraw,
		convertIframeToWebApp			: convertIframeToWebApp
	};

}) (VISH, jQuery);
