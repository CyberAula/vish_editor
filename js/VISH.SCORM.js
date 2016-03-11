VISH.SCORM = (function(V,$,undefined){

	var _API;

	///////////////
	// SCORM RTE API Management
	///////////////

	var init = function(){
	};

	var initAfterRender = function(){
		if(V.Utils.getOptions().scorm==true){
			//Do not init SCORM API if the LO is not a SCORM SCO.
			V.SCORM.API.init();
		}
	};

	///////////////
	// Renderer for SCORM components
	///////////////

	var renderSCORMFromJSON = function(scormJSON,options){
		var style = (scormJSON['style'])? scormJSON['style'] : "";
		
		var body = scormJSON['body'];
		var scormBody = $(body);
		$(scormBody).attr("objecttype",V.Constant.MEDIA.SCORM_PACKAGE);
		$(scormBody).attr("src",V.Utils.checkUrlProtocol($(scormBody).attr("src")));
		scormBody = V.Utils.getOuterHTML(scormBody);

		var zoomInStyle = (scormJSON['zoomInStyle']) ? scormJSON['zoomInStyle'] : "";
		
		var classes = "objectelement";
		if(options){
			if(options.extraClasses){
				classes = classes + " " + options.extraClasses;
			}
		}
		
		return "<div id='"+scormJSON['id']+"' class='"+ classes +"' objectStyle='" + style + "' zoomInStyle='" + zoomInStyle + "' objectWrapper='" + scormBody + "'>" + "" + "</div>";
	};

	return {
		init 					: init,
		initAfterRender			: initAfterRender,
		renderSCORMFromJSON		: renderSCORMFromJSON
	};

})(VISH,jQuery);