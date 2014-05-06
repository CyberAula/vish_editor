VISH.Editor.IMSQTI = (function(V,$,undefined){
	var init = function(){
	};
	
	var generatePresentationWithImgArray = function(imgs,pdfexId){
		var presentation = {};
		presentation.VEVersion = V.VERSION;
		presentation.type = V.Constant.PRESENTATION;
		presentation.theme = V.Constant.Themes.Default
		presentation.slides = [];
		
		for(var i=0; i<imgs.length; i++){
			var imageUrl = imgs[i];
			presentation.slides.push(_generateSlideWithImg(i,imageUrl,pdfexId));
		}
		return presentation;
	};

	var _generateSlideWithImg = function(){
		var slide = {};
		slide.id = "article2"+index;
		slide.type = V.Constant.STANDARD;
		slide.template = "t2";
		slide.elements = [];

		var element = {};
		element.areaid = "center";
		element.body = imgUrl;
		element.id = slide.id + "_zone1";
		element.type = V.Constant.IMAGE;

		if(typeof pdfexId != "undefined"){
			element.options = {};
			element.options["vishubPdfexId"] = pdfexId;
		}
		slide.elements.push(element);

		return slide;
	};

	return {
		init 		: init,
		onLoadTab	: onLoadTab
	};

}) (VISH, jQuery);
