VISH.Editor.Object.Webapp = (function(V,$,undefined){
	
	var init = function(){
	};

	var generatePreviewWrapper = function(url){
		url = V.Utils.addParamToUrl(url,"wmode","opaque");
		return "<iframe class='objectPreview' objecttype='"+V.Constant.MEDIA.WEB_APP+"' src='" + url + "' wmode='opaque'></iframe>";
	};

	var generateWrapper = function(url){
		url = V.Utils.addParamToUrl(url,"wmode","opaque");
		return "<iframe objecttype='"+V.Constant.MEDIA.WEB_APP+"' src='" + url + "' wmode='opaque'></iframe>";
	};

	var afterDraw = function(iframe){
		//Modify iframe which contains a Web App after drawing it.
	};
			
	return {
		init 							: init,
		generatePreviewWrapper 			: generatePreviewWrapper,
		generateWrapper 				: generateWrapper,
		afterDraw						: afterDraw
	};

}) (VISH, jQuery);
