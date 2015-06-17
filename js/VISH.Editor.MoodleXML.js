VISH.Editor.MoodleXML = (function(V,$,undefined){
	
	var init = function(){
	};
	
	var isCompliantXMLFile = function(fileXML){
		var isCompliant = true;
		var schema = false;

		var xmlDoc = $.parseXML( fileXML );
		var xml = $(xmlDoc);

		var quiz = $(xml).find("quiz");
		var itemBody = $(xml).find("question");
		
		//check from MSQTI
		if(itemBody.length != 0){
			itemBody.each(function(){
				$(this).each(function(index,attribute){
					if((((attribute.textContent).indexOf("https://moodle.org/pluginfile.php/134/mod_forum/attachment/1105860/Quiz.xsd")) != -1) ||(((attribute.textContent).indexOf("https://moodle.org/pluginfile.php/134/mod_forum/attachment/1105860/Quiz.xsd")) != -1)) {
						schema = true;
					} else {
						return;	
					}
				});
			});
		} else {
			schema = false;
		}

		itemBody.each(function(){
			if ( checkQuizType($(this)) != null ) {
				return;
			}else{
				isCompliant = false;
			}
		});

		return (isCompliant || schema);
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
		

		var quizType = fileXML.attr("type");

		if(category.length != 0){
			quizType = "category";
		}else if(multichoice.length != 0){
			quizType = "multichoice";
		}else if(truefalse.length != 0){
			quizType = "truefalse";
		}else if(shortanswer.length != 0){
			quizType = "shortanswer";
		}else if(matching.length != 0){
			quizType = "matching";
		}else if (cloze.length != 0){
			quizType = "cloze"
		}else if (essay.length != 0){
			quizType = "essay"
		}else if (numerical.length != 0){
			quizType = "numerical"
		}else if (description.length != 0){
			quizType = "description"
		} else {
			quizType = null;
		}

		return quizType;
	};


	var getJSONFromXMLFile = function(fileXML){
		var itemBodyContent;

		var xmlDoc = $.parseXML( fileXML );
		var xml = $(xmlDoc);
		var myRandomHash = [];
		var randomArray = [];
		var min,max;
		var ident;

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
				myRandomHash[ident] = Math.floor(Math.random()*(parseInt(max)-parseInt(min)+1)+parseInt(min));
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
				myRandomHash[ident] = parseFloat(Math.min(parseInt(min) + (Math.random() * (parseInt(max) - parseInt(min))),parseInt(max)).toFixed(2));
			});
		}

		if($(xml).find('templateProcessing setTemplateValue random').length != 0){
				$(xml).find('templateProcessing setTemplateValue random').each(function(){
					$(this).parent().each(function(){
						$(this.attributes).each(function(index,attribute){
							if(attribute.name == "identifier"){
								ident = attribute.textContent;
							}
						})	
					})
					$(this).children().each(function(){
						for (var i = 1; i <= ($(this).text().split('\n').length)-2; i++ ){
							randomArray[i-1] = $(this).text().split('\n')[i];
						}
					});
					myRandomHash[ident] = randomArray[Math.floor(Math.random()*randomArray.length)];
			});
		}

		if($(xml).find('printedVariable').length != 0){
			$(xml).find('printedVariable').each(function(){
				$(this.attributes).each(function(index,attribute){
					if(attribute.name == "identifier"){
						if(myRandomHash[attribute.textContent] != undefined){
							$(xml).find('itemBody').each(function(){
								$(this).find('printedVariable').replaceWith(myRandomHash[attribute.textContent].toString());
								itemBodyContent = $(xml).find('itemBody');
								//itemBodyContent= $(this)[0].innerHTML;
							});
						}
		    		}
		    	})
		   	})
		} else {
			itemBodyContent = $(xml).find('itemBody');
		}

		switch(checkQuizType(fileXML)){
    		case "multipleCA":
        		return getJSONFromXMLFileMC(fileXML, itemBodyContent);
        		break;
    		case "order":
				return getJSONFromXMLFileSorting(fileXML,itemBodyContent);
        		break;
    		case "openshortAnswer":
				return getJSONFromXMLFileSA(fileXML, itemBodyContent);
        		break;
        	case "fillInTheBlankText" :
				return getJSONFromXMLFileSA(fileXML, itemBodyContent);
        		break;
		}
	}


	var getJSONFromXMLFileMC = function(fileXML, itemBodyContent){
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
			itemBodyContent.children().first().each(function(){
				question = $(this).text();
			});	
		}

		/*To get array of answers */
		itemBodyContent.find('simpleChoice').each(function(){
			var answer = $(this).text();
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
		itemBodyContent.find('simpleChoice').each(function(){
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



	var getJSONFromXMLFileSorting = function(fileXML, itemBodyContent){
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
			itemBodyContent.children().first().each(function(){
				question = $(this).text();
			});	
		}

		/*To get array of answers */
		itemBodyContent.find('simpleChoice').each(function(){
			var answer = $(this).text();
			answerArray.push(answer);
		});

		/* To get array of corrrect answers */
		$(xml).find('correctResponse value').each(function(){
			var cAnswer = $(this).text();
			correctanswerArray.push(cAnswer);
		});

		/* To get identifiers */
		itemBodyContent.find('simpleChoice').each(function(){
			$(this.attributes).each(function(index,attribute){
				if(attribute.name == "identifier"){
					answerIds.push(attribute.textContent);
		    	}
		   	})
		});

		//we get the IDs
		//now we have to get the choices according to that ID
		itemBodyContent.find('simpleChoice').each(function(){
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

		var getJSONFromXMLFileSA = function(fileXML,itemBodyContent){

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
			itemBodyContent.children().first().each(function(){
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
