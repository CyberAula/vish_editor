VISH.Quiz.TF = (function(V,$,undefined){
  
	var init = function(){
		_loadEvents();
	};

	var _loadEvents = function(){
	};

	var render = function(quizJSON,template){
		var quizId = quizJSON.quizId;
		var container = $("<div id='"+quizId+"' class='quizContainer mcContainer' type='"+V.Constant.QZ_TYPE.TF+"'></div>");

		//Question
		var questionWrapper = $("<div class='mc_question_wrapper, mc_question_wrapper_viewer'></div>");
		$(questionWrapper).html(quizJSON.question.wysiwygValue);
		$(container).append(questionWrapper);

		//Options
		var optionsWrapper = $("<table cellspacing='0' cellpadding='0' class='tf_options'></table>");

		//TF head
		var newTr = $("<tr class='mc_option tf_head'><td><img src='"+V.ImagesPath+ "quiz/checkbox_checked.png' class='tfCheckbox_viewer'/></td><td><img src='"+V.ImagesPath+ "quiz/checkbox_wrong.png' class='tfCheckbox_viewer'/></td><td></td><td></td></tr>");
		$(optionsWrapper).prepend(newTr);

		var quizChoicesLength = quizJSON.choices.length;
		for(var i=0; i<quizChoicesLength; i++){
			var option = quizJSON.choices[i];
			var optionWrapper = $("<tr class='mc_option' choiceId='"+(option.id)+"'></tr>");
			var optionBox1 = $("<td><input class='tf_radio' type='radio' name='tf_radio"+i+"' column='true'  /></td>");
			var optionBox2 = $("<td><input class='tf_radio' type='radio' name='tf_radio"+i+"' column='false' /></td>");
			var optionIndex = $("<td><span class='mc_option_index mc_option_index_viewer'>"+String.fromCharCode(96+i+1)+") </span></td>");
			var optionText = $("<td><div class='mc_option_text mc_option_text_viewer'></div></td>");
			$(optionText).html(option.wysiwygValue);

			$(optionWrapper).append(optionBox1);
			$(optionWrapper).append(optionBox2);
			$(optionWrapper).append(optionIndex);
			$(optionWrapper).append(optionText);
			$(optionsWrapper).append(optionWrapper);
		}

		$(container).append(optionsWrapper);

		var quizButtons = V.Quiz.renderButtons(quizJSON);
		$(container).append(quizButtons);

		return V.Utils.getOuterHTML(container);
	};


	/* 
	* Methods used for Self-assesment 
	*/

	/* Update UI after answer */
	var onAnswerQuiz = function(quiz,options){
		var afterAnswerAction = ((typeof options.afterAnswerAction != "undefined")&&(typeof options.afterAnswerAction == "string")) ? options.afterAnswerAction : "disabled";
		var canRetry = ((typeof options.canRetry != "undefined")&&(typeof options.canRetry == "boolean")) ? options.canRetry : false;

		var answeredQuizCorrectly = true;

		var quizJSON = V.Quiz.getQuiz($(quiz).attr("id"));
		var quizChoices = quizJSON.choices;
		var quizChoicesById = {};
		$(quizChoices).each(function(index,quizChoice){
			quizChoicesById[quizChoice.id] = quizChoice;
		});

		$(quiz).find("tr.mc_option").not(".tf_head").each(function(index,tr){
			var trueRadio = $(tr).find("input[type='radio'][column='true']")[0];
			var falseRadio = $(tr).find("input[type='radio'][column='false']")[0];

			var myAnswer;
			if($(trueRadio).is(':checked')){
				myAnswer = true;
			} else if($(falseRadio).is(':checked')){
				myAnswer = false;
			} else {
				myAnswer = undefined;
			}

			var choiceId = $(tr).attr("choiceid");
			var choice = quizChoicesById[choiceId];
			var choiceHasAnswer = (typeof choice.answer == "boolean");

			if(choiceHasAnswer){
				var trChoice = $(quiz).find("tr.mc_option").not(".tf_head")[index];
				if(myAnswer===choice.answer){
					$(trChoice).addClass("mc_correct_choice");
				} else if(typeof myAnswer != "undefined"){
					answeredQuizCorrectly = false;
					$(trChoice).addClass("mc_wrong_choice");
				} else {
					//No answer selected
					answeredQuizCorrectly = false;
					if(!canRetry){
						//Mark correct answer
						if(choice.answer===true){
							$(trueRadio).attr('checked', true);
						} else if(choice.answer===false){
							$(falseRadio).attr('checked', true);
						}
					}
				}
			}
		});

		var willRetry = (canRetry)&&(answeredQuizCorrectly===false);

		if(willRetry){
			//Retry
			_disableQuiz(quiz);
			V.Quiz.retryAnswerButton(quiz);
		} else {
			switch(afterAnswerAction){
				case "continue":
					V.Quiz.continueAnswerButton(quiz);
					break;
				case "disabled":
				default:
					disableQuiz(quiz);
					break;
			};
		}
	};

	/* Reset UI to make possible to answer again the quiz */
	var onRetryQuiz = function(quizDOM){
		$(quizDOM).find("tr").removeClass("mc_correct_choice");
		$(quizDOM).find("tr").removeClass("mc_wrong_choice");
		$(quizDOM).find("input[type='radio']").removeAttr("checked");
		_enableQuiz(quizDOM);
		V.Quiz.enableAnswerButton(quizDOM);
	};


	/* 
	* Methods used for Real Time Quizzes 
	*/

	var getReport = function(quiz){
		var report = {};
		report.answers = [];
		report.empty = true;

		$(quiz).find("tr.mc_option").not(".tf_head").each(function(index,tr){
			var trueRadio = $(tr).find("input[type='radio'][column='true']")[0];
			var falseRadio = $(tr).find("input[type='radio'][column='false']")[0];

			var choiceId = $(tr).attr("choiceid");
			var originalChoiceId = V.Quiz.getQuizChoiceOriginalId(choiceId);

			if($(trueRadio).is(':checked')){
				report.answers.push({choiceId: originalChoiceId.toString(), answer: "true"});
				report.empty = false;
			} else if($(falseRadio).is(':checked')){
				report.answers.push({choiceId: originalChoiceId.toString(), answer: "false"});
				report.empty = false;
			} else {
				report.answers.push({choiceId: originalChoiceId.toString(), answer: "none"});
			}
		});

		return report;
	};

	var disableQuiz = function(quiz){
		_disableQuiz(quiz);
		V.Quiz.disableAnswerButton(quiz);
	};

	var _disableQuiz = function(quiz){
		$(quiz).find("input[type='radio']").attr("disabled","disabled");
	};

	var _enableQuiz = function(quiz){
		$(quiz).find("input[type='radio']").removeAttr("disabled");
	};

	return {
		init          : init,
		render        : render,
		onAnswerQuiz  : onAnswerQuiz,
		onRetryQuiz	  : onRetryQuiz,
		getReport     : getReport,
		disableQuiz   : disableQuiz
	};
	
}) (VISH, jQuery);

 