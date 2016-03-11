VISH.Object.Webapp = (function(V,$,undefined){

	var init = function(){
		V.Object.Webapp.Handler.init();
	};

	var renderWebappFromJSON = function(webappJSON,options){
		var style = (webappJSON['style'])? webappJSON['style'] : "";
		
		var body = webappJSON['body'];
		var webappBody = $(body);
		$(webappBody).attr("objecttype",V.Constant.MEDIA.WEB_APP);
		$(webappBody).attr("src",V.Utils.checkUrlProtocol($(webappBody).attr("src")));
		webappBody = V.Utils.getOuterHTML(webappBody);

		var zoomInStyle = (webappJSON['zoomInStyle']) ? webappJSON['zoomInStyle'] : "";
		
		var classes = "objectelement";
		if(options){
			if(options.extraClasses){
				classes = classes + " " + options.extraClasses;
			}
		}

		var _settings = "";
		if(typeof webappJSON['settings'] == "object"){
			try {
				_settings = JSON.stringify(webappJSON['settings']);
			} catch(e){}
		}
		
		return "<div id='"+webappJSON['id']+"' class='"+ classes +"' objectStyle='" + style + "' zoomInStyle='" + zoomInStyle + "' objectWrapper='" + webappBody + "' settings='" + _settings + "'></div>";
	};

	return {
		init 					: init,
		renderWebappFromJSON	: renderWebappFromJSON
	};

})(VISH,jQuery);