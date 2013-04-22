/*
 * Multiple Choice Quiz Module
 */
VISH.Editor.Quiz.MC = (function(V,$,undefined){
	var choicesLetters = ['a)','b)','c)','d)','e)','f)','g)','h)','i)','j)','k)','l)','m)','n)','o)','p)','q)','r)','s)'];
	var addQuizOptionButtonClass = "add_quiz_option_mc";
	var deleteQuizOptionButtonClass = "delete_quiz_option_mc";
	var mcCheckbox = "mcCheckbox";
	var initialized = false;

	var init = function(){
		if(!initialized){
			$(document).on('click', '.' + 'mcContainer', _clickOnQuizArea);
			$(document).on('click','.'+ addQuizOptionButtonClass, _clickToAddOptionInQuiz);
			$(document).on('click','.'+ deleteQuizOptionButtonClass, _removeOptionInQuiz);
			$(document).on('click','.'+ mcCheckbox, _onCheckboxClick);
			initialized = true;
		}
	};

	/*
	 * Manage click events
	 */
	var _clickOnQuizArea = function (event) {
		switch (event.target.classList[0]) {
			case "mcContainer":
				V.Editor.setCurrentArea($("#" + event.target.parentElement.id));
				break;
			case "mc_option_text":
				V.Editor.setCurrentArea($("#" + event.target.parentElement.parentElement.parentElement.parentElement.id));
				break;
			case "mc_option":
				V.Editor.setCurrentArea($("#" + event.target.parentElement.parentElement.parentElement.id));
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
				//Not false in MC, just switch between true and none
				break;
			case "none":
			default:
				V.Quiz.updateCheckbox(event.target,"true");
				break;
		}
	}

	/*
	 * Create an empty MC Quiz
	 */
	var add = function(area) {
		area.append(_getDummy());
		area.find(".menuselect_hide").remove(); 
		area.attr('type','quiz');
		area.attr('quiztype', V.Constant.QZ_TYPE.MCHOICE);
		_launchTextEditorForQuestion(area);
		_addOptionInQuiz(area);
		V.Editor.addDeleteButton(area);
	};

	var _getDummy = function(){
		return "<div class='mcContainer'><div class='mc_question_wrapper'></div><ul class='mc_options'></ul><img src='"+V.ImagesPath+ "icons/add.png' class='"+addQuizOptionButtonClass+"'/><input type='hidden' name='quiz_id'/></div></div>";
	}

	var _getOptionDummy = function(){
		return "<li class='mc_option'><div class='mc_option_wrapper'><span class='mc_option_index'></span><div class='mc_option_text'></div><table class='mc_checks'><tr class='checkFirstRow'><td><img src='"+V.ImagesPath+ "icons/ve_delete.png' class='"+deleteQuizOptionButtonClass+"'/></td><td><img src='"+V.ImagesPath+ "quiz/checkbox.jpg' class='"+mcCheckbox+"' check='none'/></td></tr></table></div></li>";
	}

	/*
	 * AddOptionInQuiz called from click event
	 */
	var _clickToAddOptionInQuiz = function (event) {
		var area = $("#" + event.target.parentElement.parentElement.id);
		V.Editor.setCurrentArea(area);
		_addOptionInQuiz(area);
	}

	var _addOptionInQuiz = function (area,value,check) {
		var nChoices = $(area).find("li.mc_option").size();
		var quiz_option = _getOptionDummy();
		var quiz_option = $(quiz_option).attr("nChoice",(nChoices+1));
		$(area).find(".mc_options").append(quiz_option);
		_refreshChoicesIndexs(area);
		if(check){
			V.Quiz.updateCheckbox($(quiz_option).find("td > img")[1],check);
		}
		_launchTextEditorForOptions(area, nChoices,value);
		if(nChoices>0) {
			$(area).find("li[nChoice='"+(nChoices+1)+"']").find("."+deleteQuizOptionButtonClass).css("visibility","visible");
		}
	};

	var _removeOptionInQuiz = function (event) {
		var area = $("div[type='quiz']").has(event.target);
		V.Editor.setCurrentArea(area);
		var liToRemove = $("li.mc_option").has(event.target);
		$(liToRemove).remove();
		_refreshChoicesIndexs(area);
	};

	var _refreshChoicesIndexs = function(area){
		var nChoices = $(area).find("li.mc_option").size(); 
		$(area).find("li.mc_option").each(function(index, option_element) {
			$(option_element).find(".mc_option_index").text(_getChoiceLetter(nChoices,index+1));
		});
	}

	var _getChoiceLetter = function(nChoices,nChoice){
		if(nChoices<=choicesLetters.length){
			return choicesLetters[nChoice-1];
		} else {
			return ((nChoice)+")");
		}
	}

	var _launchTextEditorForQuestion = function(area,question){
		var textArea = $(area).find(".mc_question_wrapper");
		if(!question){
			V.Editor.Text.launchTextEditor({}, textArea, "", {forceNew: true, fontSize: 38, focus: true, autogrow: true});
		} else {
			V.Editor.Text.launchTextEditor({}, textArea, question, {autogrow: true});
		}
	}

	var _launchTextEditorForOptions = function(area,nChoice,value){
		var first = (nChoice===0);
		var textArea = $(area).find(".mc_option_text")[nChoice];
		if(!value){
			if(first){
				V.Editor.Text.launchTextEditor({}, textArea, "Write options here", {forceNew: true, fontSize: 24, autogrow: true, placeholder: true});
			} else {
				V.Editor.Text.launchTextEditor({}, textArea, "", {forceNew: true, fontSize: 24, autogrow: true, focus: true});
			}
		}else{
			V.Editor.Text.launchTextEditor({}, textArea, value, {autogrow: true});
		}
	}

	/*
	 * Generate JSON
	 */
	 var save = function(area){
	 	var textArea = $(area).find(".mc_question_wrapper");
	 	var quiz = {};
	 	quiz.quizType = VISH.Constant.QZ_TYPE.MCHOICE;
	 	// Self-assessment (Autoevaluación)
	 	quiz.selfA = false; //false by default
	 	quiz.extras = {};
	 	quiz.extras.multipleAnswer = false; //false by default
	 	var nAnswers = 0;

	 	var questionInstance = V.Editor.Text.getCKEditorFromTextArea($(area).find(".mc_question_wrapper"));
	 	quiz.question = {};
	 	quiz.question.value = questionInstance.getPlainText();
	 	quiz.question.wysiwygValue = questionInstance.getData();
	 	
	 	quiz.choices = [];

	 	var nChoices = $(area).find("li.mc_option").size();
	 	var optionTextAreas = $(area).find(".mc_option_text");

	 	for(var i=0; i<nChoices; i++){
	 		var textArea = optionTextAreas[i];
	 		var optionInstance = V.Editor.Text.getCKEditorFromTextArea(textArea);
	 		var choice = {};
	 		choice.id = (i+1).toString();
	 		choice.value = optionInstance.getPlainText();
	 		choice.wysiwygValue = optionInstance.getData();
	 		if($(textArea).parent().find(".mcCheckbox").attr("check")==="true"){
	 			choice.answer = true;
	 			quiz.selfA = true;
	 			nAnswers++;
	 		} else {
	 			choice.answer = "?";
	 		}
	 		quiz.choices.push(choice);
	 	}

	 	if(quiz.selfA){
		 	$(quiz.choices).each(function(index,choice){
		 		if(choice.answer !== true){
		 			choice.answer = false;
		 		}
		 	});
	 	}

	 	if(nAnswers>1){
	 		quiz.extras.multipleAnswer = true;
	 	}

	 	return quiz;
	 }

	/*
	 * Render the quiz in the editor
	 * slide is the area and contains all the required parameters
	 */
	var draw = function(area,quiz){
		//Draw question
		$(area).append(_getDummy());
		$(area).attr('type','quiz');
		$(area).attr('quiztype', VISH.Constant.QZ_TYPE.MCHOICE);
		_launchTextEditorForQuestion(area,quiz.question.wysiwygValue);
		V.Editor.addDeleteButton(area);

		//Draw choices (checking selfA)
		$(quiz.choices).each(function(index,choice){
			var check = undefined;
			if(quiz.selfA){
				if(choice.answer===true){
					check = "true";
				}
			}
			_addOptionInQuiz(area,choice.wysiwygValue,check);
		});
	};

	return {
		init			: init, 
		add				: add,
		save			: save,
		draw			: draw
	};

}) (VISH, jQuery);