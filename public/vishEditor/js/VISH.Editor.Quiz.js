VISH.Editor.Quiz = (function(V,$,undefined){
	var maxNumMultipleChoiceOptions = 6; // maximum input options 
	var choicesLetters = ['a)','b)','c)','d)','e)','f)'];

	var init = function(){
		$(document).on('click','.add_quiz_option', _addMultipleChoiceOption);
		$(document).on('click','.remove_quiz_option', _removeMultipleChoiceOption);
		$(document).on('keydown','.multiplechoice_text', _onKeyDown);
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
				 break;
			case "truefalse":
				// _addTrueFalseQuiz();
			 	break;
			default: 
				break;
		}
		$.fancybox.close();
	};


	var drawQuiz = function(quiz_type, zone_id, question, options){
		//var typeQuiz = $(".current").find(".value_multiplechoice_question").val(question);
		var zone;
		if(zone_id) {
			zone = "#"+ zone_id;
		} else {

			zone = ".current";
		}

		switch (quiz_type) {


			case "multiplechoice": 
				
				$(zone).find(".value_multiplechoice_question_in_zone").parent().find("div > div").children().remove();
				$(zone).find(".value_multiplechoice_question_in_zone").parent().find("div > div").append(question);
				var inputs = $(zone).find(".multiplechoice_text_in_zone"); //all inputs (less or equal than options received)
				
				for (var i = 0;  i <= options.length - 1; i++) {
					$(inputs[i]).val(options[i]);
				}
				break;
			case "open":

			break;

			case "truefalse":

			break;

			default: 

			break;
		}

		
	};


	var _onKeyDown = function(event){
		if(event.keyCode == 13) {
			 var target = event.target;
			if(($(target).val()!="")&& ($(target).val()!="write quiz options here")) {
				_addMultipleChoiceOption(event);
			}
		}	
	}

	//myInput, myImg and optionText are used to add the options when editing a mc question.
	var _addMultipleChoiceOption = function(event, myInput, myImg, optionText){
		var img, input;
		var optionsLength = $(".current").find(".ul_mch_options > li").length;
		if(optionsLength >= maxNumMultipleChoiceOptions){
			return;
		}

		if(event){
			if(event.target.tagName === "INPUT"){
				//addMultipleChoiceOption trigger from keyboard input
				img = $(event.target).parent().find("img");
				input = event.target;
			} else if(event.target.tagName === "IMG"){
				//addMultipleChoiceOption trigger from img click
				img = event.target;
				input = $(event.target).parent().parent().find("input");
			}
		} else {
			img = myImg;
			input = myInput;
			$(input).val(optionText);
		}

		var a = $(img).parent();
		var li = $(input).parent();

		var targetChoice = $(".current").find(".ul_mch_options > li").index(li);
		var isLastChoice = (targetChoice === (optionsLength-1));
		if(!isLastChoice){
			return;
		}

		$(img).attr("src",VISH.ImagesPath + "delete.png");
		$(a).removeClass().addClass("remove_quiz_option");
		$(input).blur();

		var maxChoicesReached = (optionsLength == maxNumMultipleChoiceOptions-1);
		var newMultipleChoice = _renderDummyMultipleChoice(choicesLetters[optionsLength],!maxChoicesReached);
		$(".current").find(".ul_mch_options").append(newMultipleChoice);
		$(".current").find(".ul_mch_options > li").last().find("input").focus();
	};

	var _renderDummyMultipleChoice = function(text, addImage){
		var li = $("<li class='li_mch_option'></li>");
		$(li).append("<span class='mcChoiceSpan'>" + text + "</span>");
		$(li).append("<input type='text' class='multiplechoice_text'></input>");
		if(addImage === true){
			$(li).append(_renderAddImg());
		}
		return li;
	}

	var _renderAddImg = function(){
		var a = $("<a class='add_quiz_option'></a>");
		var addImg = $("<img src='" + VISH.ImagesPath + "add_quiz_option.png'/>");
		$(a).append(addImg);
		return a;
	}

	var _removeMultipleChoiceOption = function(id) {
		//removeMultipleChoiconLoadTabMChoiceQuizeOption trigger always from img click
		var li = $(event.target).parent().parent();
		$(li).remove();

		//Rewrite index letters
		$(".current").find(".ul_mch_options > li").each(function(index, value) {
			var span = $(value).find("span");
			$(span).html(choicesLetters[index]);
		}); 
		//Ensure that last choice has plus option
		var lastLi = $(".current").find(".ul_mch_options > li").last();
		
		var lastA = $(lastLi).find("a");
		if(($(lastA).length==0)||($(lastA).hasClass("add_quiz_option")===false)){
			$(lastLi).append(_renderAddImg());
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
		var wysiwygId = "wysiwyg_" + current_area.attr("id"); //wysiwig_zoneX 
		textArea.attr("id", wysiwygId);
		textArea.addClass("wysiwygInstance");

		V.Editor.Text.getNicEditor().addInstance(wysiwygId);
	};


	return {
		init			 				: init, 
		onLoadTab						: onLoadTab,
		drawQuiz						: drawQuiz,
		addQuiz							: addQuiz
	};

}) (VISH, jQuery);
