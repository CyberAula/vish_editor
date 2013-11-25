VISH.Quiz.MC = (function(V,$,undefined){
  
  var choices = {};

  var init = function(){
	  _loadEvents();
  };

  var _loadEvents = function(){
  }

	/* Render the quiz in the DOM */
	var render = function(slide,template){
		var quizId = V.Utils.getId();
		var container = $("<div id='"+quizId+"' class='quizContainer mcContainer' type='"+V.Constant.QZ_TYPE.MCHOICE+"'></div>");

		var multipleAnswer = false;
		var inputType = 'radio';
		if((slide.extras)&&(slide.extras.multipleAnswer===true)){
			multipleAnswer = true;
			inputType = 'checkbox';
			$(container).attr("multipleAnswer",true);
		}

		//Question
		var questionWrapper = $("<div class='mc_question_wrapper, mc_question_wrapper_viewer'></div>");
		$(questionWrapper).html(slide.question.wysiwygValue);
		$(container).append(questionWrapper);

		//Options
		var optionsWrapper = $("<table cellspacing='0' cellpadding='0' class='mc_options'></table>");
		choices[quizId] = [];

		for(var i=0; i<slide.choices.length; i++){
			var option = slide.choices[i];
			var optionWrapper = $("<tr class='mc_option' nChoice='"+(i+1)+"'></tr>");
			var optionBox = $("<td><input class='mc_box' type='"+inputType+"' name='mc_option' value='"+i+"'/></td>");
			var optionIndex = $("<td><span class='mc_option_index mc_option_index_viewer'>"+String.fromCharCode(96+i+1)+") </span></td>");
			var optionText = $("<td><div class='mc_option_text mc_option_text_viewer'></div></td>");
			$(optionText).html(option.wysiwygValue);

			$(optionWrapper).append(optionBox);
			$(optionWrapper).append(optionIndex);
			$(optionWrapper).append(optionText);
			$(optionsWrapper).append(optionWrapper);

			choices[quizId].push(option);
		}

		$(container).append(optionsWrapper);

		var quizButtons = V.Quiz.renderButtons(slide.selfA);
		$(container).append(quizButtons);

		return V.Utils.getOuterHTML(container);
	};


	/* 
	* Methods used for Self-assesment 
	*/

	/* Update UI after answer */
	var onAnswerQuiz = function(quiz){
		var answeredQuiz = false;
		var quizChoices = choices[$(quiz).attr("id")];

		//Color correct and wrong answers
		$(quiz).find("input[name='mc_option']").each(function(index,radioBox){
			var answerValue = parseInt($(radioBox).attr("value"));
			var choice = quizChoices[answerValue];

			if($(radioBox).is(':checked')){
				var trAnswer = $("tr.mc_option").has(radioBox);
				if(choice.answer===true){
					$(trAnswer).addClass("mc_correct_choice");
				} else if(choice.answer===false){
					$(trAnswer).addClass("mc_wrong_choice");
				}
				answeredQuiz = true;
			}
		});

		//Look and mark correct answers
		var trCorrectAnswers = [];
		for (var key in quizChoices){
			if(quizChoices[key].answer===true){
				//Get correct choice
				var trCorrect = $(quiz).find("tr.mc_option")[key];
				trCorrectAnswers.push($(quiz).find("tr.mc_option")[key]);
				if(answeredQuiz){
					$(trCorrect).addClass("mc_correct_choice");
				}
			}
		}

		//Unfulfilled quiz
		if(!answeredQuiz){
			//Mark correct answers without colors
			$(trCorrectAnswers).each(function(index,trCorrect){
				$(trCorrect).find("input[name='mc_option']").attr("checked","checked");
			});
		}

		// TODO: decide if retry answer based on the number of attempts of the quiz
		// V.Quiz.retryAnswerButton(quiz);
		disableQuiz(quiz);
	}

	/* Reset UI to make possible to answer again the quiz */
	var onRetryQuiz = function(quizDOM){
		$(quizDOM).find("tr").removeClass("mc_correct_choice");
		$(quizDOM).find("tr").removeClass("mc_wrong_choice");
		$(quizDOM).find("input[name='mc_option']").removeAttr("checked");
		V.Quiz.enableAnswerButton(quizDOM);
	}

	/* 
	* Methods used for Real Time Quizzes 
	*/

	var getReport = function(quiz){
		var report = {};
		report.answers = [];

		$(quiz).find("input[name='mc_option']").each(function(index,radioBox){
			if($(radioBox).is(':checked')){
				report.answers.push({no: (index+1).toString(), answer: "true"});
			}
		});

		report.empty = (report.answers.length===0);
		return report;
	}

	var disableQuiz = function(quiz){
		$(quiz).find("input[name='mc_option']").attr("disabled","disabled");
		V.Quiz.disableAnswerButton(quiz);
	}

	/*
	* Data representation
	*/
	var drawResults = function(quiz,results,options){
		var canvas = $("#quiz_chart");
		var nAnswers = $(quiz).find("tr.mc_option[nChoice]").length;

		var quizType;
		if($(quiz).attr("multipleAnswer")==="true"){
			quizType = V.Constant.QZ_TYPE.MCHOICE_MANSWER;
		} else {
			quizType = V.Constant.QZ_TYPE.MCHOICE;
		}

		V.QuizCharts.drawQuizChart(canvas,quizType,nAnswers,results,options);
	}

	return {
		init                : init,
		render              : render,
		onAnswerQuiz        : onAnswerQuiz,
		onRetryQuiz			: onRetryQuiz,
		getReport           : getReport,
		disableQuiz         : disableQuiz,
		drawResults         : drawResults
	};
	
}) (VISH, jQuery);

 