VISH.Editor.IMSQTI = (function(V,$,undefined){
	
	var init = function(){
	};
	
	var isCompliantXMLFile = function(fileXML){
		var contains;
		var schema;

		var xmlDoc = $.parseXML( fileXML );
		var xml = $(xmlDoc);
		
		if($(xml).find('assessmentItem').length != 0){
			$(xml).find('assessmentItem').each(function(){
				$(this.attributes).each(function(index,attribute){
					if(attribute.name == "xsi:schemaLocation"){
						if(((attribute.textContent).indexOf("http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd")) != -1){
							schema = true;
						} else {
							schema = false;
						}
					}
				});
			});
		} else {
			schema = false;
		}

		var prompt = $(xml).find("prompt");
		var simpleChoice = $(xml).find("simpleChoice");
		var correctResponse = $(xml).find("value");

		if((prompt.length == 0)||(simpleChoice.length == 0)||(correctResponse.length == 0)|| (schema == false)){
			contains = false;
		} else {
			contains= true;
		}

		return contains;
 	};

	var checkAnswer = function(answer, correctArray){
		var answerBoolean;
		
		if((jQuery.inArray(answer,correctArray)) == -1){
			answerBoolean = false;
		} else {
			answerBoolean = true;
		}

		return answerBoolean;
	};

	var getJSONFromXMLFile = function(fileXML){
		var elements = [];
		var question;
		var answerArray = [];
		var correctanswerArray = [];
		var nAnswers;
		var answerIds = [];

		var xmlDoc = $.parseXML(fileXML);
		var xml = $(xmlDoc);


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

		/* To get identifiers */
		$(xml).find('simpleChoice').each(function(){
			$(this.attributes).each(function(index,attribute){
				if(attribute.name == "identifier"){
					answerIds.push(attribute.textContent);
		    	}
		   	})
		});

		if(correctanswerArray.length > 1){
			nAnswers = true;
		} else {
			nAnswers = false;
		}

		var choices = [];
		for (var i = 1; i <= answerArray.length; i++ ){
			var iChoice;
			iChoice = {
				'id': i.toString(), 
				'value': (answerArray[i-1]).toString() , 
				'wysiwygValue' :  "<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:38px;\">&shy;" + (answerArray[i-1]).toString() + '&shy;</span></span></p>\n', 
				'answer': checkAnswer(answerIds[i-1], correctanswerArray)
			};
		}

		elements.push({
			"id":"article2_zone1",
			"type":"quiz",
			"areaid":"left",
			"quiztype":"multiplechoice",
			"selfA":true,
			"question":{
				"value": question,
				"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:38px;\">&shy;" + question + "</span></span></p>\n"
			},
			"choices": $.extend([{}], choices), 
			"extras":{
				"multipleAnswer": nAnswers
			}
		});

		var options = {
			template : "t2"
		}

		return V.Editor.Presentation.generatePresentationScaffold(elements,options);
	};


	return {
		init 						: init,
		isCompliantXMLFile			:  isCompliantXMLFile,
		getJSONFromXMLFile			:  getJSONFromXMLFile
	};

}) (VISH, jQuery);
