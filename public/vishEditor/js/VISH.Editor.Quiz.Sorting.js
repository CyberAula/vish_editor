/*
 * Sorting Quiz Module
 */
VISH.Editor.Quiz.Sorting = (function(V,$,undefined){
	var addQuizOptionButtonClass = "add_quiz_option_sorting";
	var deleteQuizOptionButtonClass = "delete_quiz_option_sorting";
	var initialized = false;

	var init = function(){
		if(!initialized){
			$(document).on('click', '.' + 'mcContainer', _clickOnQuizArea);
			$(document).on('click','.'+ addQuizOptionButtonClass, _clickToAddOptionInQuiz);
			$(document).on('click','.'+ deleteQuizOptionButtonClass, _removeOptionInQuiz);
			initialized = true;
		}
	};

	/*
	 * Manage click events
	 */
	var _clickOnQuizArea = function(event){
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


	var ckEditorTmpData;

	/*
	 * Create an empty Sorting Quiz
	 */
	var add = function(area){
		area.append(_getDummy());
		area.find(".menuselect_hide").remove(); 
		area.attr('type','quiz');
		area.attr('quiztype', V.Constant.QZ_TYPE.SORTING);
		_launchTextEditorForQuestion(area);
		_addOptionInQuiz(area);
		V.Editor.addDeleteButton(area);

		//Add sortable (See http://jqueryui.com/sortable)
		//See http://stackoverflow.com/questions/15124860/ckeditor-4-and-jquery-ui-sortable-removes-content-after-sorting
		$(area).find(".mc_options").sortable({
			cursor: 'move',
			start: function (event,ui) {
				try {
					var textArea = $(ui.item).find(".wysiwygTextArea");
					var ckEditorInstance = V.Editor.Text.getCKEditorFromTextArea(textArea);
					ckEditorTmpData = ckEditorInstance.getData();
				}catch(e){ ckEditorTmpData = undefined; }
			},
			stop: function(event,ui){
				var textArea = $(ui.item).find(".wysiwygTextArea");
				var ckEditorInstance = V.Editor.Text.getCKEditorFromTextArea(textArea);
				ckEditorInstance.destroy();

				if((typeof ckEditorTmpData != "string")||(($(ckEditorTmpData).text().trim())=="­")){
					//Empty ckEditorTmpData
					V.Editor.Text.launchTextEditor({},$(textArea).parent(),"",{forceNew: true, fontSize: 24, autogrow: true, focus: false, disableTmpShown: true});
				} else {
					V.Editor.Text.launchTextEditor({},$(textArea).parent(),ckEditorTmpData,{autogrow: true, disableTmpShown: true});
				}

				ckEditorTmpData = undefined;

				_refreshChoicesIndexs(area);
			}
		});
	};

	var _getDummy = function(){
		return "<div class='sortingQContainer'><div class='mc_question_wrapper'></div><ul class='mc_options'></ul><img src='"+V.ImagesPath+ "icons/add.png' class='"+addQuizOptionButtonClass+"'/><input type='hidden' name='quiz_id'/></div></div>";
	};

	var _getOptionDummy = function(){
		return "<li class='mc_option'><div class='mc_option_wrapper'><span class='mc_option_index sorting_option_index'></span><div class='mc_option_text sorting_option_text'></div><table class='mc_checks sorting_checks'><tr class='checkFirstRow'><td><img src='"+V.ImagesPath+ "icons/ve_delete.png' class='"+deleteQuizOptionButtonClass+"'/></td></tr></table></div></li>";
	};

	/*
	 * AddOptionInQuiz called from click event
	 */
	var _clickToAddOptionInQuiz = function(event){
		var area = $("#" + event.target.parentElement.parentElement.id);
		V.Editor.setCurrentArea(area);
		_addOptionInQuiz(area);
	};

	var _addOptionInQuiz = function(area,value){
		var nChoices = $(area).find("li.mc_option").size();
		var quiz_option = $(_getOptionDummy()).attr("nChoice",(nChoices+1));
		$(area).find(".mc_options").append(quiz_option);
		_refreshChoicesIndexs(area);
		_launchTextEditorForOptions(area,nChoices,value);
		if(nChoices>0) {
			$(area).find("li[nChoice='"+(nChoices+1)+"']").find("."+deleteQuizOptionButtonClass).css("visibility","visible");
		}
	};

	var _removeOptionInQuiz = function(event){
		var area = $("div[type='quiz']").has(event.target);
		V.Editor.setCurrentArea(area);
		var liToRemove = $("li.mc_option").has(event.target);
		$(liToRemove).remove();
		_refreshChoicesIndexs(area);
	};

	var _refreshChoicesIndexs = function(area){
		$(area).find("li.mc_option").each(function(index,option_element){
			$(option_element).find(".mc_option_index").text((index+1).toString()+")");
		});
		//TODO: Update remove buttons
	};

	var _launchTextEditorForQuestion = function(area,question){
		var textArea = $(area).find(".mc_question_wrapper");
		if(!question){
			V.Editor.Text.launchTextEditor({}, textArea, "", {forceNew: true, fontSize: 38, focus: true, autogrow: true});
		} else {
			V.Editor.Text.launchTextEditor({}, textArea, question, {autogrow: true});
		}
	};

	var _launchTextEditorForOptions = function(area,nChoice,value){
		var first = (nChoice===0);
		var textArea = $(area).find(".mc_option_text")[nChoice];
		if(!value){
			if(first){
				V.Editor.Text.launchTextEditor({}, textArea, V.I18n.getTrans("i.QuizzesWriteOptionsSorting"), {forceNew: true, fontSize: 24, autogrow: true, placeholder: true});
			} else {
				V.Editor.Text.launchTextEditor({}, textArea, "", {forceNew: true, fontSize: 24, autogrow: true, focus: true});
			}
		} else {
			V.Editor.Text.launchTextEditor({}, textArea, value, {autogrow: true});
		}
	};


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
			// if($(textArea).parent().find(".mcCheckbox").attr("check")==="true"){
			// 	choice.answer = true;
			// 	quiz.selfA = true;
			// 	nAnswers++;
			// } else {
			// 	choice.answer = "?";
			// }
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
	};

	/*
	 * Render the quiz in the editor
	 * slide is the area and contains all the required parameters
	 */
	var draw = function(area,quiz){
		//Draw question
		$(area).append(_getDummy());
		$(area).attr('type', V.Constant.QUIZ );
		$(area).attr('quiztype', V.Constant.QZ_TYPE.MCHOICE);
		_launchTextEditorForQuestion(area,quiz.question.wysiwygValue);
		V.Editor.addDeleteButton(area);

		//Draw choices (checking selfA)
		$(quiz.choices).each(function(index,choice){
			// var check = undefined;
			// if(quiz.selfA){
			// 	if(choice.answer===true){
			// 		check = "true";
			// 	}
			// }
			_addOptionInQuiz(area,choice.wysiwygValue);
		});
	};

	return {
		init			: init, 
		add				: add,
		save			: save,
		draw			: draw
	};

}) (VISH, jQuery);