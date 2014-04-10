VISH.SCORM = (function(V,$,undefined){

	var init = function(){
		_init_RTE_API();
	};

	var _init_RTE_API = function(){
	};

	var renderSCORMFromJSON = function(scormJSON,options){
		var style = (scormJSON['style'])? scormJSON['style'] : "";
		
		var body = scormJSON['body'];
		var scormBody = $(body);
		$(scormBody).attr("objecttype",V.Constant.MEDIA.SCORM_PACKAGE);
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
		renderSCORMFromJSON		: renderSCORMFromJSON
	};

})(VISH,jQuery);