/*
 * Multiple Choice Quiz Module
 */
VISH.Editor.Quiz.MC = (function(V,$,undefined){
	var choicesLetters = ['a)','b)','c)','d)','e)','f)','g)','h)','i)','j)','k)','l)','m)','n)','o)','p)','q)','r)','s)'];
	var addQuizOptionButtonClass = "add_quiz_option_button";
	var deleteQuizOptionButtonClass = "delete_quiz_option_button";
	var mcCheckbox = "mcCheckbox";

	var init = function(){
		$(document).on('click', '.' + 'mcContainer', _clickOnQuizArea);
		$(document).on('click','.'+ addQuizOptionButtonClass, _addOptionInQuiz);
		$(document).on('click','.'+ deleteQuizOptionButtonClass, _removeOptionInQuiz);
		$(document).on('click','.'+ mcCheckbox, _onCheckboxClick);

	};


	/*
	 * Manage click events
	 */
	var _clickOnQuizArea = function (event) {
		switch (event.target.classList[0]) {
			case "mcContainer":
				V.Editor.setCurrentArea($("#" + event.target.parentElement.id));
				break;
			case "multiplechoice_option_in_zone":
				V.Editor.setCurrentArea($("#" + event.target.parentElement.parentElement.parentElement.parentElement.id));
				break;
			case "li_mch_options_in_zone":
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
		var imagePathRoot = V.ImagesPath+ "quiz/checkbox";
		var check = $(event.target).attr("check");
		switch(check){
			case "true":
				$(event.target).attr("check","none");
				$(event.target).attr("src",imagePathRoot+".jpg");
				break;
			case "false":
				//Not false in MC, just switch between true and none
				break;
			case "none":
			default:
				$(event.target).attr("check","true");
				$(event.target).attr("src",imagePathRoot+"_checked.jpg");
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
		area.attr('quiztype', VISH.Constant.QZ_TYPE.MCHOICE);
		launchTextEditorForQuestion(area);
		addOptionInQuiz(area);
		V.Editor.addDeleteButton(area);
	};

	var _getDummy = function(){
		return "<div class='mcContainer'><div class='value_multiplechoice_question_in_zone'></div><ul class='ul_mch_options_in_zone'></ul><img src='"+V.ImagesPath+ "icons/add.png' class='"+addQuizOptionButtonClass+"'/><input type='hidden' name='quiz_id'/></div></div>";
	}

	var _getOptionDummy = function(){
		return quizOptionDummies = "<li class='li_mch_options_in_zone'><div class='mc_option_wrapper'><span class='quiz_option_index'></span><div class='multiplechoice_option_in_zone'></div><table class='MCchecks'><tr class='checkFirstRow'><td><img src='"+V.ImagesPath+ "icons/ve_delete.png' class='"+deleteQuizOptionButtonClass+"'/></td><td><img src='"+V.ImagesPath+ "quiz/checkbox.jpg' class='"+mcCheckbox+"' check='none'/></td></tr></table></div></li>";
	}

	/*
	 * AddOptionInQuiz called from click event
	 */
	var _addOptionInQuiz = function (event) {
		var area = $("#" + event.target.parentElement.parentElement.id);
		V.Editor.setCurrentArea(area);
		addOptionInQuiz(area);
	}

	var addOptionInQuiz = function (area) {
		var quiz_option = _getOptionDummy();
		var nChoices = $(area).find(".li_mch_options_in_zone").size(); 
		var quiz_option = $(quiz_option).attr("nChoice",(nChoices+1));
		$(area).find(".ul_mch_options_in_zone").append(quiz_option);
		_refreshChoicesIndexs(area);
		launchTextEditorForOptions(area, nChoices);
		if(nChoices>0) {
			$(area).find("li[nChoice='"+(nChoices+1)+"']").find("."+deleteQuizOptionButtonClass).css("visibility","visible");
		}
	};


	var _removeOptionInQuiz = function (event) {
		var area = $("div[type='quiz']").has(event.target);
		V.Editor.setCurrentArea(area);
		var liToRemove = $("li.li_mch_options_in_zone").has(event.target);
		$(liToRemove).remove();
		_refreshChoicesIndexs(area);
	};

	var _refreshChoicesIndexs = function(area){
		var nChoices = $(area).find(".li_mch_options_in_zone").size(); 
		$(area).find(".li_mch_options_in_zone").each(function(index, option_element) {
			$(option_element).find(".quiz_option_index").text(_getChoiceLetter(nChoices,index+1));
		});
	}

	var _getChoiceLetter = function(nChoices,nChoice){
		if(nChoices<=choicesLetters.length){
			return choicesLetters[nChoice-1];
		} else {
			return ((nChoice)+")");
		}
	}

	var launchTextEditorForQuestion = function(area){
		var textArea = $(area).find(".value_multiplechoice_question_in_zone");
		V.Editor.Text.launchTextEditor({}, textArea, "", {quiz: true, forceNew: true, fontSize: 38, focus: true, autogrow: true});
	}

	var launchTextEditorForOptions = function(area,option_number){
		var first = (option_number===0);
		var textArea = $(area).find(".multiplechoice_option_in_zone")[option_number];
		if(first){
			V.Editor.Text.launchTextEditor({}, textArea, "Write options here", {forceNew: true, fontSize: 24, autogrow: true, placeholder: true});
		} else {
			V.Editor.Text.launchTextEditor({}, textArea, "", {forceNew: true, fontSize: 24, autogrow: true, focus: true});
		}
	}

	/*
	 * Generate JSON
	 */
	 var save = function(area){
	 	var textArea = $(area).find(".value_multiplechoice_question_in_zone");
	 	var quiz = {};
	 	quiz.quizType = VISH.Constant.QZ_TYPE.MCHOICE;
	 	// Self-assessment (Autoevaluación)
	 	quiz.selfA = false; //false by default

	 	var questionInstance = V.Editor.Text.getCKEditorFromTextArea($(area).find(".value_multiplechoice_question_in_zone"));
	 	quiz.question = {};
	 	quiz.question.value = questionInstance.getPlainText();
	 	quiz.question.wysiwygValue = questionInstance.getData();
	 	
	 	quiz.choices = [];

	 	var nChoices = $(area).find(".li_mch_options_in_zone").size();
	 	var optionTextAreas = $(area).find(".multiplechoice_option_in_zone");

	 	for(var i=0; i<nChoices; i++){
	 		var textArea = optionTextAreas[i];
	 		var optionInstance = V.Editor.Text.getCKEditorFromTextArea(textArea);
	 		var choice = {};
	 		choice.value = optionInstance.getPlainText();
	 		choice.wysiwygValue = optionInstance.getData();
	 		if($(textArea).parent().find(".mcCheckbox").attr("check")==="true"){
	 			choice.answer = true;
	 			quiz.selfA = true;
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

	 	return quiz;
	 }

	/*
	 * Render the quiz in the editor
	 * slide is the area and contains all the required parameters
	 */
	var draw = function(slide){
		console.log("Draw MC!");
		
		//Add empty question
		console.log(slide.question)

		//Add empty choices
		console.log(slide.choices);

		//Fill Question

		//Fill choices

		//Check selfA
		//Fill checks if selfA
		console.log(slide.selfA);
	};


	return {
		init			: init, 
		add				: add,
		save			: save,
		draw			: draw
	};

}) (VISH, jQuery);