VISH.Editor.IMSQTI = (function(V,$,undefined){
	var init = function(){
	};
	
var generatePresentationQuiz = function(imgs,pdfexId){
		var elements = [];
		var imgL = imgs.length;
		for(var i=0; i<imgL; i++){
			elements.push({"body": imgs[i], "type": V.Constant.QUIZ});
		}
		var options = {
			template : "t2",
			pdfexId: pdfexId
		}
		return V.Editor.Presentation.generatePresentationScaffold(elements,options);
	};





	return {
		init 		: init,
		generatePresentationQuiz	: generatePresentationQuiz
	};

}) (VISH, jQuery);
