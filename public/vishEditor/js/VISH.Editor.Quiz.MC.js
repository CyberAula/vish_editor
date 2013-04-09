/*
 * Multiple Choice Quiz Module
 */
VISH.Editor.Quiz.MC = (function(V,$,undefined){
	var maxNumMultipleChoiceOptions = 6;
	var choicesLetters = ['a)','b)','c)','d)','e)','f)'];

	var addQuizOptionButtonClass = "add_quiz_option_button";
	var deleteQuizOptionButtonClass = "delete_quiz_option_button";


	var init = function(){
		$(document).on('click', '.' + 'multipleChoiceQuizContainer', _clickOnQuizArea);
		$(document).on('click','.'+ deleteQuizOptionButtonClass, _removeOptionInQuiz);
	};


	//function to set currentArea when click in quiz elements 
	var _clickOnQuizArea = function (event) {
		switch (event.target.classList[0]) {
			case "multipleChoiceQuizContainer":
				V.Editor.setCurrentArea($("#" + event.target.parentElement.id));
				break;
			case "add_quiz_option_button":
				V.Editor.setCurrentArea($("#" + event.target.parentElement.parentElement.parentElement.parentElement.id));
				addOptionInQuiz(V.Editor.getCurrentArea(),"multiplechoice");
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


	var drawQuiz = function(quiz_type, area, question, options, quiz_id){
		// if(current_num_options>=0) {
		// 	var i=0;
		// 	for (i=0; i <= current_num_options ; i++) {
		// 		addOptionInQuiz(area);				
		// 	}
		// }
	};


	/*
	 * Create an empty MC Quiz
	 */
	var add = function(area) {
		var quizDummy = _getDummy();
		area.append(quizDummy);
		
		area.find(".menuselect_hide").remove(); 
		area.attr('type','quiz');
		area.attr('quiztype','multiplechoice');
		launchTextEditorForQuestion(area, "multiplechoice");
		addOptionInQuiz(area);
		V.Editor.addDeleteButton(area);
	};

	var _getDummy = function(){
		return "<div class='multipleChoiceQuizContainer'><div class='value_multiplechoice_question_in_zone'></div><ul class='ul_mch_options_in_zone'></ul><input type='hidden' name='quiz_id'/></div></div>";
	}

	var _getOptionDummy = function(){
		return quizOptionDummies = "<li class='li_mch_options_in_zone'><span class='quiz_option_index'></span><div class='multiplechoice_option_in_zone'></div><img src='"+V.ImagesPath+ "icons/add.png' class='add_quiz_option_button'/><img src='"+V.ImagesPath+ "icons/ve_delete.png' class='delete_quiz_option_button'/></li>";
	}


	var launchTextEditorForQuestion = function(area,type_quiz){
		var textArea = $(area).find(".value_"+ type_quiz + "_question_in_zone");		
		var wysiwygId = V.Utils.getId();
		textArea.attr("id", wysiwygId);
		$(textArea).addClass("wysiwygInstance");
		V.Editor.Text.launchTextEditor({}, textArea, "Write text here", {quiz: true, forceNew: true, fontSize: 38, focus: true, autogrow: true});
	}

	var launchTextEditorForOptions = function(area,type_quiz,option_number){
		var  optionWysiwygId = V.Utils.getId();
		var textArea = $($(area).find("."+ type_quiz + "_option_in_zone")[option_number]);
		textArea.attr("id", optionWysiwygId);
		if($($(area).find(".li_mch_options_in_zone")[option_number]).find(".wysiwygInstance").val() ===undefined) {
			$("#"+optionWysiwygId).addClass("wysiwygInstance");
			V.Editor.Text.launchTextEditor({}, textArea, "Write options here", {forceNew: true, fontSize: 24, autogrow: true});
		}
	}

	var addOptionInQuiz = function (area) {
		console.log("add option in quiz");
		var quiz_option = _getOptionDummy();

		//as current_options as options in load quiz 
		var current_options = $(area).find(".li_mch_options_in_zone").size(); 

		//add option 
		$(area).find(".ul_mch_options_in_zone").append(quiz_option);

		//add keyDown listener 
		_addKeyDownListener(area, $(area).find(".multiplechoice_option_in_zone:last"));

		//add index letter and unique_id 
		$(area).find(".quiz_option_index:last").text(choicesLetters[current_options]);

		$(area).find("." +deleteQuizOptionButtonClass + ":last").attr("delete_option", current_options);
		$(area).find("." +addQuizOptionButtonClass + ":last").attr("add_option", current_options);
		launchTextEditorForOptions(area, "multiplechoice", current_options);
	
	 	//hide add incon and show remove one 
		if(current_options>0) {					
			$($(area).find("." + addQuizOptionButtonClass)[parseInt(current_options)-1]).hide();
			$($(area).find("." +  deleteQuizOptionButtonClass)[parseInt(current_options)-1]).show();

			$($(area).find(".multiplechoice_option_in_zone")[current_options]).focus();
			$(area).find(".initTextDiv :last").trigger("click");
		}
		//maximum option (show delete instead add icon)
		if((current_options+1)=== maxNumMultipleChoiceOptions) {
			$($(area).find("." + addQuizOptionButtonClass)[parseInt(current_options)]).hide();
			$($(area).find("." + deleteQuizOptionButtonClass)[parseInt(current_options)]).show();
		}
	};


	var _removeOptionInQuiz = function (event) {
		if(event.target.attributes["class"].value=== deleteQuizOptionButtonClass){
			//Trying to solve error 
			V.Editor.setCurrentArea($("#" +(event.target.parentElement.parentElement.parentElement.parentElement.id)));
			var current_area = V.Editor.getCurrentArea();
			//Remove li
			var option_number = $(event.target).attr("delete_option"); 
			V.Debugging.log("option number:" + option_number);
			$($(current_area).find(".li_mch_options_in_zone")[option_number]).remove();
			
			//reassign index letters for remaining options & reassign id's
			$(current_area).find(".li_mch_options_in_zone").each(function(index, option_element) {
				$(option_element).find(".quiz_option_index").text(choicesLetters[index]);
				$(option_element).find("." +deleteQuizOptionButtonClass).attr("delete_option", index);
				$(option_element).find("." +addQuizOptionButtonClass).attr("add_option", index);
			});

			//for the last: if delete icon hide it and show add icon and bind event  when press enter
			if ($(current_area).find(".li_mch_options_in_zone").size()===(maxNumMultipleChoiceOptions-1)) {
				_addKeyDownListener(current_area, $(current_area).find(".multiplechoice_option_in_zone:last"));
				$($(current_area).find("." +deleteQuizOptionButtonClass)[maxNumMultipleChoiceOptions-2]).hide();
				$($(current_area).find("." + addQuizOptionButtonClass)[maxNumMultipleChoiceOptions-2]).show();
			}
 		}
	};

	var _addKeyDownListener = function(area, input) {
		$(input).keydown(function(event) {
			if(event.keyCode==13) {
				event.preventDefault();
				event.stopPropagation();
				if($(input).attr("id") === $(area).find(".multiplechoice_option_in_zone:last").attr("id")&& $(area).find(".li_mch_options_in_zone").size()< maxNumMultipleChoiceOptions ){
					addOptionInQuiz('multiplechoice', current_area);
				}
			}
		});
	};


	return {
		init			 				: init, 
		add								: add,
		drawQuiz						: drawQuiz
	};

}) (VISH, jQuery);