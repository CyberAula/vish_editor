VISH.Quiz.Sorting = (function(V,$,undefined){

	var init = function(){
		_loadEvents();
	};

	var _loadEvents = function(){
		$("section.slides").find("div.quizContainer[type='sorting'] table.sorting_options tbody").each(function(index,tableTbody){
			_applySortable(tableTbody);
		});
	};

	var _applySortable = function(tableTbody){
		$(tableTbody).sortable({
			cursor: 'move',
			scroll: false,
			start: function(event,ui){
			},
			stop: function(event,ui){
				var trOption = ui.item;
				_refreshChoicesIndex(trOption);
			}
		});
	};

	var _refreshChoicesIndex = function(trOption){
		var tableTBody = $(trOption).parent();
		$(tableTBody).find("tr").each(function(index,tr){
			$($(tr).find("td")[0]).html("<span class='mc_option_index sorting_option_index sorting_option_index_viewer'>"+(index+1)+") </span>");
		});
	};

	/* Render the quiz in the DOM */
	var render = function(quizJSON,template){
		var quizId = quizJSON.quizId;
		var container = $("<div id='"+quizId+"' class='quizContainer sortingQContainer' type='"+V.Constant.QZ_TYPE.SORTING+"'></div>");

		//Question
		var questionWrapper = $("<div class='mc_question_wrapper, mc_question_wrapper_viewer'></div>");
		$(questionWrapper).html(quizJSON.question.wysiwygValue);
		$(container).append(questionWrapper);

		//Options
		var optionsWrapper = $("<table cellspacing='0' cellpadding='0' class='sorting_options'></table>");

		//Shuffle choices (always)
		var quizChoices = V.Utils.shuffle((jQuery.extend(true, [], quizJSON.choices)));
		var quizChoicesLength = quizChoices.length;
		for(var i=0; i<quizChoicesLength; i++){
			var option = quizChoices[i];
			var optionWrapper = $("<tr class='mc_option' choiceId='"+(option.id)+"'></tr>");
			var optionIndex = $("<td><span class='mc_option_index sorting_option_index sorting_option_index_viewer'>"+(i+1)+") </span></td>");
			var optionText = $("<td></td>");
			var optionTextWrapper = $("<div class='sorting_option_text_wrapper_viewer'></div>");
			$(optionTextWrapper).html(option.wysiwygValue);
			$(optionText).append(optionTextWrapper);

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
		
		var answeredQuiz = true;
		var answeredQuizCorrectly = false;
		var answeredQuizWrong = false;

		var quizJSON = V.Quiz.getQuiz($(quiz).attr("id"));
		var quizChoices = quizJSON.choices;
		var quizChoicesById = {};
		$(quizChoices).each(function(index,quizChoice){
			quizChoicesById[quizChoice.id] = quizChoice;
		});

		//Color correct and wrong answers
		$(quiz).find("tr.mc_option").each(function(index,tr){
			var choiceId = $(tr).attr("choiceid");
			var choice = quizChoicesById[choiceId];
			var answerValue = index+1;

			if(choice.answer===answerValue){
				$(tr).addClass("mc_correct_choice");
				answeredQuizCorrectly = true;
			} else {
				$(tr).addClass("mc_wrong_choice");
				answeredQuizWrong = true;
			}
		});

		answeredQuizCorrectly = (answeredQuizCorrectly)&&(!answeredQuizWrong);
		var quizScore = (answeredQuizCorrectly==true ? 100 : 0);

		V.EventsNotifier.notifyEvent(V.Constant.Event.onAnswerQuiz,{"id": quizJSON.id, "quizId": quizJSON.quizId, "type": V.Constant.QZ_TYPE.SORTING, "correct": answeredQuizCorrectly, "score": quizScore},true);

		var willRetry = (canRetry)&&(answeredQuizCorrectly===false);

		if(!willRetry){
			//Look and mark correct answers
			var trCorrectAnswers = [];
			$(quizChoices).each(function(index,quizChoice){
				var answerValue = index+1;
				if(quizChoice.answer===answerValue){
					var trCorrect = $(quiz).find("tr.mc_option[choiceid='"+quizChoice.id+"']");
					trCorrectAnswers.push(trCorrect);
					if(answeredQuiz){
						$(trCorrect).addClass("mc_correct_choice");
					}
				}
			});
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
		_enableQuiz(quizDOM);
		V.Quiz.enableAnswerButton(quizDOM);
	};

	/* 
	* Methods used for Real Time Quizzes 
	*/

	var getReport = function(quiz){
		var report = {};
		report.answers = [];

		var quizJSON = V.Quiz.getQuiz($(quiz).attr("id"));
		var quizChoices = quizJSON.choices;
		var quizChoicesById = {};
		$(quizChoices).each(function(index,quizChoice){
			quizChoicesById[quizChoice.id] = quizChoice;
		});

		//Check if quiz has been answered correctly
		var answeredQuizCorrectly = false;
		var answeredQuizWrong = false;
		var quizAnswered = false;

		$(quiz).find("tr.mc_option").each(function(index,tr){
			var choiceId = $(tr).attr("choiceid");
			var choice = quizChoicesById[choiceId];
			var answerValue = index+1;

			if(choice.answer===answerValue){
				answeredQuizCorrectly = true;
			} else {
				answeredQuizWrong = true;
			}
			quizAnswered = true;

			report.answers.push({choiceId: V.Quiz.getQuizChoiceOriginalId(choiceId).toString(), answer: answerValue});
		});

		answeredQuizCorrectly = ((answeredQuizCorrectly)&&(!answeredQuizWrong));

		if(quizAnswered){
			report.answers.push({selfAssessment: { result: answeredQuizCorrectly }});
		}

		report.empty = (report.answers.length===0);
		return report;
	};

	var disableQuiz = function(quiz){
		_disableQuiz(quiz);
		V.Quiz.disableAnswerButton(quiz);
	};

	var _disableQuiz = function(quiz){
		var tableTBody = $(quiz).find("table.sorting_options tbody");
		$(tableTBody).sortable('disable');
	};

	var _enableQuiz = function(quiz){
		var tableTBody = $(quiz).find("table.sorting_options tbody");
		$(tableTBody).sortable("enable");
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