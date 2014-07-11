VISH.Editor.IMSQTI = (function(V,$,undefined){
	
	var init = function(){
	};
	
	var isCompliantXMLFile = function(fileXML){
		var contains;
		var schema;
		var myRandomIHash = [];
		var myRandomFHash = [];
		var min,max;
		var ident;


		var xmlDoc = $.parseXML( fileXML );
		var xml = $(xmlDoc);

		var itemBody = $(xml).find("itemBody");
		var simpleChoice = $(xml).find("simpleChoice");
		var orderInteraction = $(xml).find("orderInteraction");
		var correctResponse = $(xml).find("correctResponse value");
		
		if($(xml).find('assessmentItem').length != 0){
			$(xml).find('assessmentItem').each(function(){
				$(this.attributes).each(function(index,attribute){
					if(attribute.name == "xsi:schemaLocation"){
						if((((attribute.textContent).indexOf("http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1p1.xsd")) != -1) ||(((attribute.textContent).indexOf("http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd")) != -1)) {
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


		if($(xml).find('templateProcessing setTemplateValue randomInteger').length != 0){
			$(xml).find('templateProcessing setTemplateValue randomInteger').each(function(){
				$(this).parent().each(function(){
						$(this.attributes).each(function(index,attribute){
							if(attribute.name == "identifier"){
								ident = attribute.textContent;
							}
						})
					})
				$(this.attributes).each(function(index,attribute){
					if(attribute.name == "min"){
						min = attribute.textContent;
					}else if (attribute.name == "max") {
						max = attribute.textContent;
				}
			});
			myRandomIHash[ident] = Math.floor(Math.random()*(parseInt(max)-parseInt(min)+1)+parseInt(min));
		});
	}

	if($(xml).find('templateProcessing setTemplateValue randomFloat').length != 0){
			$(xml).find('templateProcessing setTemplateValue randomFloat').each(function(){
				$(this).parent().each(function(){
						$(this.attributes).each(function(index,attribute){
							if(attribute.name == "identifier"){
								ident = attribute.textContent;
							}
						})
					})
				$(this.attributes).each(function(index,attribute){
					if(attribute.name == "min"){
						min = attribute.textContent;
					}else if (attribute.name == "max") {
						max = attribute.textContent;
				}
			});
			myRandomFHash[ident] = parseFloat(Math.min(parseInt(min) + (Math.random() * (parseInt(max) - parseInt(min))),parseInt(max)).toFixed(2));
		});
	}

		if(checkQuizType(fileXML) == "multipleCA"){
			if((itemBody.length == 0)||(simpleChoice.length == 0)||(correctResponse.length == 0)|| (schema == false)){
				contains = false;
			}else{
				contains= true;
			}
		}else if(checkQuizType(fileXML) == "order"){
			if((itemBody.length == 0)||(orderInteraction.length == 0)||(correctResponse.length == 0)|| (schema == false)){
				contains = false;
			}else{
				contains = true;
			}
		}else if(checkQuizType(fileXML) == "openshortAnswer" || checkQuizType(fileXML) == "fillInTheBlankText"){
			if((itemBody.length == 0)||(correctResponse.length == 0)|| (schema == false)){
				contains = false;
			}else{
				contains = true;
			}
		}else{
			contains = false;
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


	var checkQuizType = function(fileXML){

		var quizType;

		var xmlDoc = $.parseXML( fileXML );
		var xml = $(xmlDoc);

		var multipleCA = $(xml).find("simpleChoice");
		var fillInTheBlankText = $(xml).find("textEntryInteraction");
		var hotSpotClick = $(xml).find("selectPointInteraction");
		var openshortAnswer = $(xml).find("extendedTextInteraction");
		var order = $(xml).find("orderInteraction");
		var fillInTheBlankGap = $(xml).find("gapMatchInteraction");
		var matching = $(xml).find("matchInteraction");

		if(fillInTheBlankText.length != 0){
			quizType = "fillInTheBlankText";
		}else if(hotSpotClick.length != 0){
			quizType = "hotSpotClick";
		}else if(openshortAnswer.length != 0){
			quizType = "openshortAnswer";
		}else if(order.length != 0){
			quizType = "order";
		}else if(fillInTheBlankGap.length != 0){
			quizType = "fillInTheBlankGap";
		}else if(matching.length != 0){
			quizType = "matching";
		}else if (multipleCA.length != 0){
			quizType = "multipleCA"
		}

	return quizType;
	}

	var getJSONFromXMLFile = function(fileXML){

		switch (checkQuizType(fileXML)) {
    		case "multipleCA":
        		return getJSONFromXMLFileMC(fileXML);
        	break;
    		
    		case "order":
				return getJSONFromXMLFileSorting(fileXML);
        	break;
    
    		case "openshortAnswer":
				return getJSONFromXMLFileSA(fileXML);
        	break;

        	case "fillInTheBlankText" :
				return getJSONFromXMLFileSA(fileXML);
        	break;
		}
	}


	var getJSONFromXMLFileMC = function(fileXML){
		var elements = [];
		var question;
		var answerArray = [];
		//var answerArrayL = [];
		var correctanswerArray = [];
		var nAnswers;
		var answerIds = [];
		//var quiztype;

		var xmlDoc = $.parseXML(fileXML);
		var xml = $(xmlDoc);


		/*To get the question */
		if($(xml).find('prompt').length != 0){
		$(xml).find('prompt').each(function(){
			question = $(this).text();
		});
		}else{
			$(xml).find('itemBody').children().first().each(function(){
				question = $(this).text();
			});	
		}

		/*To get array of answers */
		$(xml).find('simpleChoice').each(function(){
			var answer = $(this).text();
			//answerArrayL.push(answer.toLowerCase());
			answerArray.push(answer);
		});

		// if(answerArray.length == 2){
		// 	if(((jQuery.inArray("true",answerArrayL)) == -1) && ((jQuery.inArray("false",answerArrayL)) == -1)){
		// 		quiztype = "multiplechoice";
		// 	}else{
		// 		quiztype = "truefalse";
		// 	}
		// }


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
			choices.push(iChoice);
		}


		elements.push({
			"id":"article2_zone1",
			"type":"quiz",
			"areaid":"left",
			"quiztype": "multiplechoice",
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



	var getJSONFromXMLFileSorting = function(fileXML){
		var elements = [];
		var question;
		var answerArray = [];
		var correctanswerArray = [];
		var answerIds = [];

		var xmlDoc = $.parseXML(fileXML);
		var xml = $(xmlDoc);


		/*To get the question */
		if($(xml).find('prompt').length != 0){
		$(xml).find('prompt').each(function(){
			question = $(this).text();
		});
		}else{
			$(xml).find('itemBody').children().first().each(function(){
				question = $(this).text();
			});	
		}


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


		//we get the IDs
		//now we have to get the choices according to that ID
		$(xml).find('simpleChoice').each(function(){
			$(this.attributes).each(function(index,attribute){
				if(attribute.name == "identifier"){
					answerIds.push(attribute.textContent);
		    	}
		   	})
		});

		var myHash = [];
		for (var i = 1; i <= answerArray.length; i++ ){
			myHash[answerIds[i-1]] = answerArray[i-1];
		}


		var choices = [];
		for (var i = 1; i <= answerArray.length; i++ ){
			var iChoice;
			iChoice = {
				'id': i.toString(), 
				'value': myHash[correctanswerArray[i-1]] , 
				'wysiwygValue' :  "<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:38px;\">&shy;" + myHash[correctanswerArray[i-1]] + '&shy;</span></span></p>\n', 
				'answer': i.toString()
			};
			choices.push(iChoice);

		}

		elements.push({
			"id":"article2_zone1",
			"type":"quiz",
			"areaid":"left",
			"quiztype":"sorting",
			"selfA": true,
			"question":{
				"value": question,
				"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:38px;\">&shy;" + question + "</span></span></p>\n"
			},
			"choices": $.extend([{}], choices) 
		});

		var options = {
			template : "t2"
		}

		return V.Editor.Presentation.generatePresentationScaffold(elements,options);
	};

		var getJSONFromXMLFileSA = function(fileXML){

		var elements = [];
		var question;
		var correctanswerArray = [];
		var selfA;

		var xmlDoc = $.parseXML(fileXML);
		var xml = $(xmlDoc);


		$(xml).find('responseProcessing').each(function(){
			$(this.attributes).each(function(index,attribute){
				if(attribute.name == "template"){
					if (attribute.textContent == "http://www.imsglobal.org/question/qti_v2p1/rptemplates/map_response"){
						selfA = true;
					}else{
						selfA = false;
					}
		    	}
		   	})
		});



		/*To get the question */
		if($(xml).find('prompt').length != 0){
		$(xml).find('prompt').each(function(){
			question = $(this).text();
		});
		}else{
			$(xml).find('itemBody').children().first().each(function(){
				question = $(this).text();
			});	
		}


		/* To get array of corrrect answers */
		$(xml).find('correctResponse value').each(function(){
			var cAnswer = $(this).text();
			correctanswerArray.push(cAnswer);
		});
		
		elements.push({
			"id":"article2_zone1",
			"type":"quiz",
			"areaid":"left",
			"quiztype":"openAnswer",
			"selfA": selfA,
			"question":{
				"value": question,
				"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:38px;\">&shy;" + question + "</span></span></p>\n"
			},
			"answer":{
				"value": correctanswerArray[0],
				"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:38px;\">&shy;" + correctanswerArray[0] + "</span></span></p>\n"
			}
		});

		var options = {
			template : "t2"
		}

		return V.Editor.Presentation.generatePresentationScaffold(elements,options);
	};



	return {
		init 						: init,
		isCompliantXMLFile			: isCompliantXMLFile,
		getJSONFromXMLFile			: getJSONFromXMLFile
	};

}) (VISH, jQuery);
