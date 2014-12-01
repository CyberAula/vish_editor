VISH.Editor.Object.Scorm = (function(V,$,undefined){
	
	var init = function(){
	};

	var generatePreviewWrapperForScorm = function(url){
		url = V.Utils.addParamToUrl(url,"wmode","opaque");
		return "<iframe class='objectPreview' objecttype='"+V.Constant.MEDIA.SCORM_PACKAGE+"' src='" + url + "' wmode='opaque'></iframe>";
	};

	var generateWrapperForScorm = function(url){
		url = V.Utils.addParamToUrl(url,"wmode","opaque");
		return "<iframe objecttype='"+V.Constant.MEDIA.SCORM_PACKAGE+"' src='" + url + "' wmode='opaque'></iframe>";
	};

	var afterDrawSCORM = function(iframe){
		//Modify iframe which contains a SCORM Package after drawing it.
	};
			
	return {
		init 							: init,
		generatePreviewWrapperForScorm 	: generatePreviewWrapperForScorm,
		generateWrapperForScorm 		: generateWrapperForScorm,
		afterDrawSCORM					: afterDrawSCORM
	};

}) (VISH, jQuery);
