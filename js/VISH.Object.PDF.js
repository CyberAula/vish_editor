VISH.Object.PDF = (function(V,$,undefined){

	var _pdfSupport = false;

	var init = function(){
		_pdfSupport = V.Status.getDevice().features.pdfReader;
	};

	var generateWrapper = function(url){
		if(_pdfSupport){
			return "<iframe src='" + url + "'></iframe>";
		} else {
			return V.Object.GoogleDOC.generateWrapper(url);
		}
	};

	var renderPDFFromJSON = function(pdfJSON,options){
		if ((typeof options != "object") || (typeof options.source != "string")){
			return "";
		}

		var style = (pdfJSON['style'])? pdfJSON['style'] : "";
		var pdfBody = generateWrapper(options.source);
		var zoomInStyle = (pdfJSON['zoomInStyle'])? pdfJSON['zoomInStyle'] : "";
		
		var classes = "objectelement";
		if(options.extraClasses){
			classes = classes + " " + options.extraClasses;
		}
		
		return "<div id='"+pdfJSON['id']+"' class='"+ classes +"' objectStyle='" + style + "' zoomInStyle='" + zoomInStyle + "' objectWrapper=\"" + pdfBody + "\"></div>";
	};

	return {
		init 				: init,
		generateWrapper		: generateWrapper,
		renderPDFFromJSON	: renderPDFFromJSON
	};

})(VISH,jQuery);