VISH.Editor.Quiz = (function(V,$,undefined){
	var maxNumMultipleChoiceOptions = 6; // maximum input options 
	var choicesLetters = ['a)','b)','c)','d)','e)','f)'];

	var init = function(){
		$(document).on('click','.add_quiz_option', _addMultipleChoiceOption);
		$(document).on('click','.remove_quiz_option', _removeMultipleChoiceOption);
		$(document).on('keydown','.multiplechoice_text', _onKeyDown);
	};	
	//for embeding a quiz into a template
	var onLoadTab = function (tab) {

		if(tab=="quiz_mchoice") {

			_onLoadTabMChoiceQuiz();
		} else if (tab=="quiz_open"){

			V.Debugging.log("quiz open load tab");

		}

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
		//removeMultipleChoiceOption trigger always from img click
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
	//first kind of quiz shown
	var _onLoadTabMChoiceQuiz = function() {

		V.Debugging.log("enter into onLoadTabMChoiceQuiz");

	};

	return {
		drawQuiz				: drawQuiz,
		init			 		: init, 
		onLoadTab				:onLoadTab
	};

}) (VISH, jQuery);