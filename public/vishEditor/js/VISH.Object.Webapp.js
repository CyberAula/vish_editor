VISH.Object.Webapp = (function(V,$,undefined){

	var init = function(){
	};

	var renderWebappFromJSON = function(webappJSON,options){
		var style = (webappJSON['style'])? webappJSON['style'] : "";
		
		var body = webappJSON['body'];
		var webappBody = $(body);
		$(webappBody).attr("objecttype",V.Constant.MEDIA.WEB_APP);
		webappBody = V.Utils.getOuterHTML(webappBody);

		var zoomInStyle = (webappJSON['zoomInStyle']) ? webappJSON['zoomInStyle'] : "";
		
		var classes = "objectelement";
		if(options){
			if(options.extraClasses){
				classes = classes + " " + options.extraClasses;
			}
		}
		
		return "<div id='"+webappJSON['id']+"' class='"+ classes +"' objectStyle='" + style + "' zoomInStyle='" + zoomInStyle + "' objectWrapper='" + webappBody + "'>" + "" + "</div>";
	};

	return {
		init 					: init,
		renderWebappFromJSON	: renderWebappFromJSON
	};

})(VISH,jQuery);