VISH.Editor.Quiz = (function(V,$,undefined){

	var init = function(){
		V.Editor.Quiz.MC.init();
	};

	/*
	 * Add a new Quiz
	 */ 
	var addQuiz = function(quiz_type, area, num_options) {
		var current_area;
		var current_num_options;
		if(area) {
			current_area = area;
		} else {
			current_area = V.Editor.getCurrentArea();
		}
		if(num_options){
			current_num_options = num_options;
		} else { //new quiz no options
			current_num_options = 0;
		}
		if(!_getQuizModule(quiz_type)){
			return;
		}

		_getQuizModule(quiz_type).add(current_area, current_num_options, quiz_type);
		$.fancybox.close();
	};

	var _getQuizModule = function(quiz_type){
		switch (quiz_type) {
			case VISH.Constant.QZ_TYPE.OPEN:
				 break;
			case VISH.Constant.QZ_TYPE.MCHOICE:
				return V.Editor.Quiz.MC;
				break;
			case VISH.Constant.QZ_TYPE.TF:
			 	break;
			default:
				return null; 
				break;
		}
	}


	//TO BE REWRITE
	//TO BE REWRITE
	//TO BE REWRITE
	var drawQuiz = function(quiz_type, area, question, options, quiz_id){

		var current_area;
		if(area) {
			current_area = area;
		} else {
			current_area = V.Editor.getCurrentArea();
		}

		switch (quiz_type) {
			case "multiplechoice": 
				if (question) {	
					$(current_area).find(".value_multiplechoice_question_in_zone").children().remove();
					$(current_area).find(".value_multiplechoice_question_in_zone").append(question);
				}	
				if (options) {
					var inputs = $(current_area).find(".multiplechoice_option_in_zone"); //all inputs (less or equal than options received)
					for (var i = 0;  i <= options['choices'].length - 1; i++) {
						$(inputs[i]).children().remove();
						$(inputs[i]).append(options['choices'][i].container);
					} 
				}
				if(quiz_id) {
					$(current_area).find('input[name="quiz_id"]').val(quiz_id);
				}
				$(current_area).find(".multiplechoice_option_in_zone").attr("rows", "1");
				break;
			case "open":

			break;

			case "truefalse":
				$(current_area).find(".value_truefalse_question_in_zone").children().remove();
				$(current_area).find(".value_truefalse_question_in_zone").append(question);

				$(current_area).find(".truefalse_answers > form > input[value='"+ options['answer'] +"']")[0].checked= true;
				if(quiz_id) {
					$(current_area).find('input[name="quiz_id"]').val(quiz_id);
				}
			break;

			default: 

			break;
		}
	};


	// //function to set currentArea when click in quiz elements 
	// var _clickOnQuizArea = function (event) {
	// 	switch (event.target.classList[0]) {
	// 		//MultipleChoice cases
	// 		case "multipleChoiceQuizContainer":
	// 			V.Editor.setCurrentArea($("#" + event.target.parentElement.id));
	// 		break;
	// 		case "add_quiz_option_button":
	// 			V.Editor.setCurrentArea($("#" + event.target.parentElement.parentElement.parentElement.parentElement.id));
	// 			addOptionInQuiz('multiplechoice', V.Editor.getCurrentArea()); 
	// 		break;

	// 		case "multiplechoice_option_in_zone":
	// 			V.Editor.setCurrentArea($("#" + event.target.parentElement.parentElement.parentElement.parentElement.id));
	// 		break;
			
	// 		case "li_mch_options_in_zone":
	// 		V.Editor.setCurrentArea($("#" + event.target.parentElement.parentElement.parentElement.id));
	// 		break;
	// 		//True/False cases
	// 		case "trueFalseQuizContainer":
	// 		V.Editor.setCurrentArea($("#" + event.target.parentElement.id));
	// 		break;

	// 		case "value_truefalse_question_in_zone":
	// 		V.Editor.setCurrentArea($("#" + event.target.parentElement.parentElement.id));
	// 		break;			


	// 		//for multiple T/F in one slide
	// 		case "add_truefalse_quiz_button":
	// 			V.Editor.setCurrentArea($("#" + event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id));
	// 			addOptionInQuiz('truefalse', V.Editor.getCurrentArea()); 
	// 		break;
	// 		case "delete_truefalse_quiz_button":
	// 			V.Debugging.log("click on area detected");
				
	// 		break;
	// 		default:

	// 		break;
	// 	}
	// };

	// /* create an empty MCh quiz  
	// area type text, must add listener for the last one input option */
	// var _addMultipleChoiceQuiz = function(area, num_options, quiz_type) {
	// 	var current_area = area;
	// 	var current_num_options = num_options;
	// 	var quiztype = quiz_type;
		
	// 	var quiz = V.Editor.Quiz.Dummies.getQuizDummy(quiztype, V.Slides.getSlides().length);
	// 	current_area.append(quiz);
	// 	//launchTextEditorInTextArea(current_area, "multiplechoice");
		
	// 	current_area.find(".menuselect_hide").remove(); 
	// 	current_area.attr('type','quiz');
	// 	if(quiztype=="multiplechoice"){

	// 		current_area.attr('quiztype','multiplechoice');
	// 		//add the quizDummy (empty quiz) into the area (zone)
	// 		V.Debugging.log("num options value: " + current_num_options);
	// 		if(current_num_options>=0) {
	// 			var i=0;
	// 			for (i=0; i <= current_num_options ; i++) {
	// 				addOptionInQuiz('multiplechoice', current_area);				
	// 			}
	// 		}
	// 	} else if (quiztype==="truefalse") {
	// 		//we add true false like a particular case of multiple choice quiz

	// 		current_area.attr('quiztype','truefalse');
	// 		var quiz_option = V.Editor.Quiz.Dummies.getQuizOptionDummy(quiztype);
	// 		$(current_area).find(".truefalse_options_in_zone").append(quiz_option);
	// 	}
	// 	launchTextEditorInTextArea(current_area, quiztype);
	// 	V.Editor.addDeleteButton(current_area);
	// };

	// /* called when click add icon and when press enter in last input option */
	// var addOptionInQuiz = function (quiz_type, area) {
	// 	var setKeyDownListener = false;
	// 	var current_area = area;
	// 	var current_quiz_type;
		
	// 	if(typeof quiz_type =="string"){ //when add new and empty multiplechoice quiz
	// 		current_quiz_type = quiz_type;
			
	// 	}
	// 	else if(typeof quiz_type == "object") { //when event comes from click or enter 
	// 		current_quiz_type = $(current_area).attr("quiztype");
	// 		} 
	// 	else {
	// 		V.Debugging("another type ");
	// 		}
	// 	switch (current_quiz_type) {

	// 		case "multiplechoice":
	// 			//load dummy
	// 			var quiz_option = V.Editor.Quiz.Dummies.getQuizOptionDummy(current_quiz_type);
	// 			//as current_options as options in load quiz 
	// 			var current_options = $(current_area).find(".li_mch_options_in_zone").size(); 
	// 			//add option 
	// 			$(current_area).find(".ul_mch_options_in_zone").append(quiz_option);
	// 			//add keyDown listener 
	// 			_addKeyDownListener(current_area, $(current_area).find(".multiplechoice_option_in_zone:last"));				
	// 			//add index letter and unique_id 
	// 			$(current_area).find(".quiz_option_index:last").text(choicesLetters[current_options]);
		
	// 			$(current_area).find("." +deleteQuizOptionButtonClass + ":last").attr("delete_option", current_options);
	// 			$(current_area).find("." +addQuizOptionButtonClass + ":last").attr("add_option", current_options);
	// 			//and call launchTextEditorInTextArea for zone
	// 			launchTextEditorInTextArea(current_area, "multiplechoice", current_options);
			
	// 		 	//hide add incon and show remove one 
	// 			if(current_options>0) {					
	// 				$($(current_area).find("." + addQuizOptionButtonClass)[parseInt(current_options)-1]).hide();
	// 				$($(current_area).find("." +  deleteQuizOptionButtonClass)[parseInt(current_options)-1]).show();

	// 				$($(current_area).find(".multiplechoice_option_in_zone")[current_options]).focus();
	// 				$(current_area).find(".initTextDiv :last").trigger("click");
	// 			}
	// 			//maximum option (show delete instead add icon)
	// 			if((current_options+1)=== maxNumMultipleChoiceOptions) {
	// 				$($(current_area).find("." + addQuizOptionButtonClass)[parseInt(current_options)]).hide();
	// 				$($(current_area).find("." + deleteQuizOptionButtonClass)[parseInt(current_options)]).show();
	// 			}
	// 		break;
	// 		case "truefalse":
	// 			//load dummy
	// 			var quiz_option = V.Editor.Quiz.Dummies.getQuizOptionDummy(current_quiz_type);
	// 			var current_questions = $(current_area).find(".value_truefalse_question_in_zone").size(); 
	// 			V.Debugging.log("current options: " + current_questions);
	// 			current_area.find(".truefalse_quiz_table").append(quiz_option);
	// 			launchTextEditorInTextArea(current_area, "truefalse");
	// 			//hide add incon and show remove one 
	// 			if(current_questions>0) {					
	// 				$($(current_area).find("." + addTrueFalseQuizOptionButtonClass)[parseInt(current_questions)-1]).hide();
	// 				$($(current_area).find("." +  deleteTrueFalseQuizOptionButtonClass)[parseInt(current_questions)-1]).show();

	// 				$($(current_area).find(".value_truefalse_question_in_zone")[current_questions]).focus();
	// 				// $(current_area).find(".initTextDiv :last").trigger("click");
	// 			}
	// 		break;

	// 		default:
	// 		break;
	// 	}
	// };

	// /*method that manages the keyboard in the options to disable enter and to add a new option in the last option*/
	// var _addKeyDownListener = function(area, input) {
	// 	var current_area = area;
	// 	var current_input = input;
	// 	$(current_input).keydown(function(event) {
	// 		if(event.keyCode==13) {
	// 			event.preventDefault();
	// 			event.stopPropagation();
	// 			if($(current_input).attr("id") === $(current_area).find(".multiplechoice_option_in_zone:last").attr("id")&& $(current_area).find(".li_mch_options_in_zone").size()< maxNumMultipleChoiceOptions ){
	// 				addOptionInQuiz('multiplechoice', current_area);
	// 			}
	// 		}
	// 	});
	// };
	
	// var _removeOptionInQuiz = function (event) {
	// 	if(event.target.attributes["class"].value=== deleteQuizOptionButtonClass){
	// 		//Trying to solve error 
	// 		V.Editor.setCurrentArea($("#" +(event.target.parentElement.parentElement.parentElement.parentElement.id)));
	// 		var current_area = V.Editor.getCurrentArea();
	// 		//Remove li
	// 		var option_number = $(event.target).attr("delete_option"); 
	// 		V.Debugging.log("option number:" + option_number);
	// 		$($(current_area).find(".li_mch_options_in_zone")[option_number]).remove();
			
	// 		//reassign index letters for remaining options & reassign id's
	// 		$(current_area).find(".li_mch_options_in_zone").each(function(index, option_element) {
	// 			$(option_element).find(".quiz_option_index").text(choicesLetters[index]);
				
	// 			$(option_element).find("." +deleteQuizOptionButtonClass).attr("delete_option", index);
	// 			$(option_element).find("." +addQuizOptionButtonClass).attr("add_option", index);
	// 			//reasign id's for remaining wysiwyg div's (not Necessary)
	// 			if(index>=option_number) {
			
	// 				launchTextEditorInTextArea(current_area, "multiplechoice", option_number);
	// 			}
	// 		});
	// 		//for the last: if delete icon hide it and show add icon and bind event  when press enter
	// 		if ($(current_area).find(".li_mch_options_in_zone").size()===(maxNumMultipleChoiceOptions-1)) {
	// 			_addKeyDownListener(current_area, $(current_area).find(".multiplechoice_option_in_zone:last"));
	// 			$($(current_area).find("." +deleteQuizOptionButtonClass)[maxNumMultipleChoiceOptions-2]).hide();
	// 			$($(current_area).find("." + addQuizOptionButtonClass)[maxNumMultipleChoiceOptions-2]).show();
	// 		}
 // 		} 

	// 	if(event.target.attributes["class"].value=== deleteTrueFalseQuizOptionButtonClass){
	// 		V.Debugging.log("remove true false question detected");
	// 		V.Editor.setCurrentArea($("#" + event.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id));
	// 		$(event.target.parentElement.parentElement).remove();

	// 	}
 // 		else {
 // 			V.Debugging.log("other event  handler");
 // 		}

	// };

//trying to do with div instead than zone (area)
	// var launchTextEditorInTextArea = function(area, type_quiz, option_number){
	// 	var current_area = area; 
	// 	//for options
	// 	if (option_number!=undefined) {
	// 		var  optionWysiwygId = V.Utils.getId();
	// 		V.Debugging.log("id got it: " + optionWysiwygId);
	// 		$($(current_area).find("."+ type_quiz + "_option_in_zone")[option_number]).attr("id", optionWysiwygId);
 //    		if($($(current_area).find(".li_mch_options_in_zone")[option_number]).find(".wysiwygInstance").val() ===undefined) {
 //   				$("#"+optionWysiwygId).addClass("wysiwygInstance");
 //    			V.Editor.Text.NiceEditor.getNicEditor().addInstance(optionWysiwygId);
 //    		}
 //   		} 
	// 	//question input
	// 	else {
	// 		var textArea = $(current_area).find(".value_"+ type_quiz + "_question_in_zone");		
	// 		//var wysiwygId = "wysiwyg_" + current_area.attr("id"); //wysiwyg_zoneX 
	// 		var wysiwygId = V.Utils.getId();
	// 		textArea.attr("id", wysiwygId);
	// 		$("#"+wysiwygId).addClass("wysiwygInstance");
	// 		V.Editor.Text.NiceEditor.getNicEditor().addInstance(wysiwygId);
	// 	}
		
	// 	$(".initTextDiv").click(function(event){
 //    		if(event.target.tagName=="FONT"){
 //    			var font = $(event.target);
 //    			var div =  $(event.target).parent();
 //    		} else if(event.target.tagName=="DIV"){
 //    			var div = $(event.target);
 //    			var font = $(event.target).find("font");
 //    		}else if(event.target.tagName=="SPAN"){
 //    			var div = $(event.target).parent();
 //    			var font = $(event.target);
 //    		}
	//     	if($(font).text()==="Write options here"){	
	//     			//Remove text
	//     		$(font).text("");
	//     		$(div).removeClass("initTextDiv");
	//       		$(".multiplechoice_option_in_zone :last").trigger("click");
	//     	}
	//     	else if($(font).text()==="Write question here"){	
	//     		//Remove text
	//     		$(font).text("");
	//     		$(div).removeClass("initTextDiv");
	//     		//$(div).parent().text("  ");
	//     		$(div).parent().trigger("click");
	//     	}
 //    	});
	// };




	// var _addTrueFalseQuiz = function(area) {
	// 	var current_area = area;
	// 	//just the Quiz body or structure
	// 	var quiz = V.Editor.Quiz.Dummies.getQuizDummy("truefalse", V.Slides.getSlides().length);
	// 	current_area.find(".menuselect_hide").remove(); 
	// 	current_area.attr('type','quiz');
	// 	current_area.attr('quiztype','truefalse');
	// 	//add the quizDummy (empty quiz) into the area (zone)
	// 	current_area.append(quiz);
	// 	//now add the question 
	// 	option = V.Editor.Quiz.Dummies.getQuizOptionDummy("truefalse");
	// 	current_area.find(".truefalse_quiz_table").append(option);
	// 	launchTextEditorInTextArea(current_area, "truefalse");
	// 	V.Editor.addDeleteButton(current_area);
		
	// };
	


	return {
		init			 				: init, 
		addQuiz							: addQuiz, 
		drawQuiz						: drawQuiz
	};

}) (VISH, jQuery);