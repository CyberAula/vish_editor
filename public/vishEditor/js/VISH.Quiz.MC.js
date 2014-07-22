VISH.Quiz.MC = (function(V,$,undefined){

	var init = function(){
		_loadEvents();
	};

	var _loadEvents = function(){
	};

	/* Render the quiz in the DOM */
	var render = function(quizJSON,template){
		var quizId = quizJSON.quizId;
		var container = $("<div id='"+quizId+"' class='quizContainer mcContainer' type='"+V.Constant.QZ_TYPE.MCHOICE+"'></div>");

		var multipleAnswer = false;
		var inputType = 'radio';
		if((quizJSON.extras)&&(quizJSON.extras.multipleAnswer===true)){
			multipleAnswer = true;
			inputType = 'checkbox';
			$(container).attr("multipleAnswer",true);
		}

		//Question
		var questionWrapper = $("<div class='mc_question_wrapper, mc_question_wrapper_viewer'></div>");
		$(questionWrapper).html(quizJSON.question.wysiwygValue);
		$(container).append(questionWrapper);

		//Options
		var optionsWrapper = $("<table cellspacing='0' cellpadding='0' class='mc_options'></table>");

		//Shuffle choices?
		var quizChoices;
		if((quizJSON.settings)&&(quizJSON.settings.shuffleChoices===true)){
			quizChoices = V.Utils.shuffle((jQuery.extend(true, [], quizJSON.choices)));
		} else {
			quizChoices = quizJSON.choices;
		}
		
		var quizChoicesLength = quizChoices.length;
		for(var i=0; i<quizChoicesLength; i++){
			var option = quizChoices[i];
			var optionWrapper = $("<tr class='mc_option' choiceId='"+(option.id)+"'></tr>");
			var optionBox = $("<td><input class='mc_box' type='"+inputType+"' name='mc_option' value='"+i+"'/></td>");
			var optionIndex = $("<td><span class='mc_option_index mc_option_index_viewer'>"+String.fromCharCode(96+i+1)+") </span></td>");
			var optionText = $("<td><div class='mc_option_text mc_option_text_viewer'></div></td>");
			$(optionText).html(option.wysiwygValue);

			$(optionWrapper).append(optionBox);
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
		
		var answeredQuizCorrectly = false;
		var correctStatements = 0;
		var incorrectStatements = 0;
		var totalCorrectStatements = 0;

		var quizJSON = V.Quiz.getQuiz($(quiz).attr("id"));
		var quizChoices = quizJSON.choices;
		var quizChoicesById = {};
		$(quizChoices).each(function(index,quizChoice){
			quizChoicesById[quizChoice.id] = quizChoice;
		});

		var multipleAnswer = ((quizJSON.extras)&&(quizJSON.extras.multipleAnswer===true));

		//Color correct and wrong answers
		$(quiz).find("tr.mc_option").each(function(index,tr){
			var choiceId = $(tr).attr("choiceid");
			var choice = quizChoicesById[choiceId];

			if(choice.answer===true){
				totalCorrectStatements += 1;
			}

			var radioBox = $(tr).find("input[name='mc_option']");
			var answerValue = parseInt($(radioBox).attr("value"));

			if($(radioBox).is(':checked')){
				var trAnswer = $("tr.mc_option").has(radioBox);
				if(choice.answer===true){
					$(trAnswer).addClass("mc_correct_choice");
					correctStatements += 1;
				} else if(choice.answer===false){
					$(trAnswer).addClass("mc_wrong_choice");
					incorrectStatements += 1;
				}
			}
		});

		var answeredQuiz = (correctStatements+incorrectStatements>0);
		answeredQuizCorrectly = ((correctStatements>0)&&(incorrectStatements==0));

		if(multipleAnswer){
			totalCorrectStatements = Math.max(1,totalCorrectStatements);
			var quizScore = (Math.max(0,(correctStatements-incorrectStatements))/totalCorrectStatements)*100;
		} else {
			var quizScore = (answeredQuizCorrectly==true ? 100 : 0);
		}

		V.EventsNotifier.notifyEvent(V.Constant.Event.onAnswerQuiz,{"id": quizJSON.id, "quizId": quizJSON.quizId, "type": V.Constant.QZ_TYPE.MCHOICE, "correct": answeredQuizCorrectly, "multipleAnswer": multipleAnswer, "score": quizScore},true);

		var willRetry = (canRetry)&&(answeredQuizCorrectly===false);

		if(!willRetry){
			//Look and mark correct answers
			var trCorrectAnswers = [];
			$(quizChoices).each(function(index,quizChoice){
				if(quizChoice.answer===true){
					var trCorrect = $(quiz).find("tr.mc_option[choiceid='"+quizChoice.id+"']");
					trCorrectAnswers.push(trCorrect);
					if(answeredQuiz){
						$(trCorrect).addClass("mc_correct_choice");
					}
				}
			});
		}

		//Unfulfilled quiz
		if(!answeredQuiz){
			if(!willRetry){
				//Mark correct answers
				$(trCorrectAnswers).each(function(index,trCorrect){
					$(trCorrect).find("input[name='mc_option']").attr("checked","checked");
				});
			}
		}

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
		$(quizDOM).find("input[name='mc_option']").removeAttr("checked");
		_enableQuiz(quizDOM);
		V.Quiz.enableAnswerButton(quizDOM);
	};

	/* 
	* Methods used for Real Time Quizzes 
	*/

	var getReport = function(quiz){
		var report = {};
		report.answers = [];

		$(quiz).find("tr.mc_option").each(function(index,tr){
			var radioBox = $(tr).find("input[name='mc_option']");
			if($(radioBox).is(':checked')){
				var choiceId = $(tr).attr("choiceid");
				report.answers.push({choiceId: V.Quiz.getQuizChoiceOriginalId(choiceId).toString(), answer: "true"});
			}
		});

		report.empty = (report.answers.length===0);
		return report;
	};

	var disableQuiz = function(quiz){
		_disableQuiz(quiz);
		V.Quiz.disableAnswerButton(quiz);
	};

	var _disableQuiz = function(quiz){
		$(quiz).find("input[name='mc_option']").attr("disabled","disabled");
	};

	var _enableQuiz = function(quiz){
		$(quiz).find("input[name='mc_option']").removeAttr("disabled");
	};

	return {
		init                : init,
		render              : render,
		onAnswerQuiz        : onAnswerQuiz,
		onRetryQuiz			: onRetryQuiz,
		getReport           : getReport,
		disableQuiz         : disableQuiz
	};
	
}) (VISH, jQuery);