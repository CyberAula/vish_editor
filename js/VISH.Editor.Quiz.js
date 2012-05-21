VISH.Editor.Quiz = (function(V,$,undefined){
	var buttonAddOptionId = "a_add_quiz_option";
	//var buttonAddOptionClass = "add_quiz_option"; //con esto sí funciona	
	var MultipleChoiceOptionClass = "multiplechoice_text";
	var searchOptionText= "mchoice_radio_option_";
	var num_options = 5; // maximum options can be added
	
	var init = function(){
		//$(document).on('click','.add_quiz_option', addMultipleChoiceOption);
		$(document).on('click','#'+buttonAddOptionId , addMultipleChoiceOption);
			
	};	
	/*
	 Function that add an input radio option for the Multiple Choice Quiz  
	 * */
	var addMultipleChoiceOption = function(event){
		
		console.log("Entramos en addMultipleChoiceOption (Quiz)");
		
		//var radio_option = $("."+MultipleChoiceoptionClass);
		//console.log("MultipleChoice Option Class :  "+ radio_option );
		
		//the input in text type  
		var text  = $('<div>').append($('.' +MultipleChoiceOptionClass).clone()).html();
		
		//console.log("text vale:  "+ text);
		
		var total = 0;
		
		// get the number of radio inputs 
	$('.'+MultipleChoiceOptionClass).each(function(i){
 total = i;
}); 		
		var next_num = parseInt(total)+1;
		if (next_num < num_options) {
			console.log("next_number :  "+ next_num );
		  
		    //the next radio input   
			var add_option = "<br><input id='radio_text_"+next_num+"' class='"+MultipleChoiceOptionClass+"' type='text' placeholder='insert text option here' />";
			add_option += "<a src='' id='"+buttonAddOptionId+"' class='add_quiz_option'><img src='images/add_quiz_option.png' id='add_quiz_option_img'/> </a>";
			
			//remove button + 
			$(".add_quiz_option").remove();
			//add radio + button 			
			$(".mcquestion").append(add_option);	
			
		} else if (next_num = num_options) {
			
			var add_option = "<br><input id='radio_text_"+next_num+"' class='"+MultipleChoiceOptionClass+"' type='text' placeholder='insert text option here' />";
			add_option += "<a src='' id='"+buttonAddOptionId+"' class='add_quiz_option'>";
			
			$(".add_quiz_option").remove();
			
			$(".mcquestion").append(add_option);
		}
		
	};
			
	return {
		init: init, 
		addMultipleChoiceOption: addMultipleChoiceOption 
	};

}) (VISH, jQuery);
