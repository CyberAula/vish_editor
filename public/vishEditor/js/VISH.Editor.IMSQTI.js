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
 

 var isCompliantXMLFile(fileXML){
		xmlDoc = $.parseXML( fileXML ),
		$xml = $( xmlDoc );
		
		return !$.isEmptyObject($.find('assessmentItem'));
 }

 /*
 !$.isEmptyObject($.find('#id'))
 This will return true if the element exists and false if it doesn't.
 */

 /*TO DO
	First we have to check if there's a label called assessmentItem. If there's no one,
	we can assure it's not a QTI XML file.
	
	Doubt: in case there's a file with assessmentItem, do we have to check if that's the correct format?




 */

	return {
		init 		: init,
		generatePresentationQuiz	: generatePresentationQuiz,
		isCompliantXMLFile			:  isCompliantXMLFile
	};

}) (VISH, jQuery);
