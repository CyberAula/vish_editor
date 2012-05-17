VISH.Editor.Quiz = (function(V,$,undefined){
		
	var init = function(){
		$(document).on('click','.add_quiz_option', addMultipleChoiceOption);
		console.log("Entramos en init (Quiz) y buscamos class de a: " + $(".add_quiz_option") );
		
	};	
	
	var addMultipleChoiceOption = function(event){
		
		//we must get the number of options
		console.log("Entramos en addMultipleChoiceOption (Quiz)");
		
		var radio_option = $("#mchoice_radio_option ");
		
		console.log( "Radio button " + $("#mchoice_radio_option "));
			var add_option = "<br><input id='mchoice_radio_option 2' type='radio' class='multiplechoice_radio' /><input id='radio_text_2' type='text' placeholder='insert text option here' />";
			add_option += "<a src='' id='add_quiz_option' class='add_quiz_option'><img src='images/add_quiz_option.png' id='add_quiz_option_img'/> </a>";
			
			$(".add_quiz_option").remove();
			
			$(".mcquestion").append(add_option);	
			
			console.log("add_option : " +add_option);
		
		
	};
			
	return {
		init: init, 
		addMultipleChoiceOption: addMultipleChoiceOption 
	};

}) (VISH, jQuery);
