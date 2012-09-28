VISH.Editor.Quiz = (function(V,$,undefined){
	var maxNumMultipleChoiceOptions = 6; // maximum input options 
	var choicesLetters = ['a)','b)','c)','d)','e)','f)'];
	var fancyTabs = false; //differentiate between fancy tabs and quiz template

	var myNicEditor; // to manage the NicEditor WYSIWYG

	var init = function(){
		$(document).on('click','.add_quiz_option', _addMultipleChoiceOption);
		$(document).on('click','.remove_quiz_option', _removeMultipleChoiceOption);
		$(document).on('keydown','.multiplechoice_text', _onKeyDown);
	
	};	
	//for embeding a quiz into a template 
	var onLoadTab = function (tab) {
			V.Debugging.log("onLoadTab Quiz : " + tab);
		if(tab=="quiz_mchoice") {

			_onLoadTabMChoiceQuiz();
		} else if (tab=="quiz_open"){

			V.Debugging.log("quiz open load tab");

		}

	};
	/**/ 
	var addMChoiceQuiz = function () {
		V.Debugging.log("add MChoice Quiz Button clicked");
		//test values for elements
 	  // _generateWrapper();
	//  $.fancybox.close();
	  
  	};

	//used for editing a quiz
	var drawQuiz = function(question, options){
		//first the question in the textarea
		$(".current").find(".value_multiplechoice_question").val(question);
		//now the options
		for (var i = 0;  i <= options.length - 1; i++) {
			var optionText = options[i];
			var myInput = $(".current").find(".ul_mch_options > li").last().find("input");
			var myImg = $(".current").find(".ul_mch_options > li").last().find("img");
			_addMultipleChoiceOption(null, myInput, myImg, optionText);
		};
		
	};
/* function called when click an element of the quiz fancybox */
	var addQuiz = function(quiz_type) {
		$.fancybox.close();
		
		switch (quiz_type) {
			case "open":
				_addOpenQuiz();
				 break;
			case "multiplechoice":
				_addMultipleChoiceQuiz();
				 break;
			case "truefañse":
				_addTrueFalseQuiz();
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

		if(fancyTabs) {
			var optionsLength = $("#tab_quiz_mchoice_content").find(".ul_mch_options > li").length;
		}
		else {
			var optionsLength = $(".current").find(".ul_mch_options > li").length;
		}

		if(optionsLength >= maxNumMultipleChoiceOptions){
			return;
		}
		if(event){
			V.Debugging.log("event.target.tagName addMultipleChoiceOption: "+ event.target.tagName);

			if(event.target.tagName === "INPUT"){
				//addMultipleChoiceOption trigger from keyboard input
				img = $(event.target).parent().find("img");
				input = event.target;
			} else if(event.target.tagName === "IMG"){
				//addMultipleChoiceOption trigger from img click
				V.Debugging.log("event.target : "+ event.target);
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

		if(fancyTabs) {
			V.Debugging.log("enter into fancyTabs true first");	
		var targetChoice = $("#tab_quiz_mchoice_content").find(".ul_mch_options > li").index(li);
		}

		else { 
		
		var targetChoice = $(".current").find(".ul_mch_options > li").index(li);
		}
		V.Debugging.log("targetChoice " + targetChoice);
		var isLastChoice = (targetChoice === (optionsLength-1));
		V.Debugging.log("isLastChoice " + isLastChoice);	
		if(!isLastChoice){
			return;
		}

		$(img).attr("src",VISH.ImagesPath + "delete.png");
		$(a).removeClass().addClass("remove_quiz_option");
		$(input).blur();

		var maxChoicesReached = (optionsLength == maxNumMultipleChoiceOptions-1);
		var newMultipleChoice = _renderDummyMultipleChoice(choicesLetters[optionsLength],!maxChoicesReached);
				V.Debugging.log("newMultipleChoice" + newMultipleChoice);
		if(fancyTabs) { 
			$("#tab_quiz_mchoice_content").find(".ul_mch_options").append(newMultipleChoice);
			$("#tab_quiz_mchoice_content").find(".ul_mch_options > li").last().find("input").focus();
		}	
		else {
			$(".current").find(".ul_mch_options").append(newMultipleChoice);
			$(".current").find(".ul_mch_options > li").last().find("input").focus();
		}

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
		V.Debugging.log("_removeMultipleChoiceOption param id value: " + id);
		//removeMultipleChoiconLoadTabMChoiceQuizeOption trigger always from img click
		var li = $(event.target).parent().parent();
		$(li).remove();

		//Rewrite index letters
		if(fancyTabs){
			$("#tab_quiz_mchoice_content").find(".ul_mch_options > li").each(function(index, value) {
			var span = $(value).find("span");
			$(span).html(choicesLetters[index]);
		});
		//Ensure that last choice has plus option
		var lastLi = $("#tab_quiz_mchoice_content").find(".ul_mch_options > li").last();			
		} else {
		$(".current").find(".ul_mch_options > li").each(function(index, value) {
			var span = $(value).find("span");
			$(span).html(choicesLetters[index]);
		}); 
		
		//Ensure that last choice has plus option
		var lastLi = $(".current").find(".ul_mch_options > li").last();

		}

		
		var lastA = $(lastLi).find("a");
		if(($(lastA).length==0)||($(lastA).hasClass("add_quiz_option")===false)){
			$(lastLi).append(_renderAddImg());
		}
	};
	//first kind of quiz shown
	var _onLoadTabMChoiceQuiz = function() {
		fancyTabs = true;
		$("#tab_quiz_mchoice_content").find(".value_multiplechoice_question").attr("value", "");
		$("#tab_quiz_mchoice_content").find(".ul_mch_options").children().remove();
		_addMultipleChoiceOption(); 
		$("#tab_quiz_mchoice").show();
		$("#tab_quiz_mchoice_content").find(".add_quiz_option_img").attr("src", VISH.ImagesPath+"add_quiz_option.png");
		
			};

	/*var _generateWrapper = function() {
		current_area =  VISH.Editor.getCurrentArea();
		var nextQuizId = VISH.Editor.getId();
		current_area.attr('type','quiz');
		//TODO change id? ask to Kike 
		var container = "<div class='mcquestion_container'><div class='mcquestion_body'></div><div class='mcquestion_buttons'></div></div>";
		current_area.html(container);
		var header ="<div id='tab_quiz_mchoice_content_header' areaid='header' class='t11_header'> </div>";
		var question = "<h2 class='quiz_mch_question_in_template' >" + $("#tab_quiz_mchoice_content_container").find(".value_multiplechoice_question").val() + "</h2>";
		var form = "<form class='mcquestion_form' method='post'></form>";
		current_area.find(".mcquestion_body").append(header + question + form);
		$("#tab_quiz_mchoice_content_container").find(".ul_mch_options > li").each(function(index, value) {
			var option = "<label class='mc_answer'>" + choicesLetters[index]+ " " + $(value).find(".multiplechoice_text").val() + "</label>";
			//var percentBar = "<div class='mc_meter'><span style='width:0%'></span></div><label class='mcoption_label'></label>";
			current_area.find(".mcquestion_form").append(option);
		}); 
		
		V.Editor.addDeleteButton(current_area);
		//return current_area;


	}; */		


	var _addOpenQuiz = function() {

	};

	var _addMultipleChoiceQuiz = function(area) {
		V.Debugging.log(" addMultipleChoiceQuiz detected");	
		//getDummy($(this).attr('template'), VISH.Slides.getSlides().length, theid, false)
		var quiz = VISH.Dummies.getQuizDummy("multiplechoice", V.Slides.getSlides().length);
		if(area){
			var current_area = area;
		}	else {
			var current_area = VISH.Editor.getCurrentArea();
		}
		$(current_area).find(".menuselect_hide").remove();
		current_area.attr('type','quiz');
		current_area.append(quiz);
		
		V.Editor.addDeleteButton(current_area);
		
		
		launchTextEditorInTextArea(current_area);

	};

	var _addTrueFalseQuiz = function() {
	};



 var launchTextEditorInTextArea = function(area){
 		//TODO Ask Aldo about the use of nicEditor
 	current_area = area;
   	var textArea = $(current_area).find(".value_multiplechoice_question_in_zone");		
   	var wysiwygId = "wysiwyg_" + current_area.attr("id"); //wysiwig_zoneX 
   	textArea.attr("id", wysiwygId);
  	textArea.addClass("wysiwygInstance");
    // textArea.addClass("wysiwygInstance");	
	// only one instance of the NicEditor is created
	V.Debugging.log("myNicEditor initilized : " + V.Editor.Text.nicInitilized());
    if(V.Editor.Text.nicInitilized() == false) { 

		VISH.Editor.Text.init();
		myNicEditor = VISH.Editor.Text.getNicEditor();

	} else { 

		myNicEditor = VISH.Editor.Text.getNicEditor();
	    V.Debugging.log("myNicEditor : " + myNicEditor);
	}
	   	var test =  myNicEditor.addInstance(wysiwygId);

   	V.Debugging.log("returned value when add Instance to NicEditor : " + $(test).html());
    V.Debugging.log("textArea id : " + textArea.attr("id"));
  };



	return {
		drawQuiz						: drawQuiz,
		init			 				: init, 
		onLoadTab						: onLoadTab, 
		addMChoiceQuiz					: addMChoiceQuiz, 
		addQuiz							: addQuiz

	};

}) (VISH, jQuery);
