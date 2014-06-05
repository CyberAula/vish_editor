/*
 * Sorting Quiz Module
 */
VISH.Editor.Quiz.Open = (function(V,$,undefined){
	var initialized = false;
	var qCheckbox = "openQCheckbox";

	var SHORT_ANSWER_MAX_WORDS = 6;
	var SHORT_ANSWER_MAX_CHARS = 40;

	var init = function(){
		if(!initialized){
			$(document).on('click', '.' + 'openQContainer', _clickOnQuizArea);
			$(document).on('click','.'+ qCheckbox, _onCheckboxClick);
			initialized = true;
		}
	};

	/*
	 * Manage click events
	 */
	var _clickOnQuizArea = function(event){
		switch (event.target.classList[0]){
			case "openQContainer":
				V.Editor.setCurrentArea($("#" + event.target.parentElement.id));
				break;
			default:
				break;
		}
	};

	/*
	 * Change checkbox status
	 */
	var _onCheckboxClick = function(event){
		var check = $(event.target).attr("check");
		switch(check){
			case "true":
				V.Quiz.updateCheckbox(event.target,"none");
				break;
			case "false":
				//Not false in Open Quiz, just switch between true and none
				break;
			case "none":
			default:
				V.Quiz.updateCheckbox(event.target,"true");
				break;
		}
	};

	/*
	 * Create an empty Open Quiz
	 */
	var add = function(area){
		area.append(_getDummy());
		area.find(".menuselect_hide").remove(); 
		area.attr('type','quiz');
		area.attr('quiztype', V.Constant.QZ_TYPE.OPEN);
		_launchTextEditorForQuestion(area);
		_launchTextEditorForAnswer(area);
		V.Editor.addDeleteButton(area);
	};

	var _getDummy = function(){
		return "<div class='openQContainer'><div class='mc_question_wrapper'></div>" + _getAnswerDummy() + "<input type='hidden' name='quiz_id'/></div></div>";
	};

	var _getAnswerDummy = function(){
		return "<div class='openq_answer_wrapper'><div class='openq_answer_text'></div><table class='open_checks'><tr class='checkFirstRow'><td><img src='"+V.ImagesPath+ "quiz/checkbox.png' class='"+qCheckbox+"' check='none'/></td></tr></table></div>";
	};

	var _launchTextEditorForQuestion = function(area,question,callback){
		var textArea = $(area).find(".mc_question_wrapper");
		if(!question){
			V.Editor.Text.launchTextEditor({}, textArea, "", {forceNew: true, fontSize: 38, focus: true, autogrow: true});
		} else {
			V.Editor.Text.launchTextEditor({}, textArea, question, {autogrow: true});
		}
	};

	var _launchTextEditorForAnswer = function(area,answer,callback){
		var textArea = $(area).find(".openq_answer_text");
		if(!answer){
			V.Editor.Text.launchTextEditor({}, textArea, V.I18n.getTrans("i.QuizzesWriteOptionsOpen"), {forceNew: true, fontSize: 24, autogrow: true, placeholder: true, onKeyup: _onAnswerKeyUp, callback: callback});
		} else {
			V.Editor.Text.launchTextEditor({}, textArea, answer, {autogrow: true, onKeyup: _onAnswerKeyUp, callback: callback});
		}
	};

	var _onAnswerKeyUp = function(area,ckeditorInstance){
		var checkBox = $(area).parent().find("img.openQCheckbox");
		var checkBoxDisabled = $(checkBox).hasClass("quizCheckBoxDisabled");
		var answer = ckeditorInstance.getPlainText();
		try {
			var charCount = answer.length;
			var wordCount = answer.match(/\w+/g).length;
		} catch(e){
			var charCount = 0;
			var wordCount = 0;
		}
		
		if((wordCount > SHORT_ANSWER_MAX_WORDS)||(charCount > SHORT_ANSWER_MAX_CHARS)){
			if(!checkBoxDisabled){
				_disableCheckBox(checkBox);
			}
		} else {
			if(checkBoxDisabled){
				_enableCheckBox(checkBox);
			}
		}
	};

	var _disableCheckBox = function(checkbox){
		$(checkbox).addClass("quizCheckBoxDisabled");
		$(checkbox).prop("disabled", true);
		V.Quiz.updateCheckbox(checkbox,"none");
	};

	var _enableCheckBox = function(checkbox){
		$(checkbox).removeClass("quizCheckBoxDisabled");
		$(checkbox).prop("disabled", false);
		V.Quiz.updateCheckbox(checkbox,"none");
	};

	var _isSelfAssesment = function(area){
		var openCheckBox = $(area).find("img.openQCheckbox");
		return ($(openCheckBox).attr("check")==="true" && $(openCheckBox).hasClass("quizCheckBoxDisabled")===false);
	};


	/*
	 * Generate JSON
	 */
	var save = function(area){
		var textArea = $(area).find(".mc_question_wrapper");

		var quiz = {};
		quiz.quizType = V.Constant.QZ_TYPE.OPEN;

		quiz.selfA = _isSelfAssesment(area);

		var questionInstance = V.Editor.Text.getCKEditorFromTextArea($(area).find(".mc_question_wrapper"));
		quiz.question = {};
		quiz.question.value = questionInstance.getPlainText();
		quiz.question.wysiwygValue = questionInstance.getData();

		var answerInstance = V.Editor.Text.getCKEditorFromTextArea($(area).find(".openq_answer_text"));
		quiz.answer = {};
		quiz.answer.value = answerInstance.getPlainText();
		quiz.answer.wysiwygValue = answerInstance.getData();

		return quiz;
	};

	/*
	 * Render the quiz in the editor
	 * area is the slide and contains all the required parameters
	 */
	var draw = function(area,quiz){
		//Draw question
		$(area).append(_getDummy());
		$(area).attr('type', V.Constant.QUIZ);
		$(area).attr('quiztype', V.Constant.QZ_TYPE.OPEN);
		_launchTextEditorForQuestion(area,quiz.question.wysiwygValue);
		_launchTextEditorForAnswer(area,quiz.answer.wysiwygValue, function(){
			//Success callback
			//Disable checkbox if quiz answer is too long
			var openQAnswerTextArea = $(area).find("div.openq_answer_text");
			_onAnswerKeyUp(openQAnswerTextArea,V.Editor.Text.getCKEditorFromTextArea(openQAnswerTextArea));
		});

		//Enable checkbox if quiz is selfA
		if(quiz.selfA){
			var checkBox = $(area).find("img.openQCheckbox");
			_enableCheckBox(checkBox);
			V.Quiz.updateCheckbox(checkBox,"true");
		}

		V.Editor.addDeleteButton(area);
	};

	return {
		init			: init, 
		add				: add,
		save			: save,
		draw			: draw
	};

}) (VISH, jQuery);