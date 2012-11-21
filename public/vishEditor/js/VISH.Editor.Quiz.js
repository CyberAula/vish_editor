VISH.Editor.Quiz = (function(V,$,undefined){
	var maxNumMultipleChoiceOptions = 6; // maximum input options 
	var choicesLetters = ['a)','b)','c)','d)','e)','f)'];

	var init = function(){
	
		$(document).on('click','.add_quiz_option_button', addOptionInQuiz);
	};	
	////////////
	// Tabs and fancybox
	////////////
	var onLoadTab = function (tab) {
	};

	//Function called from quiz fancybox
	var addQuiz = function(quiz_type, area) {
		var current_area;
		if(area) {
			current_area = area;
		}
		else {
			current_area = VISH.Editor.getCurrentArea();
		}
		switch (quiz_type) {
			case "open":
				// _addOpenQuiz();
				 break;
			case "multiplechoice":
			
				_addMultipleChoiceQuiz(current_area);
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


	var drawQuiz = function(quiz_type, zone_id, question, options, quiz_id){

		var zone;
		if(zone_id) {
			zone = "#"+ zone_id;
		} else {

			zone = ".current";
		}

		switch (quiz_type) {
			case "multiplechoice": 
				
				
				
				if (question) {	
					$(zone).find(".value_multiplechoice_question_in_zone").children().remove();
					$(zone).find(".value_multiplechoice_question_in_zone").append(question);
				}	
				if (options) {
					var inputs = $(zone).find(".multiplechoice_option_in_zone"); //all inputs (less or equal than options received)
					for (var i = 0;  i <= options.length - 1; i++) {
						$(inputs[i]).children().remove();
						$(inputs[i]).append(options[i].container);
					} 
				}
				if(quiz_id) {
					$(zone).find('input[name="quiz_id"]').val(quiz_id);
				}
				$(zone).find(".multiplechoice_option_in_zone").attr("rows", "1");
				break;
			case "open":

			break;

			case "truefalse":

			break;

			default: 

			break;
		}
	};

	var _addMultipleChoiceQuiz = function(area) {
		var current_area;
		var quiz = VISH.Dummies.getQuizDummy("multiplechoice", V.Slides.getSlides().length);
		if(area){
			current_area = area;
		}
		else {
			//if no param 
			current_area = VISH.Editor.getCurrentArea();
			
		}
		current_area.find(".menuselect_hide").remove();
		current_area.attr('type','quiz');
		current_area.attr('quiztype','multiplechoice');
		//add the quizDummy (empty quiz) into the area (zone)
		current_area.append(quiz);
		V.Editor.addDeleteButton(current_area);
		addOptionInQuiz('multiplechoice', current_area);
		launchTextEditorInTextArea(current_area, "multiplechoice");

	};

	var addOptionInQuiz = function (quiz_type, area) {
		V.Debugging.log(" addOptionInQuiz and quiz type value: " + quiz_type.toString());
		var current_area;
		var current_quiz_type;
		if(area) {
			current_area = area;
		}
		else {
			current_area = V.Editor.getCurrentArea();
		}

		if(typeof quiz_type =="string"){
			V.Debugging.log("YES quiz type" );
			current_quiz_type = quiz_type;
		}
		else if(typeof quiz_type == "object") { //when event comes from click or enter (not implemented)
			V.Debugging.log("click add quiz option" );
			current_quiz_type = $(current_area).attr("quiztype");
		} 
		else {
			V.Debugging("another type ");

		}
		
		V.Debugging.log(" addOptionInQuiz and quiz_type value: " + current_quiz_type );
		switch (current_quiz_type) {

			case "multiplechoice":
				
				var quiz_option = VISH.Dummies.getQuizOptionDummy(current_quiz_type);

				var current_options = $(current_area).find(".li_mch_options_in_zone").size();
				V.Debugging.log(" current_options:"  + current_options);
				//add option 
				$(current_area).find(".ul_mch_options_in_zone").append(quiz_option);
				//add index letter
				$(current_area).find(".li_mch_options_in_zone > span").text(choicesLetters[current_options]);
				//add function to add icon
				//$(area).find(".li_mch_options_in_zone > .add_quiz_option_button").attr();
			break;

			default:
			break;
		}
	};


	var launchTextEditorInTextArea = function(area, type_quiz){
		if (area) {
			current_area = area;
		} else {
			current_area = V.Editor.getCurrentArea();
		}

		var textArea = $(current_area).find(".value_"+ type_quiz + "_question_in_zone");		
		var wysiwygId = "wysiwyg_" + current_area.attr("id"); //wysiwyg_zoneX 
		textArea.attr("id", wysiwygId);
		$("#"+wysiwygId).addClass("wysiwygInstance");
		V.Editor.Text.getNicEditor().addInstance(wysiwygId);
		
		$(current_area).find("."+ type_quiz + "_option_in_zone").each(function(index, option_element) {
    		var optionWysiwygId = "wysiwyg_" + current_area.attr("id") + "_" + index;
    		$(option_element).attr("id", optionWysiwygId);
    		$("#"+optionWysiwygId).addClass("wysiwygInstance");
    		V.Editor.Text.getNicEditor().addInstance(optionWysiwygId);	
		});
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
	    		$(".multiplechoice_option_in_zone").trigger("click");
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
