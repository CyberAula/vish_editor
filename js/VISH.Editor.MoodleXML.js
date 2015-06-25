VISH.Editor.MoodleXML = (function(V,$,undefined){
	
	var init = function(){
	};
	
	var isCompliantXMLFile = function(fileXML){
		var isCompliant = true;
		var schema = false;

		var xmlDoc = $.parseXML( fileXML );
		var xml = $(xmlDoc);

		var quiz = $(xml).find("quiz");
		var itemBody = quiz.children("question");
		
		if ( quiz.children().length  != itemBody.length) {
			isCompliant = false;
		}

		isCompliant = checkQuizCompliance(xml);

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

		var quizType = $(fileXML).attr("type");
		var quizRecognise;

		if(quizType == null) {
			quizRecognise = "not_recognised";
		}else if( quizType === "category"){
			return "category";
		} else if (quizType === "multichoice") {
			return "multichoice";
		} else if (quizType === "truefalse"){
			return "truefalse";
		} else if (quizType === "shortanswer"){
			return "shortanswer";
		} else if (quizType === "matching"){
			return "matching";
		} else if (quizType === "cloze"){
			return "cloze";
		} else if (quizType === "essay"){
			return "essay";
		} else if (quizType === "numerical"){
			return "numerical";
		} else if (quiztype === "description"){
			return "description";
		}else{
			quizRecognise = "not_recognised";
		}

		return quizRecognise;
	};

	var checkQuizCompliance = function(fileXML){

		var quizType = fileXML.find("question")
		var quizRecognise;

		if ( quizType != null){
			for(var i =0; i < quizType.length; i++){
				type = $(quizType[i]).attr("type");
				if( type === "category" || type === "multichoice" || type === "truefalse" || type === "shortanswer" || type === "matching" || type === "cloze" || type === "essay" || type === "numerical" || type === "description"){
					quizRecognise = true;
				}else{
					quizRecognise = false;
					return false;	
				}
			}
		}
		return quizRecognise;
	};

	var getJSONFromXMLFile = function(fileXML){
		var itemBodyContent;

		var xmlDoc = $.parseXML( fileXML );
		var xml = $(xmlDoc);
		var question = xml.find("question");
		var questionArray = []
		var notRecognised = 0;

		var options = {
			template : "t2"
		}

		for(var n = 0; n < question.length; n++ ){

			switch(checkQuizType(question[n])){
	    		case "multichoice":
	        		questionArray.push(getJSONFromXMLFileMC(question[n], itemBodyContent)[0]);
	        		break;
	    		case "matching":
					notRecognised++;
	        		break;
	    		case "truefalse":
					questionArray.push(getJSONFromXMLFileTF(question[n], itemBodyContent)[0]);
	        		break;
	        	case "shortanswer" :
					questionArray.push(getJSONFromXMLFileSA(question[n], itemBodyContent)[0]);
	        		break;
	        	case "numerical" :
					questionArray.push(getJSONFromXMLFileNum(question[n], itemBodyContent)[0]);
	        		break;
	        	case "category":
	        	case "description" :
				case "cloze" :
	        	case "essay" :
	        		notRecognised++;
	        		break;
	        	default :
	        		notRecognised++;
	        		break;
			}
		}
		// if( notRecognised > 0){
		// 	generateDialogNotRecognisedItems(notRecognised, questionArray);
		// } else{
		return V.Editor.Presentation.generatePresentationScaffold(questionArray);
		// }
	}


	var getJSONFromXMLFileMC = function(fileXML, itemBodyContent){
		var elements = [];
		var question;
		var answerArray = [];
		var correctanswerArray = [];
		var nAnswers;
		var answerIds = [];
		var title;
		/*To get the question */
		question = $(fileXML).children("questiontext").children("text").text();
		title = $(fileXML).children("name").children("text").text();

		/*To get array of answers */
		$(fileXML).find('answer').each(function(){
			var answer = $(this).text();
			answerArray.push(answer);
		});


		/* To get array of corrrect answers */
		$(fileXML).find('answer').each(function(){
			if ($(this).attr("fraction") > 0 ){
				var answer = $(this).text();
				correctanswerArray.push(answer);
			}
		});

		/* To get identifiers */
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
				'answer': (correctanswerArray.indexOf(answerArray[i-1]) != -1)
			};
			choices.push(iChoice);
		}


		elements.push({
			"id":"article2_zone1",
			"type":"quiz",
			"areaid":"left",
			"quiztype": "multiplechoice",
			"selfA":true,
			"title": title,
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

		return elements;
	};

		var getJSONFromXMLFileSA = function(fileXML,itemBodyContent){

		var elements = [];
		var question;
		var correctanswerArray = [];
		var selfA;



		/*To get the question */
		question = $(fileXML).children("questiontext").children("text").text();


		/* To get array of corrrect answers */
		$(fileXML).find('answer').each(function(){
			if ($(this).attr("fraction") > 0 ){
				var answer = $(this).children("text").text();
				correctanswerArray.push(answer);
			}
		});

		/* To get identifiers */

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

		return elements;
	};

	var getJSONFromXMLFileTF = function(fileXML,itemBodyContent){

		var elements = [];
		var question;
		var correctanswerArray = [];
		var answerArray = [];
		var answerIds = [];

		/* To get the question*/
		question = $(fileXML).children("name").children("text").text();


		/*To get array of answers */
		$(fileXML).find('generalfeedback').each(function(){
			var answer = $(this).text();
			if (answer.trim() == ""){
				var answer = $(this).parent().children("questiontext").text()
			}
			answerArray.push(answer);
		});


		/* To get array of corrrect answers */
		$(fileXML).find('answer').each(function(){
			if ($(this).attr("fraction") > 0 ){
				if ($(this).find("text").text() == "true"){
					correctanswerArray.push(true);
				}else{
					correctanswerArray.push(false);
				}
			}
		});

		var choices = [];
		for (var i = 1; i <= answerArray.length; i++ ){
			var iChoice;
			iChoice = {
				'id': i.toString(), 
				'value': (answerArray[i-1]).toString() , 
				'wysiwygValue' :  "<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:38px;\">&shy;" + (answerArray[i-1]).toString() + '&shy;</span></span></p>\n', 
				'answer': correctanswerArray[i-1]
			};
			choices.push(iChoice);
		}
		
		elements.push({
			"id":"article2_zone1",
			"type":"quiz",
			"areaid":"left",
			"selfA": true,
			"quiztype":"truefalse",
			"question":{
				"value": question,
				"wysiwygValue":"<p style=\"text-align:left;\">\n\t<span autocolor=\"true\" style=\"color:#000\"><span style=\"font-size:38px;\">&shy;" + question + "</span></span></p>\n"
			},
			"choices": $.extend([{}], choices)
		});

		var options = {
			template : "t2"
		}

		return elements;
	};

	var getJSONFromXMLFileNum = function(fileXML,itemBodyContent){

		var elements = [];
		var question;
		var correctanswerArray = [];
		var selfA = true;



		/*To get the question */
		question = $(fileXML).children("questiontext").children("text").text();


		/* To get array of corrrect answers */
		$(fileXML).find('answer').each(function(){
			if ($(this).attr("fraction") > 0 ){
				var answer = $(this).children("text").text();
				correctanswerArray.push(answer);
			}
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

		return elements;
	};

	// var generateDialogNotRecognisedItems = function(notRecognised, questionArray){
	// 	var options = {};
	// 	options.width = 375;
	// 	options.height = 130;
	// 	options.text = notRecognised + " items couldn't be converted";
	// 	var button1 = {};
	// 	button1.text = V.I18n.getTrans("i.yes");
	// 	button1.callback = function(){
	// 		V.Editor.Presentation.generatePresentationScaffold(questionArray);
	// 	}
	// 	options.buttons = [button1];
	// 	V.Utils.showDialog(options);
	// }

	return {
		init 						: init,
		isCompliantXMLFile			: isCompliantXMLFile,
		getJSONFromXMLFile			: getJSONFromXMLFile
	};

}) (VISH, jQuery);