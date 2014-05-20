VISH.Editor.IMSQTI = (function(V,$,undefined){
	var init = function(){
	};
	
 

 var isCompliantXMLFile = function(fileXML){
		xmlDoc = $.parseXML( fileXML ),
		$xml = $( xmlDoc );
		
		return !$.isEmptyObject($(xml).find('assessmentItem'));
 }


 var checkAnswer = function(answer, correctArray){
 	var answerString;
 	if ((jQuery.inArray( answer, correctArray )) == -1){
 		answerString = "false";
 	}else{
 		answerString = "true";
 	}





		return answerString;
 }



 var getJSONFromXMLFile = function(fileXML){

 		var elements = [];
 		var cardinality;
 		var question;
 		var answerArray = [];
 		var correctanswerArray = [];
 		var nAnswers;

		xmlDoc = $.parseXML( fileXML ),
		$xml = $( xmlDoc )


		/* To get cardinality */

		$(xml).find('responseDeclaration').each(function(){
		  $(this.attributes).each(function(index,attribute){
		    if(attribute.name == "cardinality"){
		      cardinality = attribute.textContent;
		    }
		});



		/*To get the question */

		$(xml).find('prompt').each(function(){
  			question = $(this).text();
		});



		/*To get array of answers */

		$(xml).find('simpleChoice').each(function(){
 			 var answer = $(this).text();
  			answerArray.push(answer);
		});


		/* To get array of corrrect answers */
		$(xml).find('correctResponse value').each(function(){
		  var cAnswer = $(this).text();
		  correctanswerArray.push(cAnswer);
		});

		if(correctanswerArray > 1){
			nAnswers = true;
		}else{
			nAnswers = false;
		}

		/* We know get all the data we have to retrieve from XML */
		var choices = "";
		for (var i = 1; i < answerArray.length; i++ ) {
			var iChoice;
			iChoice = "{ 'id':" + i + ", 'value':" + answerArray[i-1] + "'wysiwygValue':'<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:24px;\">" + answerArray[i-1] + "&shy;</span></span></p>\n', 'answer':" + checkAnswer(answerArray[i-1], correctanswerArray) + "}";
			choices.push(iChoice);
		}

		choicesString = "[" + choices.join() + "]";

		elements.push({"id":"article2_zone1", 
			"type":"quiz", 
			"areaid":"left", 
			"quiztype":"multiplechoice",
			"selfA":true, 
			"question":{
				"value": question,  
				"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:38px;\">&shy;" + question + "</span></span></p>\n"
			}, 

			"choices": choicesString,

			"extras":{
					"multipleAnswer": nAnswers
			}

		);

		var options = {
			template : "t2",
		}
		return V.Editor.Presentation.generatePresentationScaffold(elements,options);





 }


	return {
		init 		: init,
		isCompliantXMLFile			:  isCompliantXMLFile,
		getJSONFromXMLFile			:  getJSONFromXMLFile
	};

}) (VISH, jQuery);
