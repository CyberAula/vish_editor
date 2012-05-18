VISH.Editor.Quiz = (function(V,$,undefined){
	var buttonAddOptionId = "a_add_quiz_option";
	//var buttonAddOptionClass = "add_quiz_option"; //con esto sí funciona	
	var MultipleChoiceoptionClass = "multiplechoice_radio";
	var searchOptionText= "mchoice_radio_option_";
	
	var number_patern =/[0-9]/;
	var init = function(){
		//$(document).on('click','.add_quiz_option', addMultipleChoiceOption);
		$(document).on('click','#'+buttonAddOptionId , addMultipleChoiceOption);
		console.log("Entramos en init (Quiz) y buscamos class de a: " + $(".add_quiz_option") );
		
	};	
	/*
	 Function that add an input radio option for the Multiple Choice Quiz  
	 * */
	var addMultipleChoiceOption = function(event){
		
		console.log("Entramos en addMultipleChoiceOption (Quiz)");
		
		//var radio_option = $("."+MultipleChoiceoptionClass);
		//console.log("MultipleChoice Option Class :  "+ radio_option );
		
		//the input in text type  
		var text  = $('<div>').append($('.' +MultipleChoiceoptionClass).clone()).html();
		
		console.log("text vale:  "+ text);
		
		//temp solution  
		var number = text.substr(32, 1); //TODO find better way to count radio inputs
		var next_num = parseInt(number)+1; // increase 
		console.log("number con patrones y match vale:  "+ number );
		console.log("next_number :  "+ next_num );
		    //the next radio input   
			var add_option = "<br><input id='mchoice_radio_option_"+next_num+"' type='radio' class='multiplechoice_radio' /><input id='radio_text_"+next_num+"' type='text' placeholder='insert text option here' />";
			add_option += "<a src='' id='"+buttonAddOptionId+"' class='add_quiz_option'><img src='images/add_quiz_option.png' id='add_quiz_option_img'/> </a>";
			
			//remove button + 
			$(".add_quiz_option").remove();
			//add radio + button 			
			$(".mcquestion").append(add_option);	
			//add onclick event to the button + 
			$(document).on('click','#'+buttonAddOptionId , addMultipleChoiceOption);
				
		
	};
			
	return {
		init: init, 
		addMultipleChoiceOption: addMultipleChoiceOption 
	};

}) (VISH, jQuery);
