VISH.Editor.Quiz = (function(V,$,undefined){
	var maxNumMultipleChoiceOptions = 6; // maximum input options 
	var choicesLetters = ['a)','b)','c)','d)','e)','f)'];

	var init = function(){
	
	};	
	////////////
	// Tabs and fancybox
	////////////
	var onLoadTab = function (tab) {
	};

	//Function called from quiz fancybox
	var addQuiz = function(quiz_type, area) {
		switch (quiz_type) {
			case "open":
				// _addOpenQuiz();
				 break;
			case "multiplechoice":
			
				_addMultipleChoiceQuiz(area);
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
				
				$(zone).find(".value_multiplechoice_question_in_zone").children().remove();
				$(zone).find(".value_multiplechoice_question_in_zone").append(question);
				var inputs = $(zone).find(".multiplechoice_option_in_zone"); //all inputs (less or equal than options received)
				for (var i = 0;  i <= options.length - 1; i++) {
					//$(inputs[i]).val(options[i]);
					$(inputs[i]).children().remove();
					$(inputs[i]).append(options[i]);
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
		var quiz = VISH.Dummies.getQuizDummy("multiplechoice", V.Slides.getSlides().length);
		if(area){
			var current_area = $("#"+area);
		}
		else {
			var current_area = VISH.Editor.getCurrentArea();
			current_area.find(".menuselect_hide").remove();
		}
		
		current_area.attr('type','quiz');
		current_area.append(quiz);
		V.Editor.addDeleteButton(current_area);
		launchTextEditorInTextArea(current_area, "multiplechoice");
	};


	var launchTextEditorInTextArea = function(area, type){
		if (area) {
			current_area = area;
		} else {
			current_area = V.Editor.getCurrentArea();
		}

		var textArea = $(current_area).find(".value_"+ type + "_question_in_zone");		
		var wysiwygId = "wysiwyg_" + current_area.attr("id"); //wysiwyg_zoneX 
		textArea.attr("id", wysiwygId);
		V.Editor.Text.getNicEditor().addInstance(wysiwygId);
		//trying to add class for Nestor request
		$(current_area).find("."+ type + "_option_in_zone").each(function(index, option_element) {
    		var optionWysiwygId = "wysiwyg_" + current_area.attr("id") + "_" + index;
    		$(option_element).attr("id", optionWysiwygId);
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
		addQuiz							: addQuiz
	};

}) (VISH, jQuery);
