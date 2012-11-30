VISH.Editor.Quiz = (function(V,$,undefined){
	var maxNumMultipleChoiceOptions = 6; // maximum input options 
	var choicesLetters = ['a)','b)','c)','d)','e)','f)'];

	var addQuizOptionButtonClass = "add_quiz_option_button";
	var deleteQuizOptionButtonClass = "delete_quiz_option_button";

	var init = function(){
		$(document).on('click', '.' + 'multipleChoiceQuizContainer', _clickOnQuizArea);
		//$(document).on('click','.add_quiz_option_button', addOptionInQuiz);
		$(document).on('click','.'+ deleteQuizOptionButtonClass, _removeOptionInQuiz);
		;
		
	};	
	////////////
	// Tabs and fancybox
	////////////
	var onLoadTab = function (tab) {
	};

	//Function called from quiz fancybox and Editor.Renderer
	//area must be an DOM object 
	var addQuiz = function(quiz_type, area, num_options) {
		var current_area;
		var current_num_options;
		if(area) {
		//	current_area = $("#"+area);
			current_area = area;
		}
		else {
			current_area = VISH.Editor.getCurrentArea();
		}
		if(num_options){
			current_num_options = num_options;
		}
		else {
			current_num_options = 0;

		}

		switch (quiz_type) {
			case "open":
				// _addOpenQuiz();
				 break;
			case "multiplechoice":
			
				_addMultipleChoiceQuiz(current_area, current_num_options);
				//hide & show fancybox elements 
				VISH.Utils.loadTab('tab_quizes'); 
				 break;
			case "truefalse":
				// _addTrueFalseQuiz();
			 	break;
			default: 
				break;
		}
		$.fancybox.close();
	};


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
					for (var i = 0;  i <= options.length - 1; i++) {
						$(inputs[i]).children().remove();
						$(inputs[i]).append(options[i].container);
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

			break;

			default: 

			break;
		}
	};
	//possible targets
	var _clickOnQuizArea = function (event) {
		switch (event.target.classList[0]) {

			case "multipleChoiceQuizContainer":
				V.Editor.setCurrentArea($("#" + event.target.parentElement.id));
			break;
			case "add_quiz_option_button":
				V.Editor.setCurrentArea($("#" + event.target.parentElement.parentElement.parentElement.parentElement.id));
				addOptionInQuiz('multiplechoice'); 
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
	/* create an empty MCh quiz  
	area type text, must add listener for the last one input option */
	var _addMultipleChoiceQuiz = function(area, num_options) {
		var current_area;
		var current_num_options;
		if(area){
			current_area = area;
		}
		else {
			//if no param 
			current_area = VISH.Editor.getCurrentArea();
		}
		if (num_options) { //when editing a quiz
		 	current_num_options = num_options;
		}
		else { //new quiz
			current_num_options = 0;
		}
		var quiz = VISH.Dummies.getQuizDummy("multiplechoice", V.Slides.getSlides().length);
		current_area.find(".menuselect_hide").remove(); 
		current_area.attr('type','quiz');
		current_area.attr('quiztype','multiplechoice');
		//add the quizDummy (empty quiz) into the area (zone)
		current_area.append(quiz);
		launchTextEditorInTextArea(current_area, "multiplechoice");
		V.Editor.addDeleteButton(current_area);
		var i=0;
		
		if(current_num_options===0) { //empty quiz (new)
			addOptionInQuiz('multiplechoice', current_area, "filling");
			input = $(current_area).find(".multiplechoice_option_in_zone:last");
	 		_addKeyDownListener(current_area, input);	
		}
		else { //load edit quiz (got options)
			for (i=0; i <= current_num_options ; i++) {
				addOptionInQuiz('multiplechoice', current_area, "filling");
			//listener enterKey just for last option
			 if(i===current_num_options) {
			 	input = $(current_area).find(".multiplechoice_option_in_zone:last");
			 	_addKeyDownListener(current_area, input);	
			 }
			} 
		}
	};
	/* called when click add icon and when press enter in last input option */
	var addOptionInQuiz = function (quiz_type, area, event) {
		var setKeyDownListener = false;
		var current_area;
		var current_quiz_type;
		
		if(area) {
			current_area = area;
		}
		else {
			current_area = V.Editor.getCurrentArea();
		}
		
		if(typeof quiz_type =="string"){ //when add new and empty multiplechoice quiz
			current_quiz_type = quiz_type;
			
		}
		else if(typeof quiz_type == "object") { //when event comes from click or enter 
			current_quiz_type = $(current_area).attr("quiztype");
			} 
		else {
			V.Debugging("another type ");
			}
		if ((event==="enter")|| (event=="add_button")) {

			setKeyDownListener = true;
		}
		else if (event==="filling") {
			setKeyDownListener = false;
		}
		else {
			setKeyDownListener = false;

		}

		
		switch (current_quiz_type) {

			case "multiplechoice":
				
				var quiz_option = VISH.Dummies.getQuizOptionDummy(current_quiz_type);
				//as current_options as options in load quiz
				var current_options = $(current_area).find(".li_mch_options_in_zone").size(); 
				//add option 
				$(current_area).find(".ul_mch_options_in_zone").append(quiz_option);

				input = $(current_area).find(".multiplechoice_option_in_zone:last");
				//add key , just only for the last input option
				if (setKeyDownListener) {
				 	_addKeyDownListener(current_area, input);				
				}//add index letter and unique_id 
				$(current_area).find(".li_mch_options_in_zone:last-child > span").text(choicesLetters[current_options]);
				$(current_area).find(".li_mch_options_in_zone:last-child > ." +deleteQuizOptionButtonClass).attr("id", current_area.attr("id") + "_delete_option_button_"+  current_options + "_id");
				$(current_area).find(".li_mch_options_in_zone:last-child > ." +addQuizOptionButtonClass).attr("id", current_area.attr("id") + "_add_option_button_"+  current_options + "_id");
				//and call launchTextEditorInTextArea for zone
				launchTextEditorInTextArea(current_area, "multiplechoice", current_options);
				
				//maximum option (change add for delete icon and unbind keydown)
				if((current_options+1)=== maxNumMultipleChoiceOptions) {
					$($(current_area).find(".li_mch_options_in_zone")[parseInt(current_options)]).find("." + addQuizOptionButtonClass).hide();
					$($(current_area).find(".li_mch_options_in_zone")[parseInt(current_options)]).find("." + deleteQuizOptionButtonClass).show();
					$('#' + "wysiwyg_"+ current_area.attr("id") + "_" + current_options).unbind('keydown');
				}

				//remove add icon and insert remove icon 
				if(current_options>0) {					
					//remove default text
					//$(current_area).find(".li_mch_options_in_zone > div :last").text("");
					//$(current_area).find(".initTextDiv").removeClass("initTextDiv");
					$($(current_area).find(".li_mch_options_in_zone")[parseInt(current_options)-1]).find(".add_quiz_option_button").hide();
					$($(current_area).find(".li_mch_options_in_zone")[parseInt(current_options)-1]).find("." +  deleteQuizOptionButtonClass).show();
					$("#wysiwyg_" + current_area.attr("id")  + "_" + current_options ).focus();
					//$(current_area).find(".initTextDiv :last").focus();
					$(current_area).find(".initTextDiv :last").trigger("click");
				}
			
			break;

			default:
			break;
		}
	};

	var _addKeyDownListener = function(area, input) {
		var current_area;
		var current_input;
		if(area) {
			current_area = area;
		}
		else {current_area= V.Editor.getCurrentArea();}
		 if(input) {
		 	current_input = input;
		 } else {
		 	V.Debugging.log("no element id!!");
		 }
		var current_input = $(current_area).find(".multiplechoice_option_in_zone:last");
		$(current_input).keydown(function(event) {
			if(event.keyCode==13) {
				_addKeydownEnterDisabled(event.target.id);
				event.preventDefault();
				event.stopPropagation();
			 	addOptionInQuiz('multiplechoice', current_area, 'enter');
			}
		});

	};
/* function to unbind first keydown (enter -> new input) and then disable enter in options  */
	var _addKeydownEnterDisabled = function (input_id) {
		$("#" + input_id).unbind('keydown');
		$("#" + input_id).keydown(function(event) {
			if(event.keyCode==13) {
				event.preventDefault();
				event.stopPropagation();
			}
		});

	};
	
	var _removeOptionInQuiz = function (event) {
		if(event.target.attributes["class"].value=== deleteQuizOptionButtonClass){
			//Trying to solve error 
			V.Editor.setCurrentArea($("#" +(event.target.parentElement.parentElement.parentElement.parentElement.id)));
			var current_area = V.Editor.getCurrentArea();
			//Remove li
			// TODO try to find index in different way
			var option_number = (event.target.id).substring(27,28); 
			$(current_area).find("#"+ event.target.attributes["id"].value).parent().remove();
			
			//reassign index letters for remaining options & reassign id's
			$(current_area).find(".li_mch_options_in_zone").each(function(index, option_element) {
				$(option_element).find(">span:first-child").text(choicesLetters[index]);
				$(option_element).find("." +deleteQuizOptionButtonClass).attr("id", current_area.attr("id") + "_delete_option_button_"+  index + "_id");
				$(option_element).find("." +addQuizOptionButtonClass).attr("id", current_area.attr("id") + "_add_option_button_"+  index + "_id");
				//reasign ids for remaining wysiwyg div's 
				$(option_element).find(".multiplechoice_option_in_zone").attr("id","wysiwyg_" + current_area.attr("id") + "_"+  index );

				if(index>=option_number) {
			
					launchTextEditorInTextArea(current_area, "multiplechoice", option_number);
				}
			});
			//for the last: if delete icon hide it and show add icon and bind event  when press enter
			if ($(current_area).find(".li_mch_options_in_zone").size()===(maxNumMultipleChoiceOptions-1)) {
				_addKeyDownListener(current_area, $(current_area).find(".multiplechoice_option_in_zone:last"));
				$($(current_area).find(".li_mch_options_in_zone")[maxNumMultipleChoiceOptions-2]).find("." +deleteQuizOptionButtonClass).hide();
				$($(current_area).find(".li_mch_options_in_zone")[maxNumMultipleChoiceOptions-2]).find("." + addQuizOptionButtonClass).show();
			}
 		} 
 		else {
 			V.Debugging.log("other event  handler");
 		}

	};

//trying to do with div instead than zone (area)
	var launchTextEditorInTextArea = function(area, type_quiz, option_number){
		if (area) {
			current_area = area;
		} else {
			current_area = V.Editor.getCurrentArea();
		}
		//for options
		if (option_number!=undefined) {
			var optionWysiwygId = "wysiwyg_" + current_area.attr("id") + "_" + option_number;
    		$($(current_area).find("."+ type_quiz + "_option_in_zone")[option_number]).attr("id", optionWysiwygId);
    		if($($(current_area).find(".li_mch_options_in_zone")[option_number]).find(".wysiwygInstance").val() ===undefined) {
   				$("#"+optionWysiwygId).addClass("wysiwygInstance");
    			V.Editor.Text.getNicEditor().addInstance(optionWysiwygId);	
    		}
   		} 
		//undefined option number , for question 
		else {

			var textArea = $(current_area).find(".value_"+ type_quiz + "_question_in_zone");		
			var wysiwygId = "wysiwyg_" + current_area.attr("id"); //wysiwyg_zoneX 
			textArea.attr("id", wysiwygId);
			$("#"+wysiwygId).addClass("wysiwygInstance");
			V.Editor.Text.getNicEditor().addInstance(wysiwygId);
			//launchTextEditorInTextArea(current_area, "multiplechoice", 0);


		}
		
		$(".initTextDiv").click(function(event){
    		if(event.target.tagName=="FONT"){
    			var font = $(event.target);
    			var div =  $(event.target).parent();
    		} else if(event.target.tagName=="DIV"){
    			var div = $(event.target);
    			var font = $(event.target).find("font");
    		}else if(event.target.tagName=="SPAN"){
    			var div = $(event.target).parent();
    			var font = $(event.target);
    		}
	    	if($(font).text()==="Write options here"){	
	    			//Remove text
	    		$(font).text("");
	    		$(div).removeClass("initTextDiv");
	    		//$(div).parent().text("  ");
	    		$(".multiplechoice_option_in_zone :last").trigger("click");
	    	}
	    	else if($(font).text()==="Write question here"){	
	    		//Remove text
	    		$(font).text("");
	    		$(div).removeClass("initTextDiv");
	    		//$(div).parent().text("  ");
	    		$(div).parent().trigger("click");
	    	}
    	});
	};


	return {
		init			 				: init, 
		onLoadTab						: onLoadTab,
		drawQuiz						: drawQuiz,
		addQuiz							: addQuiz, 
		addOptionInQuiz					:addOptionInQuiz
	};

}) (VISH, jQuery);
